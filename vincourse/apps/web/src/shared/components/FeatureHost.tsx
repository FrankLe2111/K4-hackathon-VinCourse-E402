import { useEffect, useState } from "react";
import { getModeSession, submitMode } from "../../api/modes";
import type { GameMode, GameResult, GameSession } from "../../types/game";
import { BossBattleView } from "../../features/boss-battle";
import { DailyRecallView } from "../../features/daily-recall";
import { ErrorDungeonView } from "../../features/error-dungeon";
import { LabArena } from "../../features/lab-arena";
import { LiveBattleFeature } from "../../features/live-battle";
import { StoryQuest } from "../../features/story-quest";

type Props = {
  mode: GameMode;
  onCompleted: () => void;
};

export function FeatureHost({ mode, onCompleted }: Props) {
  if (mode === "story") return <StoryQuest onCompleted={onCompleted} />;
  if (mode === "live_battle") return <LiveBattleFeature onCompleted={onCompleted} />;
  return <GenericFeatureHost mode={mode} onCompleted={onCompleted} />;
}

function GenericFeatureHost({ mode, onCompleted }: Props) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [answer, setAnswer] = useState("");
  const [confidence, setConfidence] = useState(3);
  const [result, setResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [labRound, setLabRound] = useState(1);

  const isLabArena = mode === "lab_arena";

  useEffect(() => {
    setSession(null);
    setResult(null);
    setAnswer("");
    setError("");
    if (isLabArena) setLabRound(1);

    void getModeSession(mode, isLabArena ? 1 : undefined)
      .then((nextSession) => {
        setSession(nextSession);
        if (isLabArena && typeof nextSession.payload?.starter_code === "string") {
          setAnswer(nextSession.payload.starter_code);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Cannot load mode session."));
  }, [mode, isLabArena]);

  async function restartLab(resetChallenge = false, targetRound = labRound) {
    const nextRound = resetChallenge ? 1 : targetRound;
    if (resetChallenge) setLabRound(1);
    setSession(null);
    setResult(null);
    setAnswer("");
    setError("");
    try {
      const nextSession = await getModeSession("lab_arena", nextRound);
      setSession(nextSession);
      setAnswer(String(nextSession.payload.starter_code ?? ""));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cannot create Lab Arena session.");
    }
  }

  async function nextLabRound() {
    if (labRound >= 10) {
      onCompleted();
      return;
    }
    const nextRound = labRound + 1;
    setLabRound(nextRound);
    await restartLab(false, nextRound);
  }

  async function submit() {
    if (!session) return;
    setLoading(true);
    setError("");
    try {
      const nextResult = await submitMode(mode, {
        user_id: "demo-user",
        course_id: "ml-foundations",
        session_id: session.session_id,
        question_id: isLabArena ? `lab-round-${labRound}` : "q-demo-001",
        answer,
        confidence
      });
      setResult(nextResult);
      if (!isLabArena) onCompleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed.");
    } finally {
      setLoading(false);
    }
  }

  if (session && mode === "daily_recall") {
    return <DailyRecallView session={session} onCompleted={onCompleted} />;
  }

  if (session && mode === "error_dungeon") {
    return <ErrorDungeonView session={session} onCompleted={onCompleted} />;
  }

  if (session && mode === "boss_battle") {
    return <BossBattleView session={session} onCompleted={onCompleted} />;
  }

  if (isLabArena) {
    return (
      <LabArena
        session={session}
        code={answer}
        result={result}
        loading={loading}
        error={error}
        onCodeChange={setAnswer}
        onSubmit={() => void submit()}
        onRestart={() => void restartLab(true)}
        onNext={() => void nextLabRound()}
        round={labRound}
        totalRounds={10}
      />
    );
  }

  return (
    <section className="feature-panel">
      <h2>{session?.title ?? "Loading mode..."}</h2>
      <p>{session?.prompt ?? "Please wait."}</p>
      {session?.evidence_ids.length ? <p>Evidence: {session.evidence_ids.join(", ")}</p> : null}

      <div className="answer-box">
        <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Write your answer..." />
        <div className="button-row">
          <label>
            Confidence{" "}
            <input
              type="number"
              min={1}
              max={5}
              value={confidence}
              onChange={(event) => setConfidence(Number(event.target.value))}
            />
          </label>
          <button className="primary-button" onClick={() => void submit()} disabled={loading || !session}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      {error && <p className="alert">{error}</p>}
      {result && (
        <div className="result">
          <strong>{result.status}</strong>
          <p>{result.feedback}</p>
          <p>XP: {result.xp} | Mastery: +{result.mastery_delta}</p>
          <p>{result.next_action}</p>
        </div>
      )}
    </section>
  );
}
