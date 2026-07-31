import { useState } from "react";
import { Beaker, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Code2, Lightbulb, Play, RefreshCw, Send, Shuffle, Sparkles } from "lucide-react";
import { submitMode } from "../../api/modes";
import type { GameResult, GameSession } from "../../types/game";
import "./lab-arena.css";

type Props = {
  session: GameSession;
  onCompleted: () => void;
};

const fallbackCode = `from typing import List


def schedule_tools(
    n: int,
    dependencies: List[List[int]]
) -> List[List[int]]:
    # Write your code here
    pass
`;

const days = Array.from({ length: 5 }, (_, index) => ({
  title: `Day0${index + 1}`,
  labs: index === 3 ? ["schedule-tool-calls.py", "day04_debug_task.py"] : [`day0${index + 1}_standardize.py`, `day0${index + 1}_debug_task.py`],
}));

export function LabArenaView({ session, onCompleted }: Props) {
  const payload = session.payload;
  const starterCode = String(payload.starter_code ?? fallbackCode);
  const visibleTests = (payload.visible_tests as string[] | undefined) ?? [];
  const concepts = (payload.concept_ids as string[] | undefined) ?? [];
  const title = String(payload.title ?? "Schedule Tool Calls");
  const difficulty = String(payload.difficulty ?? "Medium");
  const constraints = (payload.constraints as string[] | undefined) ?? [];

  const [code, setCode] = useState(starterCode);
  const [confidence, setConfidence] = useState(3);
  const [result, setResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [dynamicAiHint, setDynamicAiHint] = useState("");
  const [selectedDay, setSelectedDay] = useState(3);
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
        question_id: String(payload.challenge_id ? `lab-round-${payload.order}` : "lab-round-1"),
        answer: code,
        confidence,
      });
      setResult(next);
      
      // Update dynamic AI Coach Hint ONLY when submission fails (làm sai)
      if (!next.correct) {
        const hint = (next.payload as Record<string, unknown>)?.ai_coach_hint as string | undefined;
        setDynamicAiHint(hint || next.feedback || "AI Coach: Code chưa qua testcases. Hãy kiểm tra điều kiện lặp và đầu ra.");
        setHintOpen(true);
      } else {
        setDynamicAiHint("");
        setHintOpen(false);
      }

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
        <button title="Bài trước"><ChevronLeft size={17} /></button>
        <button title="Bài sau"><ChevronRight size={17} /></button>
        <button title="Bài ngẫu nhiên"><Shuffle size={17} /></button>
        <span />
        <button className="lab-run" onClick={() => void runTests()} disabled={loading || !code.trim()}>
          <Play size={16} /> Run Tests
        </button>
        <button className="lab-submit" onClick={() => void runTests()} disabled={loading || !code.trim()}>
          <Send size={16} /> Submit Code
        </button>
      </header>

      <div className="lab-main">
        {/* SIDEBAR: 5 DAYS LAB LIST */}
        <aside className="lab-days">
          <div className="lab-days-head"><BookOpen size={19} /><strong>5 Ngày Lab AI</strong></div>
          {days.map((day, dayIndex) => (
            <section key={day.title} className={dayIndex === selectedDay ? "active" : ""}>
              <button onClick={() => {
                setSelectedDay(dayIndex);
                setSelectedLab(0);
              }}>{day.title}<span>{day.labs.length} bài</span></button>
              {dayIndex === selectedDay ? day.labs.map((lab, labIndex) => (
                <button key={lab} className={labIndex === selectedLab ? "selected" : ""} onClick={() => setSelectedLab(labIndex)}>
                  <Code2 size={15} />{lab}
                </button>
              )) : null}
            </section>
          ))}
        </aside>

        {/* MIDDLE: PROBLEM DESCRIPTION & TABS */}
        <main className="lab-problem">
          <nav className="lab-tabs">
            {(["description", "editorial", "solutions", "submissions"] as const).map((item) => (
              <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
                {item === "description" ? "Mô tả đề bài" : item === "editorial" ? "Phân tích" : item === "solutions" ? "Code mẫu" : "Lịch sử nộp"}
              </button>
            ))}
          </nav>
          
          {tab === "description" ? (
            <article className="lab-description">
              <h1>{title}</h1>
              <div className="lab-tags">{[difficulty, ...concepts].map((item) => <span key={item}>{item}</span>)}</div>
              <p>{session.prompt}</p>
              <p>Cho một AI agent có <code>n</code> công cụ, đánh số từ <code>0</code> đến <code>n - 1</code>. Mỗi dependency <code>[a, b]</code> nghĩa là tool <code>a</code> phải chạy xong trước khi tool <code>b</code> được bắt đầu.</p>
              <ul>
                <li>Mỗi vòng chạy song song tất cả tool hiện đã mở khóa.</li>
                <li>Tool hoàn thành ở vòng hiện tại chỉ mở khóa tool khác ở vòng tiếp theo.</li>
                <li>Các tool trong cùng vòng phải sắp xếp tăng dần.</li>
                <li>Nếu dependency tạo cycle, trả về <code>[]</code>.</li>
              </ul>
              <h3>Example 1</h3>
              <pre>{`Input: n = 6, dependencies = [[0,2],[1,2],[1,3],[2,4],[3,4],[4,5]]
Output: [[0,1],[2,3],[4],[5]]
Explanation:
Round 1: 0,1
Round 2: 2,3
Round 3: 4
Round 4: 5`}</pre>
              <h3>Example 2</h3>
              <pre>{`Input: n = 3, dependencies = [[0,1],[1,2],[2,0]]
Output: []
Explanation: dependency cycle exists.`}</pre>
              <h3>Constraints</h3>
              <ul>
                {constraints.map((item) => <li key={item}>{item}</li>)}
                <li>Không dùng file/network/system access.</li>
              </ul>
              
              {/* DYNAMIC AI COACH DEBUG HINT BOX - ONLY SHOW WHEN USER MAKES A MISTAKE */}
              {result && !result.correct && dynamicAiHint ? (
                <div className="lab-dynamic-ai-box">
                  <div className="lab-ai-box-head">
                    <span className="lab-ai-badge">🤖 AI Coach Debug Hint (Code Chưa Qua Test)</span>
                    <button className="lab-toggle-hint" onClick={() => setHintOpen((v) => !v)}>
                      <Lightbulb size={14} /> {hintOpen ? "Ẩn gợi ý" : "Hiện gợi ý"}
                    </button>
                  </div>
                  {hintOpen && (
                    <p className="lab-ai-hint-text">
                      {dynamicAiHint}
                    </p>
                  )}
                </div>
              ) : null}
            </article>
          ) : tab === "editorial" ? (
            <article className="lab-description">
              <h1>Phân Tích Thuật Toán (Editorial)</h1>
              <p>Bài này sử dụng Thuật toán Sắp xếp Topo theo từng lớp (Kahn&apos;s Topological Sort by Rounds).</p>
              <ol>
                <li>Khởi tạo đồ thị `graph` và mảng số lượng phụ thuộc `indegree` cho `n` công cụ.</li>
                <li>Gom toàn bộ tool có `indegree == 0` vào danh sách `current` cho vòng đầu tiên.</li>
                <li>Trong mỗi vòng: Sắp xếp `current`, thêm vào kết quả, giảm `indegree` của các tool phụ thuộc.</li>
                <li>Đưa các tool mới mở khóa (`indegree == 0`) vào `next_round` cho vòng kế tiếp.</li>
              </ol>
            </article>
          ) : tab === "solutions" ? (
            <article className="lab-description">
              <h1>Reference Solution (Python 3)</h1>
              <pre>{`from typing import List


def schedule_tools(n: int, dependencies: List[List[int]]) -> List[List[int]]:
    graph = [[] for _ in range(n)]
    indegree = [0] * n

    for before, after in dependencies:
        graph[before].append(after)
        indegree[after] += 1

    current = [tool for tool in range(n) if indegree[tool] == 0]
    schedule = []
    processed = 0

    while current:
        current.sort()
        schedule.append(current)
        next_round = []

        for tool in current:
            processed += 1
            for unlocked in graph[tool]:
                indegree[unlocked] -= 1
                if indegree[unlocked] == 0:
                    next_round.append(unlocked)

        current = next_round

    return schedule if processed == n else []`}</pre>
            </article>
          ) : (
            <article className="lab-description">
              <h1>Submissions</h1>
              {result ? (
                <div className={`lab-submission-card ${result.correct ? "success" : "danger"}`}>
                  <strong>{result.correct ? "🎉 Accepted" : "❌ Chưa qua test"}</strong>
                  <p>{result.feedback}</p>
                  <small>{result.correct ? `+${result.xp} XP` : "Đã lưu vào Error Dungeon queue."}</small>
                </div>
              ) : (
                <p>Chưa có submission. Bấm <code>Run Tests</code> hoặc <code>Submit Code</code> để kiểm tra.</p>
              )}
            </article>
          )}
        </main>

        {/* RIGHT: IDE CODE EDITOR & TESTCASES PANEL */}
        <section className="lab-code-panel">
          <div className="lab-editor-head">
            <strong><Code2 size={17} /> IDE Editor</strong>
            <span>Python3 · Sandbox Active</span>
          </div>

          <textarea
            className="lab-editor"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            spellCheck={false}
            placeholder="Viết code Python3 của bạn ở đây..."
          />

          <div className="lab-actions">
            <label>Confidence: <input type="number" min={1} max={5} value={confidence} onChange={(event) => setConfidence(Number(event.target.value))} /></label>
            <button className="secondary-button" onClick={() => {
              setCode(starterCode);
              setResult(null);
              setDynamicAiHint("");
              setHintOpen(false);
            }}><RefreshCw size={16} /> Reset</button>
          </div>

          {/* DYNAMIC AI DEBUG COACH BANNER INSIDE EDITOR - ONLY SHOW WHEN USER MAKES A MISTAKE */}
          {result && !result.correct && dynamicAiHint ? (
            <div className="lab-editor-ai-banner">
              <div className="lab-editor-ai-head">
                <Sparkles size={16} /> <strong>🤖 AI Coach Debug Hint:</strong>
              </div>
              <p>{dynamicAiHint}</p>
            </div>
          ) : null}

          <div className="lab-test-panel">
            <strong><CheckCircle2 size={16} /> Visible Testcases</strong>
            <div className="lab-tests">
              {visibleTests.map((test) => (
                <span key={test} className={result?.correct ? "pass" : result ? "fail" : ""}>
                  {result?.correct ? "✓" : result ? "!" : "•"} {test}
                </span>
              ))}
            </div>
            {error ? <p className="alert">{error}</p> : null}
            {result ? (
              <div className={`lab-result ${result.correct ? "success" : "danger"}`}>
                <strong>{result.correct ? `🎉 Accepted · +${result.xp} XP` : `❌ Chưa qua test · AI Coach Debug Active`}</strong>
                <p>{result.feedback}</p>
                <small>{result.next_action}</small>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </section>
  );
}
