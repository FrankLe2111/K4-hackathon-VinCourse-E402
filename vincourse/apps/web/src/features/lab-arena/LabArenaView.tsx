import { useState } from "react";
import { submitMode } from "../../api/modes";
import type { GameResult, GameSession } from "../../types/game";
import "./lab-arena.css";

type Props = {
  session: GameSession;
  onCompleted: () => void;
};

const fallbackCode = `def standardize(X):
    columns = list(zip(*X))
    means = [sum(col) / len(col) for col in columns]
    stds = [(sum((x - mean) ** 2 for x in col) / len(col)) ** 0.5 for col, mean in zip(columns, means)]
    return [[(value - means[i]) / stds[i] for i, value in enumerate(row)] for row in X]
`;

export function LabArenaView({ session, onCompleted }: Props) {
  const payload = session.payload;
  const starterCode = String(payload.starter_code ?? fallbackCode);
  const visibleTests = (payload.visible_tests as string[] | undefined) ?? [];
  const concepts = (payload.concept_ids as string[] | undefined) ?? [];
  const [code, setCode] = useState(starterCode);
  const [confidence, setConfidence] = useState(3);
  const [result, setResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [error, setError] = useState("");

  async function runTests() {
    setLoading(true);
    setError("");
    try {
      const next = await submitMode("lab_arena", {
        user_id: "demo-user",
        course_id: "ml-foundations",
        session_id: session.session_id,
        question_id: String(payload.lab_id ?? "lab-standardize"),
        answer: code,
        confidence,
      });
      setResult(next);
      onCompleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không chạy được test.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="lab-shell">
      <header className="lab-hero">
        <p className="lab-eyebrow">Lab Arena · Python</p>
        <h2>Code để chứng minh bạn hiểu.</h2>
        <p>{session.prompt}</p>
        <div className="lab-tags">{concepts.map((concept) => <span key={concept}>{concept}</span>)}</div>
      </header>

      <div className="lab-layout">
        <aside className="lab-card">
          <h3>Visible tests</h3>
          <div className="lab-tests">
            {visibleTests.map((test) => <span key={test} className={result?.correct ? "pass" : result ? "fail" : ""}>{result?.correct ? "✓" : result ? "!" : "•"} {test}</span>)}
          </div>
          <button className="secondary-button" onClick={() => setHintOpen((current) => !current)}>Gợi ý</button>
          {hintOpen ? <p className="lab-hint">Tính mean/std theo từng cột, rồi chuẩn hóa từng value: <code>(x - mean) / std</code>.</p> : null}
        </aside>

        <main className="lab-card lab-editor-card">
          <div className="lab-editor-head">
            <strong>standardize.py</strong>
            <span>{String(payload.language ?? "python")}</span>
          </div>
          <textarea className="lab-editor" value={code} onChange={(event) => setCode(event.target.value)} spellCheck={false} />
          <div className="lab-actions">
            <label>Confidence <input type="number" min={1} max={5} value={confidence} onChange={(event) => setConfidence(Number(event.target.value))} /></label>
            <button className="primary-button" onClick={() => void runTests()} disabled={loading || !code.trim()}>{loading ? "Đang chạy…" : "Run tests"}</button>
          </div>
          {error ? <p className="alert">{error}</p> : null}
          {result ? (
            <div className={`lab-result ${result.correct ? "success" : "danger"}`}>
              <strong>{result.correct ? `All tests passed · +${result.xp} XP` : `Tests failed · +${result.xp} XP`}</strong>
              <p>{result.feedback}</p>
              <small>{result.next_action}</small>
            </div>
          ) : null}
        </main>
      </div>
    </section>
  );
}
