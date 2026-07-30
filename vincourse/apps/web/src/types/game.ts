export type GameMode =
  | "story"
  | "daily_recall"
  | "error_dungeon"
  | "lab_arena"
  | "boss_battle"
  | "live_battle"
  | "understanding";

export type GameStatus =
  | "mastered"
  | "partial"
  | "misconception"
  | "needs_clarification"
  | "out_of_scope";

export type ModeInfo = {
  mode: GameMode;
  title: string;
  owner: string;
  description: string;
  ready: boolean;
};

export type GameSession = {
  mode: GameMode;
  session_id: string;
  title: string;
  prompt: string;
  evidence_ids: string[];
  payload: Record<string, unknown>;
};

export type GameSubmitRequest = {
  user_id: string;
  course_id: string;
  session_id: string;
  question_id: string;
  answer: string;
  confidence: number;
};

export type GameResult = {
  mode: GameMode;
  correct: boolean;
  status: GameStatus;
  feedback: string;
  evidence_ids: string[];
  misconception_id: string;
  xp: number;
  mastery_delta: number;
  recovery_created: boolean;
  next_action: string;
};

export type ProgressSummary = {
  user_id: string;
  xp: number;
  completed_modes: GameMode[];
  recovery_queue_size: number;
};

