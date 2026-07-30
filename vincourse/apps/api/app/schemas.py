from enum import StrEnum

from pydantic import BaseModel, Field


class GameMode(StrEnum):
    story = "story"
    daily_recall = "daily_recall"
    error_dungeon = "error_dungeon"
    lab_arena = "lab_arena"
    boss_battle = "boss_battle"
    live_battle = "live_battle"
    understanding = "understanding"


class GameStatus(StrEnum):
    mastered = "mastered"
    partial = "partial"
    misconception = "misconception"
    needs_clarification = "needs_clarification"
    out_of_scope = "out_of_scope"


class ModeInfo(BaseModel):
    mode: GameMode
    title: str
    owner: str
    description: str
    ready: bool = False


class GameSubmitRequest(BaseModel):
    user_id: str = "demo-user"
    course_id: str = "ml-foundations"
    session_id: str
    question_id: str
    answer: str
    confidence: int = Field(ge=1, le=5, default=3)


class GameSession(BaseModel):
    mode: GameMode
    session_id: str
    title: str
    prompt: str
    evidence_ids: list[str] = Field(default_factory=list)
    payload: dict = Field(default_factory=dict)


class GameResult(BaseModel):
    mode: GameMode
    correct: bool
    status: GameStatus
    feedback: str
    evidence_ids: list[str] = Field(default_factory=list)
    misconception_id: str = ""
    xp: int = 0
    mastery_delta: int = 0
    recovery_created: bool = False
    next_action: str


class ProgressSummary(BaseModel):
    user_id: str
    xp: int
    completed_modes: list[GameMode]
    recovery_queue_size: int

