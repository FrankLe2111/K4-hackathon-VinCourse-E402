import { useEffect, useState } from "react";
import { getModeSession, submitMode } from "../../api/modes";
import type { GameMode, GameResult, GameSession } from "../../types/game";
import { StoryQuest } from "../../features/story-quest";
import { LiveBattle } from "../../features/live-battle";
import { DailyRecallView } from "../../features/daily-recall";
import { ErrorDungeonView } from "../../features/error-dungeon";

type Props = {
  mode: GameMode;
  onCompleted: () => void;
};

export function FeatureHost({ mode, onCompleted }: Props) {
  if (mode === "story") return <StoryQuest onCompleted={onCompleted} />;
  if (mode === "live_battle") return <LiveBattle onCompleted={onCompleted} />;
  return <GenericFeatureHost mode={mode} onCompleted={onCompleted} />;
}

function GenericFeatureHost({ mode, onCompleted }: Props) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [answer, setAnswer] = useState("");
  const [confidence, setConfidence] = useState(3);
  const [result, setResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLabArena = mode === "lab_arena";
  const visibleTests = session?.payload?.visible_tests as string[] | undefined;
  const conceptIds = session?.payload?.concept_ids as string[] | undefined;
  const starterCode = session?.payload?.starter_code as string | undefined;

  useEffect(() => {
    setSession(null);
    setResult(null);
    setAnswer("");
    setError("");
    void getModeSession(mode)
      .then((nextSession) => {
        setSession(nextSession);
        if (isLabArena && typeof nextSession.payload?.starter_code === "string") {
          setAnswer(nextSession.payload.starter_code);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Cannot load mode session."));
  }, [mode, isLabArena]);

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
      {isLabArena && visibleTests?.length ? (
        <div className="test-summary">
          <strong>Visible tests</strong>
          <ul>
            {visibleTests.map((test) => (
              <li key={test}>{test}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {isLabArena && conceptIds?.length ? (
        <div className="concept-tags">
          {conceptIds.map((concept) => (
            <span key={concept} className="badge">
              {concept}
            </span>
          ))}
        </div>
      ) : null}

      <div className="answer-box">
        <textarea
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder={isLabArena ? "Write your code here..." : "Write your answer..."}
        />
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
            {loading ? "Submitting..." : isLabArena ? "Run tests" : "Submit"}
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
