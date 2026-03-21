from typing import Dict, Any, List
from datetime import datetime


class AuditLoggerAgent:
    def __init__(self):
        self.logs: List[Dict[str, Any]] = []

    async def log(
        self,
        event_type: str,
        action: str,
        result: str,
        user_id: str = None,
        ip: str = None,
        resource: str = None,
        metadata: Dict = None,
    ) -> Dict[str, Any]:

        entry = {
            "event_type": event_type,
            "user_id": user_id,
            "ip": ip,
            "action": action,
            "resource": resource,
            "result": result,
            "metadata": metadata or {},
            "timestamp": datetime.utcnow().isoformat(),
        }

        self.logs.append(entry)

        return entry

    async def get_logs(
        self, event_type: str = None, user_id: str = None, limit: int = 100
    ) -> List[Dict[str, Any]]:
        filtered = self.logs

        if event_type:
            filtered = [l for l in filtered if l["event_type"] == event_type]

        if user_id:
            filtered = [l for l in filtered if l.get("user_id") == user_id]

        return filtered[-limit:]

    async def get_statistics(self) -> Dict[str, Any]:
        total = len(self.logs)

        by_type = {}
        for log in self.logs:
            event_type = log.get("event_type", "unknown")
            by_type[event_type] = by_type.get(event_type, 0) + 1

        by_result = {}
        for log in self.logs:
            result = log.get("result", "unknown")
            by_result[result] = by_result.get(result, 0) + 1

        return {"total_events": total, "by_event_type": by_type, "by_result": by_result}
