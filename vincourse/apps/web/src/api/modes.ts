import { apiGet, apiPost } from "./client";
import type { GameMode, GameResult, GameSession, GameSubmitRequest, ModeInfo, ProgressSummary } from "../types/game";

const modePath: Record<GameMode, string> = {
  story: "story",
  daily_recall: "daily_recall",
  error_dungeon: "error_dungeon",
  lab_arena: "lab_arena",
  boss_battle: "boss_battle",
  live_battle: "live_battle",
  understanding: "understanding"
};

export function getHealth() {
  return apiGet<{ ok: boolean; demo_mode: boolean; model: string; openai_configured: boolean }>("/api/health");
}

export function listModes() {
  return apiGet<ModeInfo[]>("/api/modes");
}

export function getProgress() {
  return apiGet<ProgressSummary>("/api/progress");
}

export function resetProgress() {
  return apiPost<ProgressSummary>("/api/reset", {});
}

export function getModeSession(mode: GameMode, round?: number) {
  const query = mode === "lab_arena" && round ? `?round=${round}` : "";
  return apiGet<GameSession>(`/api/modes/${modePath[mode]}/session${query}`);
}

export function submitMode(mode: GameMode, request: GameSubmitRequest) {
  return apiPost<GameResult>(`/api/modes/${modePath[mode]}/submit`, request);
}
