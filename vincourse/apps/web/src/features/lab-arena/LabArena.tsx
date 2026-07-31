import { useRef, useState } from "react";
import { BookOpen, Check, ChevronDown, ChevronUp, Code2, FlaskConical, Play, RotateCcw, Sparkles } from "lucide-react";
import type { GameResult, GameSession } from "../../types/game";
import "./lab-arena.css";
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

function highlightPython(code: string): string {
  if (!code) return "";
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const comments: string[] = [];
  html = html.replace(/#.*$/gm, (match) => {
    comments.push(`<span class="py-comment">${match}</span>`);
    return `___COMMENT_${comments.length - 1}___`;
  });

  const strings: string[] = [];
  html = html.replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, (match) => {
    strings.push(`<span class="py-string">${match}</span>`);
    return `___STRING_${strings.length - 1}___`;
  });

  const keywords = /\b(def|return|from|import|for|in|if|else|elif|while|pass|class|try|except|raise|with|as|and|or|not|is|True|False|None|lambda|break|continue|yield|global|nonlocal|async|await)\b/g;
  html = html.replace(keywords, '<span class="py-keyword">$1</span>');

  const builtins = /\b(List|Dict|Set|Tuple|Optional|Union|Any|str|int|float|bool|dict|set|list|tuple|len|range|print|sum|max|min|sorted|abs|all|any|enumerate|zip|map|filter|super|input|type|repr|globals)\b/g;
  html = html.replace(builtins, '<span class="py-builtin">$1</span>');

  html = html.replace(/(<span class="py-keyword">def<\/span>\s+)([a-zA-Z_]\w*)/g, '$1<span class="py-func">$2</span>');
  html = html.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="py-number">$1</span>');
  html = html.replace(/(@[a-zA-Z_]\w*)/g, '<span class="py-decorator">$1</span>');

  strings.forEach((strHtml, i) => { html = html.replace(`___STRING_${i}___`, strHtml); });
  comments.forEach((commentHtml, i) => { html = html.replace(`___COMMENT_${i}___`, commentHtml); });

  return html;
}

export function LabArena(props: Props) {
  const { session, code, result, loading, error, onCodeChange, onSubmit, onRestart, onNext, round, totalRounds } = props;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [problemOpen, setProblemOpen] = useState(true);

  if (!session) return <section className="react-lab-loading">{error || "Đang tạo phiên Lab Arena…"}</section>;

  const evidence = (session.payload.evidence as Evidence[]) ?? [];
  const rules = (session.payload.rules as string[]) ?? [];
  const authoredTests = (session.payload.tests as RuntimeTest[]) ?? [];
  const tests = (result?.payload?.tests as RuntimeTest[] | undefined) ?? [];
  const passed = result?.correct === true;
  const isWrong = Boolean(result && !result.correct);
  const aiCoachHint =
    (result?.payload as Record<string, unknown> | undefined)?.ai_coach_hint as string | undefined
    || (result?.next_action?.startsWith("AI Hint:") ? result.next_action : undefined);

  const lines = code.split("\n");
  const lineNumbers = lines.map((_, i) => i + 1);

  function renderHintHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code class='py-hint-code'>$1</code>")
      .replace(/❌/g, "<span class='py-hint-bad'>❌</span>")
      .replace(/✅/g, "<span class='py-hint-good'>✅</span>")
      .replace(/\n/g, "<br/>");
  }

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  return (
    <section className="react-lab react-lab-vertical">

      {/* ── HEADER ── */}
      <header className="react-lab-hero">
        <div>
          <span><FlaskConical size={17} /> CHẾ ĐỘ 4 · VẬN DỤNG</span>
          <div className="react-lab-round">
            <div><i style={{ width: `${(round / totalRounds) * 100}%` }} /></div>
            <strong>Câu {round}/{totalRounds}</strong>
          </div>
        </div>
        <button onClick={onRestart}><RotateCcw size={16} /> Làm lại thử thách</button>
      </header>

      {/* ── 1. ĐỀ BÀI ── */}
      <div className="lab-v-problem react-lab-card">
        <button className="lab-v-problem-toggle" onClick={() => setProblemOpen((o) => !o)}>
          <span>
            <b className="react-lab-chip">BÀI {round}/{totalRounds} · {String(session.payload.difficulty)}</b>
            <strong className="lab-v-problem-title">{session.title}</strong>
          </span>
          {problemOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {problemOpen && (
          <div className="lab-v-problem-body">
            <div className="react-lab-tags">
              <span>{String(session.payload.topic)}</span>
              <span>{String(session.payload.language)}</span>
            </div>
            <div className="react-lab-rules">
              {rules.map((rule, index) => (
                <div key={rule}><b>{index + 1}</b><span>{rule}</span></div>
              ))}
            </div>
            {evidence.length > 0 && (
              <div className="lab-v-evidence">
                <small>{String(session.payload.lesson)}</small>
                {evidence.map((item) => (
                  <details key={item.id}>
                    <summary><b>{item.id}</b> {item.title}</summary>
                    <p>{item.text}</p>
                  </details>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 2. CODE EDITOR ── */}
      <section className="react-lab-editor lab-v-editor">
        <div className="react-lab-editor-header">
          <Code2 size={16} />
          <b>{String(session.payload.function_name)}.py</b>
          <span>Python 3.12 · Syntax Highlight</span>
        </div>

        <div className="py-editor-container">
          <div className="py-line-numbers">
            {lineNumbers.map((num) => <span key={num}>{num}</span>)}
          </div>
          <div className="py-editor-wrapper">
            <pre ref={preRef} className="py-syntax-display" aria-hidden="true">
              <code dangerouslySetInnerHTML={{ __html: highlightPython(code) + "\n" }} />
            </pre>
            <textarea
              ref={textareaRef}
              className="py-syntax-textarea"
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              onScroll={handleScroll}
              spellCheck={false}
            />
          </div>
        </div>

        <div className="lab-v-run-bar">
          {passed
            ? <button className="react-lab-run" onClick={onNext}>
                {round < totalRounds ? <>Câu tiếp theo</> : <><Check size={16} /> Hoàn thành thử thách · +120 XP</>}
              </button>
            : <button className="react-lab-run" onClick={onSubmit} disabled={loading}>
                <Play size={16} /> {loading ? "Đang chạy…" : "Chạy test"}
              </button>
          }
        </div>
      </section>

      {/* ── 3. KẾT QUẢ THỰC THI ── */}
      <div className="react-lab-card lab-v-results">
        <div className="react-lab-result-head">
          <h3>Kết quả thực thi</h3>
          <span>
            {loading ? "Đang chạy" : tests.length
              ? `${tests.filter((x) => x.passed).length}/${tests.length} đã đạt`
              : "Chưa chạy"}
          </span>
        </div>

        <div className="lab-v-tests">
          {loading ? (
            <div className="react-lab-empty">Python đang chạy {authoredTests.length} test…</div>
          ) : tests.length ? (
            tests.map((test, index) => (
              <article className={test.passed ? "passed" : "failed"} key={test.id}>
                <i>{test.passed ? "✓" : "×"}</i>
                <div>
                  <code>Test {index + 1}: {test.label}</code>
                  <dl>
                    <dt>Input</dt><dd>{JSON.stringify(test.arguments)}</dd>
                    <dt>Expected</dt><dd>{JSON.stringify(test.expected)}</dd>
                    <dt>Actual</dt><dd>{test.actual || "—"}</dd>
                  </dl>
                  <small>{test.passed ? "Backend xác nhận đạt" : test.error}</small>
                </div>
              </article>
            ))
          ) : (
            <div className="react-lab-empty">&gt;_ <b>Chưa có kết quả</b><small>{authoredTests.length} test đã sẵn sàng.</small></div>
          )}
        </div>

        {error && <p className="react-lab-error">{error}</p>}
        {passed && (
          <div className="react-lab-proof">
            <Check size={16} /> Bài {round} đã đạt {tests.length}/{tests.length} test
            {round < totalRounds ? " · đã mở bài tiếp theo" : " · đủ điều kiện hoàn thành"}
          </div>
        )}
        <div className="react-lab-source"><BookOpen size={14} /> Dữ liệu từ API VinCourse</div>
      </div>

      {/* ── 4. AI CODE REVIEWER (chỉ hiện khi làm sai) ── */}
      {isWrong && aiCoachHint && (
        <div className="lab-dynamic-ai-box lab-v-ai">
          <div className="lab-ai-box-head">
            <span className="lab-ai-badge"><Sparkles size={13} style={{ verticalAlign: "middle", marginRight: 4 }} />AI Code Reviewer</span>
            <small className="lab-ai-subtext">Phân tích lỗi · Gợi ý sửa</small>
          </div>
          <div className="lab-ai-hint-text" dangerouslySetInnerHTML={{ __html: renderHintHtml(aiCoachHint) }} />
        </div>
      )}

    </section>
  );
}
