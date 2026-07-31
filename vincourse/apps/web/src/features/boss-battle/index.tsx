import { useState } from "react";
import { CheckCircle2, ShieldAlert, Swords, Trophy, Users, Zap } from "lucide-react";
import { submitMode } from "../../api/modes";
import type { GameResult, GameSession } from "../../types/game";
import "./boss-battle.css";

type Props = {
  session: GameSession;
  onCompleted: () => void;
};

type Team = {
  name: string;
  correct: boolean;
};

export function BossBattleView({ session, onCompleted }: Props) {
  const payload = session.payload as {
    boss_name?: string;
    attack_threshold?: number;
    attack_damage?: number;
    boss_hp?: number;
    core_rule?: string;
    rules?: string[];
    teams?: Team[];
    phases?: string[];
    rewards?: string[];
    ai_class_coach?: string;
  };
  const teams = Array.isArray(payload.teams) ? payload.teams : [];
  const threshold = Number(payload.attack_threshold ?? 80);
  const correctTeams = teams.filter((team) => team.correct).length;
  const correctRate = teams.length ? Math.round((correctTeams / teams.length) * 100) : 0;
  const attackReady = correctRate >= threshold;
  const hpAfterAttack = Math.max(0, Number(payload.boss_hp ?? 100) - (attackReady ? Number(payload.attack_damage ?? 25) : 0));
  const [result, setResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function attackBoss() {
    setLoading(true);
    setError("");
    try {
      const next = await submitMode("boss_battle", {
        user_id: "demo-user",
        course_id: "ml-foundations",
        session_id: session.session_id,
        question_id: String(payload.boss_name ?? "boss-class-raid"),
        answer: attackReady ? "attack unlocked by 80 percent team correctness" : "not enough correct teams",
        confidence: 5,
      });
      setResult(next);
      onCompleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tấn công Boss lúc này.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="boss-shell">
      <div className="boss-hero">
        <div>
          <p>Boss Battle · Class Cooperation</p>
          <h1>{payload.boss_name ?? "The Broken Model"}</h1>
          <span>{payload.core_rule ?? session.prompt}</span>
        </div>
        <div className="boss-crystal"><Swords size={44} /></div>
      </div>

      <div className="boss-grid">
        <article className="boss-card boss-main-card">
          <div className="boss-card-head">
            <strong><Users size={18} /> Class Sync</strong>
            <span className={attackReady ? "ready" : "blocked"}>{correctRate}% correct</span>
          </div>
          <div className="boss-meter"><span style={{ width: `${correctRate}%` }} /><b>{correctTeams}/{teams.length} teams correct</b></div>
          <div className="boss-threshold">
            <span><Zap size={18} /> Attack threshold</span>
            <strong>{threshold}%</strong>
          </div>
          <p className="boss-ai-coach">{payload.ai_class_coach ?? "AI Coach: Theo dõi tỉ lệ đúng của cả lớp để quyết định lúc nào được tấn công Boss."}</p>
          <button className="boss-attack" onClick={() => void attackBoss()} disabled={!attackReady || loading}>
            {attackReady ? "Tấn công Boss" : "Chưa đủ 80% đội đúng"}
          </button>
          {error ? <p className="boss-error">{error}</p> : null}
          {result ? <p className="boss-result">{result.feedback} · +{result.xp} XP</p> : null}
        </article>

        <article className="boss-card">
          <div className="boss-card-head">
            <strong><ShieldAlert size={18} /> Boss HP</strong>
            <span>{hpAfterAttack}/100</span>
          </div>
          <div className="boss-hp"><span style={{ width: `${hpAfterAttack}%` }} /></div>
          <ul className="boss-rules">
            {(payload.rules ?? []).map((rule) => <li key={rule}>{rule}</li>)}
          </ul>
        </article>
      </div>

      <div className="boss-grid bottom">
        <article className="boss-card">
          <h2>Team Board</h2>
          <div className="boss-team-list">
            {teams.map((team) => (
              <span key={team.name} className={team.correct ? "correct" : "wrong"}>
                {team.correct ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                {team.name}
              </span>
            ))}
          </div>
        </article>

        <article className="boss-card">
          <h2>Victory Path</h2>
          <div className="boss-phase-list">
            {(payload.phases ?? []).map((phase, index) => <span key={phase}>{index + 1}. {phase}</span>)}
          </div>
          <div className="boss-rewards">
            {(payload.rewards ?? []).map((reward) => <b key={reward}><Trophy size={15} /> {reward}</b>)}
          </div>
        </article>
      </div>
    </section>
  );
}
