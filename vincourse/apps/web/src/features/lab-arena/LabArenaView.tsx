import { useState } from "react";
import { Beaker, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Code2, Lightbulb, Play, RefreshCw, Send, Shuffle } from "lucide-react";
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

const days = Array.from({ length: 5 }, (_, index) => ({
  title: `Day0${index + 1}`,
  labs: [`day0${index + 1}_standardize.py`, `day0${index + 1}_debug_task.py`],
}));

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
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedLab, setSelectedLab] = useState(0);
  const [tab, setTab] = useState<"description" | "editorial" | "solutions" | "submissions">("description");
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
      <header className="lab-topbar">
        <strong><Beaker size={20} /> Lab Arena</strong>
        <button><ChevronLeft size={17} /></button>
        <button><ChevronRight size={17} /></button>
        <button><Shuffle size={17} /></button>
        <span />
        <button className="lab-run" onClick={() => void runTests()} disabled={loading || !code.trim()}><Play size={16} /> Run</button>
        <button className="lab-submit" onClick={() => void runTests()} disabled={loading || !code.trim()}><Send size={16} /> Submit</button>
      </header>

      <div className="lab-main">
        <aside className="lab-days">
          <div className="lab-days-head"><BookOpen size={19} /><strong>5 ngày lab</strong></div>
          {days.map((day, dayIndex) => (
            <section key={day.title} className={dayIndex === selectedDay ? "active" : ""}>
              <button onClick={() => {
                setSelectedDay(dayIndex);
                setSelectedLab(0);
              }}>{day.title}<span>{day.labs.length} bài</span></button>
              {dayIndex === selectedDay ? day.labs.map((lab, labIndex) => (
                <button key={lab} className={labIndex === selectedLab ? "selected" : ""} onClick={() => setSelectedLab(labIndex)}><Code2 size={15} />{lab}</button>
              )) : null}
            </section>
          ))}
        </aside>

        <main className="lab-problem">
          <nav className="lab-tabs">
            {(["description", "editorial", "solutions", "submissions"] as const).map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}
          </nav>
          {tab === "description" ? (
            <article className="lab-description">
              <h1>Standardize Features</h1>
              <div className="lab-tags">{["Medium", ...concepts].map((item) => <span key={item}>{item}</span>)}</div>
              <p>{session.prompt}</p>
              <p>Cho ma trận <code>X</code> gồm nhiều dòng dữ liệu. Hãy trả về ma trận mới cùng shape, trong đó mỗi cột có mean gần 0 và standard deviation gần 1.</p>
              <h3>Example</h3>
              <pre>{`Input: [[1,2], [3,4], [5,6]]
Output: [[-1.224,-1.224], [0,0], [1.224,1.224]]`}</pre>
              <h3>Constraints</h3>
              <ul><li>Không dùng file/network/system access.</li><li>Giữ nguyên số dòng và số cột.</li><li>Dùng Python thuần là đủ.</li></ul>
              <button className="secondary-button" onClick={() => setHintOpen((current) => !current)}><Lightbulb size={16} /> Hint</button>
              {hintOpen ? <p className="lab-hint">Tính mean/std theo từng cột, rồi chuẩn hóa từng value bằng <code>(x - mean) / std</code>.</p> : null}
            </article>
          ) : (
            <article className="lab-description">
              <h1>{tab}</h1>
              <p>Mock content cho {days[selectedDay].title}. Sau khi upload tài liệu thật, khu vực này nối với editorial/solution/submission tương ứng.</p>
            </article>
          )}
        </main>

        <section className="lab-code-panel">
          <div className="lab-editor-head"><strong><Code2 size={17} /> Code</strong><span>Python3 · Auto</span></div>
          <textarea className="lab-editor" value={code} onChange={(event) => setCode(event.target.value)} spellCheck={false} />
          <div className="lab-actions">
            <label>Confidence <input type="number" min={1} max={5} value={confidence} onChange={(event) => setConfidence(Number(event.target.value))} /></label>
            <button className="secondary-button" onClick={() => {
              setCode(starterCode);
              setResult(null);
            }}><RefreshCw size={16} /> Reset</button>
          </div>
          <div className="lab-test-panel">
            <strong><CheckCircle2 size={16} /> Testcase</strong>
            <div className="lab-tests">{visibleTests.map((test) => <span key={test} className={result?.correct ? "pass" : result ? "fail" : ""}>{result?.correct ? "✓" : result ? "!" : "•"} {test}</span>)}</div>
            {error ? <p className="alert">{error}</p> : null}
            {result ? <div className={`lab-result ${result.correct ? "success" : "danger"}`}><strong>{result.correct ? `Accepted · +${result.xp} XP` : `Wrong Answer · +${result.xp} XP`}</strong><p>{result.feedback}</p><small>{result.next_action}</small></div> : null}
          </div>
        </section>
      </div>
    </section>
  );
}
