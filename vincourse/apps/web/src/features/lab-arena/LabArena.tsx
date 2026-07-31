import { BookOpen, Check, Code2, FlaskConical, Play, RotateCcw } from "lucide-react";
import type { GameResult, GameSession } from "../../types/game";
import { PythonCodeEditor } from "./PythonCodeEditor";
import "./lab-arena.css";
import "./python-editor.css";
import "./lab-arena-fixes.css";
import "./round-progress.css";
import "./rules.css";

type Evidence = { id: string; title: string; text: string };
type RuntimeTest = {
  id: string;
  label: string;
  arguments: unknown[];
  expected: unknown;
  passed?: boolean;
  actual?: string;
  error?: string;
};

type Props = {
  session: GameSession | null;
  code: string;
  result: GameResult | null;
  loading: boolean;
  error: string;
  onCodeChange: (value: string) => void;
  onSubmit: () => void;
  onRestart: () => void;
  onNext: () => void;
  round: number;
  totalRounds: number;
};

export function LabArena(props: Props) {
  const { session, code, result, loading, error, onCodeChange, onSubmit, onRestart, onNext, round, totalRounds } = props;

  if (!session) return <section className="react-lab-loading">{error || "Đang tạo phiên Lab Arena…"}</section>;
  const evidence = (session.payload.evidence as Evidence[]) ?? [];
  const rules = (session.payload.rules as string[]) ?? [];
  const authoredTests = (session.payload.tests as RuntimeTest[]) ?? [];
  const tests = ((result?.payload.tests as RuntimeTest[] | undefined) ?? []);
  const passed = result?.correct === true;

  return (
    <section className="react-lab">
      <header className="react-lab-hero">
        <div>
          <span><FlaskConical size={17} /> CHẾ ĐỘ 4 · VẬN DỤNG</span>
          <div className="react-lab-round"><div><i style={{ width: `${(round / totalRounds) * 100}%` }} /></div><strong>Câu {round}/{totalRounds}</strong></div>
        </div>
        <button onClick={onRestart}><RotateCcw size={16} /> Làm lại thử thách</button>
      </header>

      <div className="react-lab-grid">
        <aside className="react-lab-card">
          <b className="react-lab-chip">BÀI {round}/{totalRounds} · {String(session.payload.difficulty)}</b>
          <h3>{session.title}</h3>
          <div className="react-lab-tags"><span>{String(session.payload.topic)}</span><span>{String(session.payload.language)}</span></div>
          <div className="react-lab-rules">{rules.map((rule, index) => <div key={rule}><b>{index + 1}</b><span>{rule}</span></div>)}</div>
          <hr />
          <small>{String(session.payload.course)}</small>
          <strong>{String(session.payload.lesson)}</strong>
          {evidence.map((item) => (
            <details key={item.id}><summary><b>{item.id}</b> {item.title}</summary><p>{item.text}</p></details>
          ))}
        </aside>

        <section className="react-lab-editor">
          <div><Code2 size={16} /><b>{String(session.payload.function_name)}.py</b><span>Python · isolated subprocess</span></div>
          <PythonCodeEditor value={code} onChange={onCodeChange} />
          <small>Challenge {String(session.payload.challenge_id)} · Session {session.session_id}</small>
        </section>

        <aside className="react-lab-card react-lab-results">
          <div className="react-lab-result-head"><h3>Kết quả thực thi</h3><span>{loading ? "Đang chạy" : tests.length ? `${tests.filter((x) => x.passed).length}/${tests.length} đã đạt` : "Chưa chạy"}</span></div>
          {loading ? <div className="react-lab-empty">Python đang chạy {authoredTests.length} test từ data…</div> : tests.length ? tests.map((test, index) => (
            <article className={test.passed ? "passed" : "failed"} key={test.id}>
              <i>{test.passed ? "✓" : "×"}</i>
              <div><code>Test {index + 1}: {test.label}</code>
                <dl><dt>Input</dt><dd>{JSON.stringify(test.arguments)}</dd><dt>Expected</dt><dd>{JSON.stringify(test.expected)}</dd><dt>Actual</dt><dd>{test.actual || "—"}</dd></dl>
                <small>{test.passed ? "Backend xác nhận đạt" : test.error}</small>
              </div>
            </article>
          )) : <div className="react-lab-empty">&gt;_ <b>Chưa có kết quả</b><small>{authoredTests.length} test từ tệp data đã sẵn sàng.</small></div>}
          {error && <p className="react-lab-error">{error}</p>}
          {passed && <div className="react-lab-proof"><Check size={16} /> Bài {round} đã đạt {tests.length}/{tests.length} test{round < totalRounds ? " · đã mở bài tiếp theo" : " · đủ điều kiện hoàn thành"}</div>}
          {passed ? <button className="react-lab-run" onClick={onNext}>{round < totalRounds ? <>Câu tiếp theo →</> : <><Check size={16} /> Hoàn thành thử thách · +120 XP</>}</button> : <button className="react-lab-run" onClick={onSubmit} disabled={loading}><Play size={16} /> Chạy test thật</button>}
          <div className="react-lab-source"><BookOpen size={14} /> Dữ liệu từ API VinCourse</div>
        </aside>
      </div>
    </section>
  );
}
