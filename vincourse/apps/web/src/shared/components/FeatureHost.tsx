import { useEffect, useState } from "react";
import { getModeSession, submitMode } from "../../api/modes";
import type { GameMode, GameResult, GameSession } from "../../types/game";
import { DailyRecallView } from "../../features/daily-recall";
import { ErrorDungeonView } from "../../features/error-dungeon";

type Props = {
  mode: GameMode;
  onCompleted: () => void;
};

export function FeatureHost({ mode, onCompleted }: Props) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [answer, setAnswer] = useState("");
  const [confidence, setConfidence] = useState(3);
  const [result, setResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSession(null);
    setResult(null);
    setAnswer("");
    setError("");
    void getModeSession(mode)
      .then(setSession)
      .catch((err) => setError(err instanceof Error ? err.message : "Cannot load mode session."));
  }, [mode]);

  async function submit() {
    if (!session) return;
    setLoading(true);
    setError("");
    try {
      const nextResult = await submitMode(mode, {
        user_id: "demo-user",
        course_id: "ml-foundations",
        session_id: session.session_id,
        question_id: "q-demo-001",
        answer,
        confidence,
      });
      setResult(nextResult);
      onCompleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed.");
    } finally {
      setLoading(false);
    }
  }

  // Render feature-specific custom views when session is loaded
  if (session && mode === "daily_recall") {
    return <DailyRecallView session={session} onCompleted={onCompleted} />;
  }

  if (session && mode === "error_dungeon") {
    return <ErrorDungeonView session={session} onCompleted={onCompleted} />;
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
