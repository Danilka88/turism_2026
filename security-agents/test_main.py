import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime

from main import app
from agents.audit_logger_agent import AuditLoggerAgent
from agents.threat_detector_agent import ThreatDetectorAgent
from agents.user_behavior_agent import UserBehaviorAgent
from models.schemas import ThreatLevel, ContentType


class MockOllamaService:
    async def analyze(self, prompt: str, system_prompt: str = ""):
        return {
            "success": True,
            "response": '{"threat_level": "low", "risk_score": 0.1, "anomalies": [], "action": "allow"}',
        }


class TestAuditLoggerAgent:
    def setup_method(self):
        self.logger = AuditLoggerAgent()

    @pytest.mark.asyncio
    async def test_log_single_event(self):
        result = await self.logger.log(
            event_type="test_event",
            action="test_action",
            result="success",
            user_id="user123",
            ip="192.168.1.1",
        )

        assert result["event_type"] == "test_event"
        assert result["action"] == "test_action"
        assert result["user_id"] == "user123"
        assert result["ip"] == "192.168.1.1"
        assert "timestamp" in result

    @pytest.mark.asyncio
    async def test_get_logs_no_filter(self):
        await self.logger.log("event1", "action1", "result1")
        await self.logger.log("event2", "action2", "result2")

        logs = await self.logger.get_logs()
        assert len(logs) == 2

    @pytest.mark.asyncio
    async def test_get_logs_filter_by_event_type(self):
        await self.logger.log("user_check", "action1", "result1")
        await self.logger.log("user_check", "action2", "result2")
        await self.logger.log("threat_detected", "action3", "result3")

        logs = await self.logger.get_logs(event_type="user_check")
        assert len(logs) == 2

    @pytest.mark.asyncio
    async def test_get_logs_filter_by_user_id(self):
        await self.logger.log("event1", "action1", "result1", user_id="user1")
        await self.logger.log("event2", "action2", "result2", user_id="user2")

        logs = await self.logger.get_logs(user_id="user1")
        assert len(logs) == 1
        assert logs[0]["user_id"] == "user1"

    @pytest.mark.asyncio
    async def test_get_logs_limit(self):
        for i in range(20):
            await self.logger.log(f"event{i}", f"action{i}", "result")

        logs = await self.logger.get_logs(limit=5)
        assert len(logs) == 5

    @pytest.mark.asyncio
    async def test_get_statistics(self):
        await self.logger.log("user_check", "action1", "completed", user_id="u1")
        await self.logger.log("user_check", "action2", "blocked", user_id="u2")
        await self.logger.log("threat_detected", "action3", "logged")

        stats = await self.logger.get_statistics()

        assert stats["total_events"] == 3
        assert stats["by_event_type"]["user_check"] == 2
        assert stats["by_event_type"]["threat_detected"] == 1
        assert stats["by_result"]["completed"] == 1
        assert stats["by_result"]["blocked"] == 1
        assert stats["by_result"]["logged"] == 1


class TestThreatDetectorAgent:
    def setup_method(self):
        self.mock_service = MockOllamaService()
        self.agent = ThreatDetectorAgent(self.mock_service)

    @pytest.mark.asyncio
    async def test_detect_no_threat(self):
        result = await self.agent.detect(
            ip="192.168.1.1", request_data={"action": "view"}, endpoint="/api/locations"
        )

        assert "threat_detected" in result
        assert "threat_type" in result
        assert "confidence" in result
        assert "blocked" in result
        assert "action_taken" in result

    @pytest.mark.asyncio
    async def test_detect_with_sql_injection(self):
        mock_service = MagicMock()
        mock_service.analyze = AsyncMock(
            return_value={
                "success": True,
                "response": '{"threat_detected": true, "threat_type": "sql_injection", "confidence": 0.95, "blocked": true, "action": "block"}',
            }
        )

        agent = ThreatDetectorAgent(mock_service)
        result = await agent.detect(
            ip="192.168.1.1",
            request_data={"query": "'; DROP TABLE users; --"},
            endpoint="/api/search",
        )

        assert result["threat_detected"] is True
        assert result["threat_type"] == "sql_injection"
        assert result["blocked"] is True

    @pytest.mark.asyncio
    async def test_detect_with_xss(self):
        mock_service = MagicMock()
        mock_service.analyze = AsyncMock(
            return_value={
                "success": True,
                "response": '{"threat_detected": true, "threat_type": "xss", "confidence": 0.9, "blocked": true, "action": "block"}',
            }
        )

        agent = ThreatDetectorAgent(mock_service)
        result = await agent.detect(
            ip="192.168.1.1",
            request_data={"comment": "<script>alert('xss')</script>"},
            endpoint="/api/review",
        )

        assert result["threat_detected"] is True
        assert result["threat_type"] == "xss"

    @pytest.mark.asyncio
    async def test_detect_fallback_on_failure(self):
        mock_service = MagicMock()
        mock_service.analyze = AsyncMock(return_value={"success": False})

        agent = ThreatDetectorAgent(mock_service)
        result = await agent.detect(
            ip="192.168.1.1", request_data={}, endpoint="/api/test"
        )

        assert result["threat_detected"] is False
        assert result["confidence"] == 0.0


class TestUserBehaviorAgent:
    def setup_method(self):
        self.mock_service = MockOllamaService()
        self.agent = UserBehaviorAgent(self.mock_service)

    @pytest.mark.asyncio
    async def test_analyze_normal_user(self):
        result = await self.agent.analyze(
            {
                "user_id": "user123",
                "action": "view_map",
                "ip": "192.168.1.1",
                "user_agent": "Mozilla/5.0",
                "session_duration": 300,
                "request_count": 10,
            }
        )

        assert "threat_level" in result
        assert "risk_score" in result
        assert "anomalies" in result
        assert "action" in result

    @pytest.mark.asyncio
    async def test_analyze_suspicious_user(self):
        mock_service = MagicMock()
        mock_service.analyze = AsyncMock(
            return_value={
                "success": True,
                "response": '{"threat_level": "high", "risk_score": 0.85, "anomalies": ["high_request_rate", "bot_pattern"], "action": "block"}',
            }
        )

        agent = UserBehaviorAgent(mock_service)
        result = await agent.analyze(
            {
                "user_id": "suspicious_user",
                "action": "bulk_download",
                "ip": "10.0.0.1",
                "request_count": 5000,
            }
        )

        assert result["threat_level"] == "high"
        assert result["risk_score"] > 0.5
        assert len(result["anomalies"]) > 0

    @pytest.mark.asyncio
    async def test_analyze_fallback_on_failure(self):
        mock_service = MagicMock()
        mock_service.analyze = AsyncMock(return_value={"success": False})

        agent = UserBehaviorAgent(mock_service)
        result = await agent.analyze({"user_id": "test", "action": "test"})

        assert result["threat_level"] == "low"
        assert result["risk_score"] == 0.0


class TestSchemas:
    def test_threat_level_enum(self):
        assert ThreatLevel.LOW.value == "low"
        assert ThreatLevel.MEDIUM.value == "medium"
        assert ThreatLevel.HIGH.value == "high"
        assert ThreatLevel.CRITICAL.value == "critical"

    def test_content_type_enum(self):
        assert ContentType.DESCRIPTION.value == "description"
        assert ContentType.IMAGE.value == "image"
        assert ContentType.VIDEO.value == "video"
        assert ContentType.REVIEW.value == "review"

    def test_user_check_request_valid(self):
        from models.schemas import UserCheckRequest

        req = UserCheckRequest(user_id="user123", action="view", ip="192.168.1.1")
        assert req.user_id == "user123"
        assert req.ip == "192.168.1.1"

    def test_threat_detection_request_valid(self):
        from models.schemas import ThreatDetectionRequest

        req = ThreatDetectionRequest(
            ip="192.168.1.1", endpoint="/api/test", request_data={"key": "value"}
        )
        assert req.ip == "192.168.1.1"
        assert req.endpoint == "/api/test"

    def test_content_moderation_request_valid(self):
        from models.schemas import ContentModerationRequest

        req = ContentModerationRequest(
            content="Test content",
            content_type=ContentType.DESCRIPTION,
            owner_id="owner123",
        )
        assert req.content == "Test content"
        assert req.content_type == ContentType.DESCRIPTION


class TestAPIEndpoints:
    def setup_method(self):
        from fastapi.testclient import TestClient

        self.client = TestClient(app)

    def test_health_check(self):
        response = self.client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
        assert response.json()["service"] == "security-agents"

    @pytest.mark.asyncio
    async def test_audit_logs_endpoint(self):
        from agents.audit_logger_agent import AuditLoggerAgent
        from main import app

        logger = AuditLoggerAgent()

        app.dependency_overrides[
            __import__("api.routes", fromlist=["audit_logger"]).__dict__.get(
                "audit_logger", None
            )
        ] = logger

        await logger.log("test_event", "test_action", "completed")

        response = self.client.get("/api/security/audit-logs")
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_audit_statistics_endpoint(self):
        logger = AuditLoggerAgent()

        await logger.log("event1", "action1", "completed")
        await logger.log("event2", "action2", "blocked")

        response = self.client.get("/api/security/audit-statistics")
        assert response.status_code == 200
        data = response.json()
        assert "total_events" in data
        assert "by_event_type" in data
