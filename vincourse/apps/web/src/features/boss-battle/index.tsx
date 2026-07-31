import { useEffect, useMemo, useRef, useState } from "react";
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

type Props = { session: GameSession; onCompleted: () => void };
type GameState = "lobby" | "countdown" | "question" | "locked" | "reveal" | "leaderboard" | "damage" | "victory";
type BossRound = { round_id: string; title: string; concept_id: string; question: string; options: Array<{ id: string; label: string }> };
type Player = { player_id: string; nickname: string; avatar?: string };
type LeaderboardRow = { player_id: string; nickname: string; correct: boolean; score_delta: number; elapsed_seconds: number; rank?: number; rank_delta?: number };
type DistributionRow = { option_id: string; label: string; count: number; percent: number; correct: boolean; selected_by_player: boolean };
type ResultPayload = {
  round_id?: string;
  round_title?: string;
  correct_rate?: number;
  correct_count?: number;
  active_players?: number;
  boss_damaged?: boolean;
  damage?: number;
  player_score?: number;
  ai_mentor?: string;
  correct_option_id?: string;
  answer_distribution?: DistributionRow[];
  leaderboard?: LeaderboardRow[];
};
type BossPayload = {
  room?: { room_code?: string; join_url?: string; host_name?: string };
  boss?: { boss_name?: string; max_hp?: number; hp?: number; attack_damage?: number };
  rules?: { threshold?: number; round_time_seconds?: number; correct_points?: number; damage_rule?: string };
  players?: Player[];
  rounds?: BossRound[];
};

const STORAGE_KEY = "vincourse-boss-player";
const COUNTDOWN = ["3", "2", "1", "CHIẾN"];
const ANSWER_COLORS = ["red", "blue", "gold", "green"];

function getStoredName() {
  return localStorage.getItem(STORAGE_KEY) ?? "";
}

function playerIdFromName(name: string) {
  return `guest-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "player"}`;
}

function useTone(muted: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null);
  return (frequency: number, durationMs = 120, type: OscillatorType = "sine") => {
    if (muted || !window.AudioContext) return;
    const context = audioContextRef.current ?? new AudioContext();
    audioContextRef.current = context;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + durationMs / 1000);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + durationMs / 1000);
  };
}

function AudioStrip({ muted, gameState, onToggle }: { muted: boolean; gameState: GameState; onToggle: () => void }) {
  return (
    <div className="boss-audio-strip" aria-hidden="true">
      <Music size={16} />
      <span>{muted ? "Tắt âm" : gameState === "question" ? "Đếm ngược" : "Nhạc trận"}</span>
      <button type="button" onClick={onToggle} aria-label="Bật tắt âm thanh">
        {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
      </button>
    </div>
  );
}

function Hero({ bossName, roomCode, joinUrl, threshold }: { bossName: string; roomCode: string; joinUrl: string; threshold: number }) {
  return (
    <div className="boss-hero">
      <div>
        <p>Đại chiến Trùm · Phòng trực tiếp</p>
        <h1>{bossName}</h1>
        <span>Mỗi người đua điểm riêng. Cả lớp cần đạt {threshold}% đúng để mở khóa đòn đánh boss.</span>
      </div>
      <div className="boss-room-card">
        <QrCode size={34} />
        <small>Mã phòng</small>
        <strong>{roomCode}</strong>
        <span><Copy size={14} /> {joinUrl}</span>
      </div>
    </div>
  );
}

function StatusRow({ totalScore, activeCount, threshold, bossHp, maxHp }: { totalScore: number; activeCount: number; threshold: number; bossHp: number; maxHp: number }) {
  return (
    <div className="boss-status-row">
      <div><Crown size={18} /><span>Điểm của bạn</span><strong>{totalScore}</strong></div>
      <div><Users size={18} /><span>Người chơi</span><strong>{activeCount}</strong></div>
      <div><Zap size={18} /><span>Ngưỡng</span><strong>{threshold}%</strong></div>
      <div><Swords size={18} /><span>Máu Boss</span><strong>{bossHp}/{maxHp}</strong></div>
    </div>
  );
}

function Lobby({ nickname, joined, roomCode, players, onNameChange, onJoin, onStart }: {
  nickname: string;
  joined: boolean;
  roomCode: string;
  players: Player[];
  onNameChange: (name: string) => void;
  onJoin: () => void;
  onStart: () => void;
}) {
  return (
    <article className="boss-lobby">
      <div className="boss-lobby-main">
        <span className="boss-live-pill">Đang chờ người chơi</span>
        <h2>Vào phòng Boss</h2>
        <strong>{roomCode}</strong>
        <p>Nhập nickname, nhìn tên mình xuất hiện trong lobby, rồi bắt đầu trận đấu.</p>
        <div className="boss-join-row">
          <input value={nickname} onChange={(event) => onNameChange(event.target.value)} placeholder="Tên hiển thị của bạn" />
          <button onClick={onJoin}>{joined ? "Đã vào" : "Vào phòng"}</button>
        </div>
        <button className="boss-start" onClick={onStart}>Bắt đầu trận</button>
      </div>
      <div className="boss-player-cloud">
        {players.map((player, index) => (
          <span key={player.player_id} style={{ animationDelay: `${index * 70}ms` }}>{player.avatar ?? player.nickname.slice(0, 2).toUpperCase()} · {player.nickname}</span>
        ))}
      </div>
    </article>
  );
}

function Countdown({ label, step }: { label: string; step: number }) {
  return (
    <article className="boss-countdown">
      <small>{label}</small>
      <strong>{COUNTDOWN[step]}</strong>
      <span>Chuẩn bị chọn đáp án thật nhanh</span>
    </article>
  );
}

function QuestionStage({ round, gameState, timeLeft, activeCount, answeredCount, maxPoints, selectedOption, resultPayload, distribution, playerCorrect, onPick }: {
  round: BossRound;
  gameState: GameState;
  timeLeft: number;
  activeCount: number;
  answeredCount: number;
  maxPoints: number;
  selectedOption: string;
  resultPayload?: ResultPayload;
  distribution: DistributionRow[];
  playerCorrect: boolean;
  onPick: (optionId: string) => void;
}) {
  const reveal = gameState === "reveal";
  const hasChosen = Boolean(selectedOption);
  const stateLabel = gameState === "question" ? "Chọn đáp án" : gameState === "locked" ? "Đã khóa" : "Kết quả";
  return (
    <article className="boss-question-stage">
      <div className="boss-question-top">
        <div className="boss-timer"><Timer size={20} /><strong>{timeLeft}</strong></div>
        <div><span>{stateLabel}</span><b>{answeredCount}/{activeCount} đã trả lời · {maxPoints} điểm</b></div>
      </div>
      <h2>{round.question}</h2>
      <div className="boss-answer-grid">
        {round.options.map((option, index) => {
          const isSelected = selectedOption === option.id;
          const isCorrect = resultPayload?.correct_option_id === option.id;
          const revealClass = reveal ? (isCorrect ? "correct-answer" : isSelected ? "wrong-answer selected-wrong-answer" : "dimmed") : "";
          const focusClass = hasChosen && !isSelected && !reveal ? "choice-muted" : "";
          const row = distribution.find((item) => item.option_id === option.id);
          return (
            <button
              key={option.id}
              className={`${ANSWER_COLORS[index] ?? "green"} ${isSelected ? "selected" : ""} ${focusClass} ${revealClass}`}
              onClick={() => onPick(option.id)}
              disabled={gameState !== "question"}
            >
              <i>{["◆", "●", "▲", "■"][index]}</i>
              <span>{option.label}</span>
              {reveal && isCorrect ? <CheckCircle2 className="answer-mark" size={34} /> : null}
              {reveal && isSelected && !isCorrect ? <ShieldAlert className="answer-mark" size={34} /> : null}
              {reveal && row ? <small>{row.count} chọn</small> : null}
            </button>
          );
        })}
      </div>
      {gameState === "locked" ? <div className="boss-locked">Đáp án đã khóa. Đang chờ cả lớp...</div> : null}
    </article>
  );
}

function ResultOverlay({ selectedOption, playerCorrect, resultPayload }: { selectedOption: string; playerCorrect: boolean; resultPayload?: ResultPayload }) {
  const timedOut = selectedOption === "__timeout";
  const score = Number(resultPayload?.player_score ?? 0);
  return (
    <div className={`boss-result-overlay ${playerCorrect ? "correct" : "incorrect"}`}>
      <div className="boss-result-panel">
        {playerCorrect ? <CheckCircle2 size={82} /> : <ShieldAlert size={82} />}
        <strong>{playerCorrect ? "Chính xác" : timedOut ? "Hết giờ" : "Sai rồi"}</strong>
        <span>{playerCorrect ? `+${score} điểm` : "Không có điểm ở câu này"}</span>
        <small>{resultPayload?.correct_count}/{resultPayload?.active_players} người trả lời đúng</small>
      </div>
    </div>
  );
}

function LeaderboardOverlay({ leaderboard, playerId }: { leaderboard: LeaderboardRow[]; playerId: string }) {
  return (
    <div className="boss-overlay">
      <article className="boss-leaderboard-modal">
        <span className="boss-live-pill">Bảng xếp hạng</span>
        <h2>Ai đang dẫn đầu?</h2>
        <div className="boss-leaderboard">
          {leaderboard.map((row, index) => {
            const delta = Number(row.rank_delta ?? 0);
            return (
              <div
                key={`${row.player_id}-${index}`}
                className={`${row.correct ? "correct" : ""} ${row.player_id === playerId ? "you" : ""} ${delta > 0 ? "moved-up" : delta < 0 ? "moved-down" : "held-rank"}`}
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <strong>#{row.rank ?? index + 1}</strong>
                <span>{row.nickname}</span>
                <b className="score-pop">+{row.score_delta}</b>
                <em className={delta >= 0 ? "up" : "down"}>
                  {delta >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  {Math.abs(delta)}
                </em>
              </div>
            );
          })}
        </div>
      </article>
    </div>
  );
}

function DamageStage({ resultPayload, correctRate, isFinished }: { resultPayload?: ResultPayload; correctRate: number; isFinished: boolean }) {
  return (
    <article className={`boss-damage-stage ${resultPayload?.boss_damaged ? "hit" : "blocked"}`}>
      <div className="boss-monster"><Swords size={54} /></div>
      <div>
        <span className="boss-live-pill">{resultPayload?.correct_count}/{resultPayload?.active_players} đúng · {correctRate}%</span>
        <h2>{resultPayload?.boss_damaged ? `CẢ LỚP TẤN CÔNG -${resultPayload.damage} máu` : "CHƯA ĐỦ 80%"}</h2>
        <p>{isFinished ? "Đang tổng hợp đánh giá AI cuối trận..." : "Chuẩn bị câu tiếp theo..."}</p>
      </div>
    </article>
  );
}

function FinalReview({ bossHp, leaderboard, history }: { bossHp: number; leaderboard: LeaderboardRow[]; history: GameResult[] }) {
  return (
    <article className="boss-podium">
      <Trophy size={48} />
      <span className="boss-live-pill">{bossHp <= 0 ? "Boss đã bị hạ" : "Trận đấu kết thúc"}</span>
      <h2>Bục chiến thắng</h2>
      <div className="boss-podium-grid">
        {leaderboard.slice(0, 3).map((row, index) => (
          <div key={row.player_id} className={`place-${index + 1}`}>
            <strong>#{index + 1}</strong>
            <span>{row.nickname}</span>
            <b>{row.score_delta} điểm</b>
          </div>
        ))}
      </div>
      <section className="boss-ai-review">
        <h3>AI Mentor tổng kết</h3>
        {history.map((item, index) => {
          const payload = item.payload as ResultPayload;
          return (
            <article key={`${payload.round_id}-${index}`} className={item.correct ? "correct" : "incorrect"}>
              <strong>{payload.round_title ?? `Vòng ${index + 1}`}</strong>
              <span>{item.correct ? "Bạn trả lời đúng" : "Bạn cần sửa lại"}</span>
              <p>{payload.ai_mentor}</p>
            </article>
          );
        })}
      </section>
    </article>
  );
}

export function BossBattleView({ session, onCompleted }: Props) {
  const payload = session.payload as BossPayload;
  const rounds = Array.isArray(payload.rounds) ? payload.rounds : [];
  const players = Array.isArray(payload.players) ? payload.players : [];
  const threshold = Number(payload.rules?.threshold ?? 80);
  const maxHp = Number(payload.boss?.max_hp ?? 100);
  const damage = Number(payload.boss?.attack_damage ?? 34);
  const timerSeconds = Number(payload.rules?.round_time_seconds ?? 30);
  const maxPoints = Number(payload.rules?.correct_points ?? 1000);
  const [nickname, setNickname] = useState(getStoredName());
  const [joined, setJoined] = useState(Boolean(getStoredName()));
  const [muted, setMuted] = useState(false);
  const [gameState, setGameState] = useState<GameState>("lobby");
  const [countdownStep, setCountdownStep] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [bossHp, setBossHp] = useState(Number(payload.boss?.hp ?? 100));
  const [totalScore, setTotalScore] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);
  const [history, setHistory] = useState<GameResult[]>([]);
  const [damagedRoundIds, setDamagedRoundIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const playTone = useTone(muted);

  const currentRound = rounds[roundIndex] ?? rounds[0];
  const resultPayload = result?.payload as ResultPayload | undefined;
  const leaderboard = Array.isArray(resultPayload?.leaderboard) ? resultPayload.leaderboard : [];
  const distribution = Array.isArray(resultPayload?.answer_distribution) ? resultPayload.answer_distribution : [];
  const correctRate = Number(resultPayload?.correct_rate ?? 0);
  const roomCode = payload.room?.room_code ?? "VINC24";
  const joinUrl = payload.room?.join_url ?? `/boss/join/${roomCode}`;
  const activeCount = players.length + (joined ? 1 : 0);
  const answeredCount = gameState === "question" ? Math.min(activeCount, 3 + roundIndex * 2 + (selectedOption ? 5 : 0) + Math.floor((timerSeconds - timeLeft) / 4)) : activeCount;
  const playerId = playerIdFromName(nickname);
  const playerCorrect = Boolean(result?.correct);
  const isFinished = bossHp <= 0 || roundIndex >= rounds.length - 1;

  const projectedPlayers = useMemo(() => {
    const guest = joined ? [{ player_id: playerId, nickname: nickname.trim() || "You", avatar: "YOU" }] : [];
    return [...guest, ...players];
  }, [joined, nickname, playerId, players]);

  function joinRoom() {
    const cleanName = nickname.trim() || "Guest Player";
    localStorage.setItem(STORAGE_KEY, cleanName);
    setNickname(cleanName);
    setJoined(true);
  }

  function startBattle() {
    if (!joined) joinRoom();
    playTone(220, 160, "sawtooth");
    setResult(null);
    setSelectedOption("");
    setTimeLeft(timerSeconds);
    setElapsedSeconds(0);
    setCountdownStep(0);
    setGameState("countdown");
  }

  async function lockAnswer(optionId: string) {
    if (!currentRound || loading || gameState !== "question") return;
    setSelectedOption(optionId);
    setGameState("locked");
    playTone(440, 110, "square");
    setLoading(true);
    setError("");
    try {
      const next = await submitMode("boss_battle", {
        user_id: playerId,
        course_id: "ml-foundations",
        session_id: session.session_id,
        question_id: currentRound.round_id,
        answer: JSON.stringify({
          room_code: roomCode,
          nickname,
          round_id: currentRound.round_id,
          option_id: optionId,
          elapsed_seconds: optionId === "__timeout" ? timerSeconds : elapsedSeconds,
        }),
        confidence: 4,
      });
      const nextPayload = next.payload as ResultPayload;
      setTotalScore((current) => current + Number(nextPayload.player_score ?? 0));
      setResult(next);
      setHistory((items) => [...items, next]);
      onCompleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể gửi câu trả lời Đại chiến Trùm.");
      setGameState("question");
    } finally {
      setLoading(false);
    }
  }

  function applyBossDamage() {
    const roundId = String(resultPayload?.round_id ?? currentRound.round_id);
    if (!damagedRoundIds.includes(roundId)) {
      const nextDamage = Number(resultPayload?.damage ?? 0);
      setBossHp((current) => Math.max(0, current - nextDamage));
      setDamagedRoundIds((items) => [...items, roundId]);
    }
    setGameState("damage");
  }

  function continueFlow() {
    const nextHp = Math.max(0, bossHp - (damagedRoundIds.includes(String(resultPayload?.round_id ?? "")) ? 0 : Number(resultPayload?.damage ?? 0)));
    if (nextHp <= 0 || roundIndex >= rounds.length - 1) {
      setGameState("victory");
      return;
    }
    const nextIndex = roundIndex + 1;
    setRoundIndex(nextIndex);
    setSelectedOption("");
    setElapsedSeconds(0);
    setTimeLeft(timerSeconds);
    setResult(null);
    setCountdownStep(0);
    setGameState("countdown");
  }

  useEffect(() => {
    if (gameState !== "countdown") return;
    const timer = window.setTimeout(() => {
      if (countdownStep >= COUNTDOWN.length - 1) {
        setCountdownStep(0);
        setTimeLeft(timerSeconds);
        setElapsedSeconds(0);
        setGameState("question");
      } else {
        setCountdownStep((current) => current + 1);
      }
    }, 760);
    return () => window.clearTimeout(timer);
  }, [countdownStep, gameState, timerSeconds]);

  useEffect(() => {
    if (gameState !== "question" || loading) return;
    if (timeLeft <= 0) {
      void lockAnswer(selectedOption || "__timeout");
      return;
    }
    const timer = window.setTimeout(() => {
      setTimeLeft((current) => {
        const next = Math.max(0, current - 1);
        setElapsedSeconds(timerSeconds - next);
        return next;
      });
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [gameState, loading, selectedOption, timeLeft, timerSeconds]);

  useEffect(() => {
    if (gameState !== "locked" || loading || !result) return;
    const timer = window.setTimeout(() => setGameState("reveal"), 1200);
    return () => window.clearTimeout(timer);
  }, [gameState, loading, result]);

  useEffect(() => {
    if (gameState !== "reveal" || !result) return;
    const timer = window.setTimeout(() => setGameState("leaderboard"), 3200);
    return () => window.clearTimeout(timer);
  }, [gameState, result]);

  useEffect(() => {
    if (gameState !== "leaderboard" || !result) return;
    const timer = window.setTimeout(applyBossDamage, 3300);
    return () => window.clearTimeout(timer);
  }, [gameState, result]);

  useEffect(() => {
    if (gameState !== "damage" || !result) return;
    const timer = window.setTimeout(continueFlow, 3000);
    return () => window.clearTimeout(timer);
  }, [gameState, result, bossHp, roundIndex]);

  useEffect(() => {
    if (muted) return;
    if (gameState === "countdown") playTone(countdownStep >= COUNTDOWN.length - 1 ? 660 : 330, 90, "square");
    if (gameState === "reveal") playTone(playerCorrect ? 760 : 180, playerCorrect ? 180 : 240, playerCorrect ? "sine" : "sawtooth");
    if (gameState === "leaderboard") playTone(520, 180, "triangle");
    if (gameState === "damage") playTone(resultPayload?.boss_damaged ? 140 : 240, 260, "sawtooth");
    if (gameState === "victory") playTone(880, 260, "triangle");
  }, [countdownStep, gameState, muted, playerCorrect, resultPayload?.boss_damaged]);

  useEffect(() => {
    if (muted || gameState !== "question" || timeLeft > 5 || timeLeft <= 0) return;
    playTone(260 + timeLeft * 20, 70, "square");
  }, [gameState, muted, timeLeft]);

  if (!currentRound) return <section className="boss-shell"><div className="boss-card">Đại chiến Trùm chưa có câu hỏi demo.</div></section>;

  return (
    <section className={`boss-shell state-${gameState}`}>
      <AudioStrip muted={muted} gameState={gameState} onToggle={() => setMuted((value) => !value)} />
      {gameState === "lobby" ? <Hero bossName={payload.boss?.boss_name ?? "Mô hình Hỏng"} roomCode={roomCode} joinUrl={joinUrl} threshold={threshold} /> : null}
      {gameState === "lobby" ? <StatusRow totalScore={totalScore} activeCount={activeCount} threshold={threshold} bossHp={bossHp} maxHp={maxHp} /> : null}

      {gameState === "lobby" ? <Lobby nickname={nickname} joined={joined} roomCode={roomCode} players={projectedPlayers} onNameChange={setNickname} onJoin={joinRoom} onStart={startBattle} /> : null}
      {gameState === "countdown" ? <Countdown label={currentRound.title} step={countdownStep} /> : null}

      {gameState === "question" || gameState === "locked" || gameState === "reveal" ? (
        <main className="boss-focused-play">
          <div className="boss-game-hud">
            <span>Vòng {roundIndex + 1}/{rounds.length}</span>
            <strong>{totalScore} điểm</strong>
            <b>Máu Boss {bossHp}/{maxHp}</b>
          </div>
          <QuestionStage
            round={currentRound}
            gameState={gameState}
            timeLeft={timeLeft}
            activeCount={activeCount}
            answeredCount={answeredCount}
            maxPoints={maxPoints}
            selectedOption={selectedOption}
            resultPayload={resultPayload}
            distribution={distribution}
            playerCorrect={playerCorrect}
            onPick={(optionId) => void lockAnswer(optionId)}
          />
          {gameState === "reveal" ? (
            <ResultOverlay selectedOption={selectedOption} playerCorrect={playerCorrect} resultPayload={resultPayload} />
          ) : null}
        </main>
      ) : null}

      {gameState === "leaderboard" ? <LeaderboardOverlay leaderboard={leaderboard} playerId={playerId} /> : null}
      {gameState === "damage" ? <DamageStage resultPayload={resultPayload} correctRate={correctRate} isFinished={isFinished} /> : null}
      {gameState === "victory" ? <FinalReview bossHp={bossHp} leaderboard={leaderboard} history={history} /> : null}

      {error ? <p className="boss-error">{error}</p> : null}
      {gameState === "lobby" ? <span className="boss-damage-note">Mỗi vòng đạt {threshold}% đúng gây {damage} máu. Chỉ cần 3 vòng thành công để hạ boss 100 máu.</span> : null}
    </section>
  );
}
