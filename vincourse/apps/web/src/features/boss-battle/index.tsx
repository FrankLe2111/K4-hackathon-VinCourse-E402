import { useMemo, useState } from "react";
import { CheckCircle2, Copy, Crown, QrCode, ShieldAlert, Swords, Timer, Trophy, Users, Zap } from "lucide-react";
import { submitMode } from "../../api/modes";
import type { GameResult, GameSession } from "../../types/game";
import "./boss-battle.css";

type Props = {
  session: GameSession;
  onCompleted: () => void;
};

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
};

type BossPayload = {
  room?: { room_code?: string; join_url?: string; host_name?: string };
  boss?: { boss_name?: string; max_hp?: number; hp?: number; attack_damage?: number };
  rules?: { threshold?: number; round_time_seconds?: number; correct_points?: number; speed_bonus_max?: number; damage_rule?: string };
  players?: Player[];
  rounds?: BossRound[];
  ai_enabled?: boolean;
};

const STORAGE_KEY = "vincourse-boss-player";

function getStoredName() {
  return localStorage.getItem(STORAGE_KEY) ?? "";
}

export function BossBattleView({ session, onCompleted }: Props) {
  const payload = session.payload as BossPayload;
  const rounds = Array.isArray(payload.rounds) ? payload.rounds : [];
  const players = Array.isArray(payload.players) ? payload.players : [];
  const threshold = Number(payload.rules?.threshold ?? 80);
  const maxHp = Number(payload.boss?.max_hp ?? 100);
  const damage = Number(payload.boss?.attack_damage ?? 25);
  const [nickname, setNickname] = useState(getStoredName());
  const [joined, setJoined] = useState(Boolean(getStoredName()));
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(12);
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
    leaderboard?: LeaderboardRow[];
  } | undefined;
  const leaderboard = Array.isArray(resultPayload?.leaderboard) ? resultPayload.leaderboard : [];
  const correctRate = Number(resultPayload?.correct_rate ?? 0);
  const hpPercent = Math.max(0, Math.round((bossHp / maxHp) * 100));
  const roomCode = payload.room?.room_code ?? "VINC24";
  const joinUrl = payload.room?.join_url ?? `/boss/join/${roomCode}`;
  const finished = bossHp <= 0 || roundIndex >= rounds.length;

  const projectedPlayers = useMemo(() => {
    const guest = joined ? [{ player_id: "guest", nickname: nickname.trim() || "You", avatar: "YOU" }] : [];
    return [...guest, ...players];
  }, [joined, nickname, players]);

  function joinRoom() {
    const cleanName = nickname.trim() || "Guest Player";
    localStorage.setItem(STORAGE_KEY, cleanName);
    setNickname(cleanName);
    setJoined(true);
  }

  async function submitRound() {
    if (!currentRound || !selectedOption) return;
    setLoading(true);
    setError("");
    try {
      const next = await submitMode("boss_battle", {
        user_id: `guest-${nickname.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "player"}`,
        course_id: "ml-foundations",
        session_id: session.session_id,
        question_id: currentRound.round_id,
        answer: JSON.stringify({
          room_code: roomCode,
          nickname,
          round_id: currentRound.round_id,
          option_id: selectedOption,
          elapsed_seconds: elapsedSeconds,
        }),
        confidence: 4,
      });
      const nextPayload = next.payload as { damage?: number; player_score?: number };
      const nextDamage = Number(nextPayload.damage ?? 0);
      setBossHp((current) => Math.max(0, current - nextDamage));
      setTotalScore((current) => current + Number(nextPayload.player_score ?? 0));
      setResult(next);
      setHistory((items) => [...items, next]);
      onCompleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể gửi câu trả lời Boss Battle.");
    } finally {
      setLoading(false);
    }
  }

  function nextRound() {
    const nextIndex = roundIndex + 1;
    setRoundIndex(nextIndex);
    setSelectedOption("");
    setElapsedSeconds(12 + nextIndex * 3);
    setResult(null);
  }

  if (!currentRound) {
    return <section className="boss-shell"><div className="boss-card">Boss Battle chưa có round demo.</div></section>;
  }

  return (
    <section className="boss-shell">
      <div className="boss-hero">
        <div>
          <p>Boss Battle · Live Room</p>
          <h1>{payload.boss?.boss_name ?? "The Broken Model"}</h1>
          <span>Kahoot-style quiz: mỗi người có điểm riêng, nhưng cả lớp phải đạt {threshold}% đúng thì boss mới mất máu.</span>
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
        <div><Users size={18} /><span>Người chơi</span><strong>{projectedPlayers.length}</strong></div>
        <div><Zap size={18} /><span>Ngưỡng sát thương</span><strong>{threshold}%</strong></div>
        <div><Swords size={18} /><span>Damage / round</span><strong>{damage} HP</strong></div>
      </div>

      {!joined ? (
        <article className="boss-card boss-join">
          <div>
            <h2>Vào phòng Boss</h2>
            <p>Không cần tài khoản. Nhập nickname để tham gia như người chơi demo showcase.</p>
          </div>
          <input value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder="Nickname của bạn" />
          <button className="boss-attack" onClick={joinRoom}>Join room</button>
        </article>
      ) : null}

      <div className="boss-grid">
        <article className="boss-card boss-main-card">
          <div className="boss-card-head">
            <strong><Timer size={18} /> {currentRound.title}</strong>
            <span>{roundIndex + 1}/{rounds.length}</span>
          </div>
          <p className="boss-question">{currentRound.question}</p>
          <div className="boss-options">
            {currentRound.options.map((option) => (
              <button
                key={option.id}
                className={selectedOption === option.id ? "selected" : ""}
                onClick={() => setSelectedOption(option.id)}
                disabled={!joined || Boolean(result)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="boss-speed">
            <span>Thời gian trả lời giả lập: {elapsedSeconds}s</span>
            <input type="range" min="3" max={payload.rules?.round_time_seconds ?? 30} value={elapsedSeconds} onChange={(event) => setElapsedSeconds(Number(event.target.value))} disabled={Boolean(result)} />
          </div>
          <button className="boss-attack" onClick={() => void submitRound()} disabled={!joined || !selectedOption || loading || Boolean(result)}>
            {loading ? "Đang gọi AI mentor..." : "Gửi câu trả lời"}
          </button>
          {error ? <p className="boss-error">{error}</p> : null}
        </article>

        <article className="boss-card">
          <div className="boss-card-head">
            <strong><ShieldAlert size={18} /> Boss HP</strong>
            <span>{bossHp}/{maxHp}</span>
          </div>
          <div className="boss-hp"><span style={{ width: `${hpPercent}%` }} /></div>
          {result ? (
            <div className="boss-round-result">
              <b className={resultPayload?.boss_damaged ? "ready" : "blocked"}>
                {resultPayload?.correct_count}/{resultPayload?.active_players} đúng · {correctRate}%
              </b>
              <p>{result.feedback}</p>
              <p className="boss-ai-coach">{resultPayload?.ai_mentor}</p>
              {!finished ? <button className="boss-next" onClick={nextRound}>Round tiếp theo</button> : null}
            </div>
          ) : (
            <ul className="boss-rules">
              <li>Đúng: +100 điểm.</li>
              <li>Đúng nhanh: bonus tối đa +50.</li>
              <li>Cả lớp đạt {threshold}% đúng: boss mất {damage} HP.</li>
              <li>AI mentor phân tích lỗi chung sau mỗi round.</li>
            </ul>
          )}
        </article>
      </div>

      <div className="boss-grid bottom">
        <article className="boss-card">
          <h2>Leaderboard</h2>
          <div className="boss-leaderboard">
            {(leaderboard.length ? leaderboard : projectedPlayers.map((player, index) => ({ ...player, correct: false, score_delta: 0, elapsed_seconds: 0 }))).map((row, index) => (
              <div key={`${row.player_id}-${index}`} className={row.correct ? "correct" : ""}>
                <strong>#{index + 1}</strong>
                <span>{row.nickname}</span>
                <b>{row.score_delta} pts</b>
                {row.correct ? <CheckCircle2 size={17} /> : <ShieldAlert size={17} />}
              </div>
            ))}
          </div>
        </article>

        <article className="boss-card">
          <h2>Victory Path</h2>
          <div className="boss-phase-list">
            {rounds.map((round, index) => (
              <span key={round.round_id} className={index < history.length ? "done" : index === roundIndex ? "active" : ""}>
                {index + 1}. {round.title.replace(/^Round \d+: /, "")}
              </span>
            ))}
          </div>
          {finished ? (
            <div className="boss-victory">
              <Trophy size={28} />
              <strong>{bossHp <= 0 ? "Boss đã bị hạ!" : "Hết chuỗi round demo"}</strong>
              <span>Leaderboard và AI mentor đã tạo đủ tín hiệu showcase.</span>
            </div>
          ) : null}
        </article>
      </div>
    </section>
  );
}
