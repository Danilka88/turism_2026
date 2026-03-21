from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class ThreatLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ContentType(str, Enum):
    DESCRIPTION = "description"
    IMAGE = "image"
    VIDEO = "video"
    REVIEW = "review"


class UserCheckRequest(BaseModel):
    user_id: str
    action: str
    ip: str
    user_agent: Optional[str] = None
    session_duration: Optional[int] = None
    request_count: Optional[int] = None


class UserCheckResponse(BaseModel):
    user_id: str
    threat_level: ThreatLevel
    risk_score: float = Field(ge=0, le=1)
    anomalies: List[str] = []
    action_required: Optional[str] = None
    timestamp: datetime


class DataValidationRequest(BaseModel):
    content: Optional[str] = None
    images: Optional[List[str]] = None
    source: str
    location_id: Optional[str] = None


class DataValidationResponse(BaseModel):
    is_valid: bool
    quality_score: float = Field(ge=0, le=1)
    duplicates_found: List[str] = []
    issues: List[str] = []
    recommendations: List[str] = []
    timestamp: datetime


class ContentModerationRequest(BaseModel):
    content: str
    content_type: ContentType
    owner_id: str
    location_id: Optional[str] = None


class ContentModerationResponse(BaseModel):
    is_approved: bool
    moderation_score: float = Field(ge=0, le=1)
    flagged_reasons: List[str] = []
    suggestions: List[str] = []
    requires_manual_review: bool
    timestamp: datetime


class ThreatDetectionRequest(BaseModel):
    ip: str
    request_data: Optional[dict] = None
    endpoint: str


class ThreatDetectionResponse(BaseModel):
    threat_detected: bool
    threat_type: Optional[str] = None
    confidence: float = Field(ge=0, le=1)
    blocked: bool
    action_taken: Optional[str] = None
    timestamp: datetime


class AuditLogEntry(BaseModel):
    event_type: str
    user_id: Optional[str] = None
    ip: Optional[str] = None
    action: str
    resource: Optional[str] = None
    result: str
    metadata: Optional[dict] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
