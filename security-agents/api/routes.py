from fastapi import APIRouter, HTTPException
from datetime import datetime

from agents import (
    UserBehaviorAgent,
    DataQualityAgent,
    ContentModeratorAgent,
    ThreatDetectorAgent,
    AuditLoggerAgent,
)
from models.schemas import (
    UserCheckRequest,
    UserCheckResponse,
    DataValidationRequest,
    DataValidationResponse,
    ContentModerationRequest,
    ContentModerationResponse,
    ThreatDetectionRequest,
    ThreatDetectionResponse,
    ThreatLevel,
)
from services.ollama_service import ollama_service

router = APIRouter()

user_behavior_agent = UserBehaviorAgent(ollama_service)
data_quality_agent = DataQualityAgent(ollama_service)
content_moderator_agent = ContentModeratorAgent(ollama_service)
threat_detector_agent = ThreatDetectorAgent(ollama_service)
audit_logger = AuditLoggerAgent()


@router.post("/check-user", response_model=UserCheckResponse)
async def check_user(request: UserCheckRequest):
    result = await user_behavior_agent.analyze(request.dict())

    await audit_logger.log(
        event_type="user_check",
        action=f"analyzed_user_{request.user_id}",
        result="completed",
        user_id=request.user_id,
        ip=request.ip,
    )

    return UserCheckResponse(
        user_id=request.user_id,
        threat_level=ThreatLevel(result.get("threat_level", "low")),
        risk_score=result.get("risk_score", 0.0),
        anomalies=result.get("anomalies", []),
        action_required=result.get("action"),
        timestamp=datetime.utcnow(),
    )


@router.post("/validate-data", response_model=DataValidationResponse)
async def validate_data(request: DataValidationRequest):
    result = await data_quality_agent.validate(request.dict())

    await audit_logger.log(
        event_type="data_validation",
        action="validated_content",
        result="completed",
        resource=request.source,
    )

    return DataValidationResponse(
        is_valid=result.get("is_valid", True),
        quality_score=result.get("quality_score", 1.0),
        duplicates_found=result.get("duplicates_found", []),
        issues=result.get("issues", []),
        recommendations=result.get("recommendations", []),
        timestamp=datetime.utcnow(),
    )


@router.post("/moderate", response_model=ContentModerationResponse)
async def moderate_content(request: ContentModerationRequest):
    result = await content_moderator_agent.moderate(
        request.content, request.content_type, request.owner_id
    )

    await audit_logger.log(
        event_type="content_moderation",
        action=f"moderated_{request.content_type}",
        result="approved" if result.get("is_approved") else "rejected",
        user_id=request.owner_id,
    )

    return ContentModerationResponse(
        is_approved=result.get("is_approved", True),
        moderation_score=result.get("moderation_score", 1.0),
        flagged_reasons=result.get("flagged_reasons", []),
        suggestions=result.get("suggestions", []),
        requires_manual_review=result.get("requires_manual_review", False),
        timestamp=datetime.utcnow(),
    )


@router.post("/detect-threat", response_model=ThreatDetectionResponse)
async def detect_threat(request: ThreatDetectionRequest):
    result = await threat_detector_agent.detect(
        request.ip, request.request_data or {}, request.endpoint
    )

    if result.get("threat_detected"):
        await audit_logger.log(
            event_type="threat_detected",
            action=f"blocked_{result.get('threat_type')}",
            result="blocked" if result.get("blocked") else "logged",
            ip=request.ip,
        )

    return ThreatDetectionResponse(
        threat_detected=result.get("threat_detected", False),
        threat_type=result.get("threat_type"),
        confidence=result.get("confidence", 0.0),
        blocked=result.get("blocked", False),
        action_taken=result.get("action_taken"),
        timestamp=datetime.utcnow(),
    )


@router.get("/audit-logs")
async def get_audit_logs(event_type: str = None, user_id: str = None, limit: int = 100):
    logs = await audit_logger.get_logs(event_type, user_id, limit)
    return {"logs": logs, "count": len(logs)}


@router.get("/audit-statistics")
async def get_audit_statistics():
    stats = await audit_logger.get_statistics()
    return stats
