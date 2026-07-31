import { useState } from "react";
import { Beaker, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Code2, Lightbulb, Play, RefreshCw, Send, Shuffle } from "lucide-react";
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
  const aiCoach = String(payload.ai_coach ?? "AI Coach sẽ đưa hint theo lỗi test của bạn.");
  const [code, setCode] = useState(starterCode);
  const [confidence, setConfidence] = useState(3);
  const [result, setResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
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
              <button className="secondary-button" onClick={() => setHintOpen((current) => !current)}><Lightbulb size={16} /> Hint</button>
              {hintOpen ? <p className="lab-hint">Dùng Kahn&apos;s topological sort: tạo graph + indegree, mỗi lần lấy toàn bộ node indegree bằng 0 làm một round.</p> : null}
              <p className="lab-ai-coach"><strong>AI Coach</strong>{aiCoach}</p>
            </article>
          ) : tab === "editorial" ? (
            <article className="lab-description">
              <h1>Editorial</h1>
              <p>Bài này là topological sort theo từng lớp. Thay vì lấy từng node, ta lấy toàn bộ tool đang có <code>indegree = 0</code> để tạo một vòng chạy song song.</p>
              <ol>
                <li>Tạo adjacency list và mảng indegree.</li>
                <li>Khởi tạo <code>current</code> bằng tất cả tool chưa phụ thuộc tool nào.</li>
                <li>Sắp xếp <code>current</code>, thêm vào schedule, rồi giảm indegree của các tool phụ thuộc.</li>
                <li>Các tool vừa mở khóa được đưa vào <code>next_round</code>, không chạy ngay trong vòng hiện tại.</li>
                <li>Nếu số tool đã xử lý nhỏ hơn <code>n</code>, graph có cycle.</li>
              </ol>
              <pre>{`Time: O(n + m + n log n)
Space: O(n + m)
m = dependencies.length`}</pre>
            </article>
          ) : tab === "solutions" ? (
            <article className="lab-description">
              <h1>Reference Solution</h1>
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
                  <strong>{result.correct ? "Accepted" : "Chưa qua test"}</strong>
                  <p>{result.feedback}</p>
                  <small>{result.correct ? `+${result.xp} XP` : "Đã lưu vào recovery queue để làm lại."}</small>
                </div>
              ) : (
                <p>Chưa có submission. Bấm <code>Run</code> hoặc <code>Submit</code> để chạy visible tests.</p>
              )}
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
            {result ? <div className={`lab-result ${result.correct ? "success" : "danger"}`}><strong>{result.correct ? `Accepted · +${result.xp} XP` : `Chưa qua test · +${result.xp} XP luyện tập`}</strong><p>{result.feedback}</p><small>{result.next_action}</small></div> : null}
          </div>
        </section>
      </div>
    </section>
  );
}
