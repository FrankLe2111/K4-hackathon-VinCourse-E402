import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Copy,
  Crown,
  Music,
  QrCode,
  ShieldAlert,
  Swords,
  Timer,
  Trophy,
  Users,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { submitMode } from "../../api/modes";
import type { GameResult, GameSession } from "../../types/game";
import "./boss-battle.css";

type Props = {
  session: GameSession;
  onCompleted: () => void;
};

type GameState = "lobby" | "countdown" | "question" | "locked" | "reveal" | "leaderboard" | "damage" | "victory";

type BossRound = {
  round_id: string;
  title: string;
  concept_id: string;
  question: string;
  options: Array<{ id: string; label: string }>;
};

type Player = {
  player_id: string;
  nickname: string;
  avatar?: string;
};

type LeaderboardRow = {
  player_id: string;
  nickname: string;
  correct: boolean;
  score_delta: number;
  elapsed_seconds: number;
  rank?: number;
  rank_delta?: number;
};

type DistributionRow = {
  option_id: string;
  label: string;
  count: number;
  percent: number;
  correct: boolean;
  selected_by_player: boolean;
};

type BossPayload = {
  room?: { room_code?: string; join_url?: string; host_name?: string };
  boss?: { boss_name?: string; max_hp?: number; hp?: number; attack_damage?: number };
  rules?: { threshold?: number; round_time_seconds?: number; correct_points?: number; damage_rule?: string };
  players?: Player[];
  rounds?: BossRound[];
  ai_enabled?: boolean;
};

const STORAGE_KEY = "vincourse-boss-player";
const COUNTDOWN = ["3", "2", "1", "FIGHT"];
const ANSWER_COLORS = ["red", "blue", "gold", "green"];

function getStoredName() {
  return localStorage.getItem(STORAGE_KEY) ?? "";
}

function playerIdFromName(name: string) {
  return `guest-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "player"}`;
}

export function BossBattleView({ session, onCompleted }: Props) {
  const payload = session.payload as BossPayload;
  const rounds = Array.isArray(payload.rounds) ? payload.rounds : [];
  const players = Array.isArray(payload.players) ? payload.players : [];
  const threshold = Number(payload.rules?.threshold ?? 80);
  const maxHp = Number(payload.boss?.max_hp ?? 100);
  const damage = Number(payload.boss?.attack_damage ?? 25);
  const timerSeconds = Number(payload.rules?.round_time_seconds ?? 30);
  const maxPoints = Number(payload.rules?.correct_points ?? 1000);
  const [nickname, setNickname] = useState(getStoredName());
  const [joined, setJoined] = useState(Boolean(getStoredName()));
  const [muted, setMuted] = useState(false);
  const [gameState, setGameState] = useState<GameState>(Boolean(getStoredName()) ? "lobby" : "lobby");
  const [countdownStep, setCountdownStep] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(8);
  const [bossHp, setBossHp] = useState(Number(payload.boss?.hp ?? 100));
  const [totalScore, setTotalScore] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);
  const [history, setHistory] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentRound = rounds[roundIndex] ?? rounds[0];
  const resultPayload = result?.payload as {
    correct_rate?: number;
    correct_count?: number;
    active_players?: number;
    boss_damaged?: boolean;
    damage?: number;
    player_score?: number;
    speed_bonus?: number;
    ai_mentor?: string;
    correct_option_id?: string;
    answer_distribution?: DistributionRow[];
    leaderboard?: LeaderboardRow[];
  } | undefined;
  const leaderboard = Array.isArray(resultPayload?.leaderboard) ? resultPayload.leaderboard : [];
  const distribution = Array.isArray(resultPayload?.answer_distribution) ? resultPayload.answer_distribution : [];
  const correctRate = Number(resultPayload?.correct_rate ?? 0);
  const hpPercent = Math.max(0, Math.round((bossHp / maxHp) * 100));
  const roomCode = payload.room?.room_code ?? "VINC24";
  const joinUrl = payload.room?.join_url ?? `/boss/join/${roomCode}`;
  const answeredCount = gameState === "question" ? Math.min(players.length + 1, 3 + roundIndex * 2 + (selectedOption ? 5 : 0)) : players.length + (joined ? 1 : 0);
  const activeCount = players.length + (joined ? 1 : 0);
  const isFinished = bossHp <= 0 || roundIndex >= rounds.length;

  const projectedPlayers = useMemo(() => {
    const guest = joined ? [{ player_id: playerIdFromName(nickname), nickname: nickname.trim() || "You", avatar: "YOU" }] : [];
    return [...guest, ...players];
  }, [joined, nickname, players]);

  function joinRoom() {
    const cleanName = nickname.trim() || "Guest Player";
    localStorage.setItem(STORAGE_KEY, cleanName);
    setNickname(cleanName);
    setJoined(true);
  }

  function startBattle() {
    if (!joined) joinRoom();
    setResult(null);
    setSelectedOption("");
    setCountdownStep(0);
    setGameState("countdown");
  }

  function advanceCountdown() {
    if (countdownStep >= COUNTDOWN.length - 1) {
      setGameState("question");
      setCountdownStep(0);
      return;
    }
    setCountdownStep((current) => current + 1);
  }

  async function lockAnswer(optionId: string) {
    if (!currentRound || loading || gameState !== "question") return;
    setSelectedOption(optionId);
    setGameState("locked");
    setLoading(true);
    setError("");
    try {
      const next = await submitMode("boss_battle", {
        user_id: playerIdFromName(nickname),
        course_id: "ml-foundations",
        session_id: session.session_id,
        question_id: currentRound.round_id,
        answer: JSON.stringify({
          room_code: roomCode,
          nickname,
          round_id: currentRound.round_id,
          option_id: optionId,
          elapsed_seconds: elapsedSeconds,
        }),
        confidence: 4,
      });
      const nextPayload = next.payload as { player_score?: number };
      setTotalScore((current) => current + Number(nextPayload.player_score ?? 0));
      setResult(next);
      setHistory((items) => [...items, next]);
      onCompleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể gửi câu trả lời Boss Battle.");
      setGameState("question");
    } finally {
      setLoading(false);
    }
  }

  function showLeaderboard() {
    setGameState("leaderboard");
  }

  function showBossDamage() {
    const nextDamage = Number(resultPayload?.damage ?? 0);
    setBossHp((current) => Math.max(0, current - nextDamage));
    setGameState("damage");
  }

  function nextRound() {
    if (bossHp <= 0 || roundIndex >= rounds.length - 1) {
      setGameState("victory");
      return;
    }
    const nextIndex = roundIndex + 1;
    setRoundIndex(nextIndex);
    setSelectedOption("");
    setElapsedSeconds(Math.min(timerSeconds, 7 + nextIndex * 4));
    setResult(null);
    setCountdownStep(0);
    setGameState("countdown");
  }

  if (!currentRound) {
    return <section className="boss-shell"><div className="boss-card">Boss Battle chưa có round demo.</div></section>;
  }

  return (
    <section className={`boss-shell state-${gameState}`}>
      <div className="boss-audio-strip" aria-hidden="true">
        <Music size={16} />
        <span>{muted ? "Sound off" : gameState === "question" ? "Tick tick..." : "Battle theme"}</span>
        <button type="button" onClick={() => setMuted((value) => !value)} aria-label="Bật tắt âm thanh">
          {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>
      </div>

      <div className="boss-hero">
        <div>
          <p>Boss Battle · Live Arena</p>
          <h1>{payload.boss?.boss_name ?? "The Broken Model"}</h1>
          <span>Mỗi người đua điểm riêng như Kahoot. Cả lớp phải đạt {threshold}% đúng để mở khóa đòn đánh boss.</span>
        </div>
        <div className="boss-room-card">
          <QrCode size={34} />
          <small>Room code</small>
          <strong>{roomCode}</strong>
          <span><Copy size={14} /> {joinUrl}</span>
        </div>
      </div>

      <div className="boss-status-row">
        <div><Crown size={18} /><span>Điểm của bạn</span><strong>{totalScore}</strong></div>
        <div><Users size={18} /><span>Người chơi</span><strong>{activeCount}</strong></div>
        <div><Zap size={18} /><span>Ngưỡng sát thương</span><strong>{threshold}%</strong></div>
        <div><Swords size={18} /><span>Boss HP</span><strong>{bossHp}/{maxHp}</strong></div>
      </div>

      {gameState === "lobby" ? (
        <article className="boss-lobby">
          <div className="boss-lobby-main">
            <span className="boss-live-pill">Waiting for players</span>
            <h2>Join at VinCourse Boss</h2>
            <strong>{roomCode}</strong>
            <p>Nhập nickname, nhìn tên mình xuất hiện trong lobby, rồi bấm Start Battle để bắt đầu countdown.</p>
            <div className="boss-join-row">
              <input value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder="Nickname của bạn" />
              <button onClick={joinRoom}>{joined ? "Đã join" : "Join"}</button>
            </div>
            <button className="boss-start" onClick={startBattle}>Start Battle</button>
          </div>
          <div className="boss-player-cloud">
            {projectedPlayers.map((player, index) => (
              <span key={player.player_id} style={{ animationDelay: `${index * 70}ms` }}>{player.avatar ?? player.nickname.slice(0, 2).toUpperCase()} · {player.nickname}</span>
            ))}
          </div>
        </article>
      ) : null}

      {gameState === "countdown" ? (
        <article className="boss-countdown" onClick={advanceCountdown}>
          <small>{currentRound.title}</small>
          <strong>{COUNTDOWN[countdownStep]}</strong>
          <span>Bấm để chuyển nhịp countdown</span>
        </article>
      ) : null}

      {gameState === "question" || gameState === "locked" || gameState === "reveal" ? (
        <div className="boss-play-stage">
          <article className="boss-question-stage">
            <div className="boss-question-top">
              <div className="boss-timer"><Timer size={20} /><strong>{Math.max(0, timerSeconds - elapsedSeconds)}</strong></div>
              <div><span>{answeredCount}/{activeCount} đã trả lời</span><b>{maxPoints} pts</b></div>
            </div>
            <h2>{currentRound.question}</h2>
            <div className="boss-answer-grid">
              {currentRound.options.map((option, index) => {
                const isSelected = selectedOption === option.id;
                const isCorrect = resultPayload?.correct_option_id === option.id;
                const revealClass = gameState === "reveal" ? (isCorrect ? "correct-answer" : isSelected ? "wrong-answer" : "dimmed") : "";
                return (
                  <button
                    key={option.id}
                    className={`${ANSWER_COLORS[index] ?? "green"} ${isSelected ? "selected" : ""} ${revealClass}`}
                    onClick={() => void lockAnswer(option.id)}
                    disabled={gameState !== "question"}
                  >
                    <i>{["◆", "●", "▲", "■"][index]}</i>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
            {gameState === "question" ? (
              <div className="boss-speed">
                <span>Demo response time: {elapsedSeconds}s</span>
                <input type="range" min="2" max={timerSeconds} value={elapsedSeconds} onChange={(event) => setElapsedSeconds(Number(event.target.value))} />
              </div>
            ) : null}
            {gameState === "locked" ? <div className="boss-locked">Đáp án đã khóa. Đang chờ cả lớp...</div> : null}
            {gameState === "reveal" ? <button className="boss-stage-action" onClick={showLeaderboard}>Xem leaderboard</button> : null}
            {error ? <p className="boss-error">{error}</p> : null}
          </article>

          <aside className="boss-side-panel">
            <div className="boss-hp"><span style={{ width: `${hpPercent}%` }} /></div>
            {gameState === "locked" && loading ? <p className="boss-ai-coach">Đang gọi AI mentor và tính điểm...</p> : null}
            {result && gameState === "locked" && !loading ? <button className="boss-stage-action" onClick={() => setGameState("reveal")}>Reveal đáp án</button> : null}
            {gameState === "reveal" ? (
              <div className="boss-distribution">
                {distribution.map((row) => (
                  <div key={row.option_id} className={row.correct ? "correct" : row.selected_by_player ? "selected" : ""}>
                    <span>{row.count}</span>
                    <b style={{ width: `${row.percent}%` }} />
                    <small>{row.percent}%</small>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="boss-rules">
                <li>Đúng nhanh sẽ gần {maxPoints} điểm.</li>
                <li>Sau reveal sẽ hiện phân bố đáp án.</li>
                <li>Leaderboard xuất hiện dạng overlay sau mỗi câu.</li>
              </ul>
            )}
          </aside>
        </div>
      ) : null}

      {gameState === "leaderboard" ? (
        <div className="boss-overlay">
          <article className="boss-leaderboard-modal">
            <span className="boss-live-pill">Leaderboard</span>
            <h2>Ai đang dẫn đầu?</h2>
            <div className="boss-leaderboard">
              {leaderboard.map((row, index) => (
                <div key={`${row.player_id}-${index}`} className={`${row.correct ? "correct" : ""} ${row.player_id === playerIdFromName(nickname) ? "you" : ""}`}>
                  <strong>#{row.rank ?? index + 1}</strong>
                  <span>{row.nickname}</span>
                  <b className="score-pop">+{row.score_delta}</b>
                  <em className={Number(row.rank_delta ?? 0) >= 0 ? "up" : "down"}>
                    {Number(row.rank_delta ?? 0) >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    {Math.abs(Number(row.rank_delta ?? 0))}
                  </em>
                </div>
              ))}
            </div>
            <button className="boss-stage-action" onClick={showBossDamage}>Tính sát thương Boss</button>
          </article>
        </div>
      ) : null}

      {gameState === "damage" ? (
        <article className={`boss-damage-stage ${resultPayload?.boss_damaged ? "hit" : "blocked"}`}>
          <div className="boss-monster"><Swords size={54} /></div>
          <div>
            <span className="boss-live-pill">{resultPayload?.correct_count}/{resultPayload?.active_players} đúng · {correctRate}%</span>
            <h2>{resultPayload?.boss_damaged ? `CLASS ATTACK -${resultPayload.damage} HP` : "ATTACK BLOCKED"}</h2>
            <p>{resultPayload?.ai_mentor}</p>
            <button className="boss-stage-action" onClick={nextRound}>{isFinished ? "Xem podium" : "Round tiếp theo"}</button>
          </div>
        </article>
      ) : null}

      {gameState === "victory" ? (
        <article className="boss-podium">
          <Trophy size={48} />
          <span className="boss-live-pill">{bossHp <= 0 ? "Boss defeated" : "Battle complete"}</span>
          <h2>Final Podium</h2>
          <div className="boss-podium-grid">
            {leaderboard.slice(0, 3).map((row, index) => (
              <div key={row.player_id} className={`place-${index + 1}`}>
                <strong>#{index + 1}</strong>
                <span>{row.nickname}</span>
                <b>{row.score_delta} pts</b>
              </div>
            ))}
          </div>
          <p>AI mentor đã tổng kết lỗi chung sau từng round, còn leaderboard tạo động lực đua tranh cá nhân.</p>
        </article>
      ) : null}

      {gameState !== "lobby" && gameState !== "countdown" && gameState !== "victory" ? (
        <div className="boss-phase-list">
          {rounds.map((round, index) => (
            <span key={round.round_id} className={index < history.length ? "done" : index === roundIndex ? "active" : ""}>
              {index + 1}. {round.title.replace(/^Round \d+: /, "")}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
