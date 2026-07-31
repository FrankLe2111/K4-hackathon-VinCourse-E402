import { useState } from "react";
import { ArrowRight, Award, BookOpen, CheckCircle2, FileText, HelpCircle, Highlighter, PenLine, PlayCircle, RefreshCw, ShieldAlert, SkipForward, ZoomIn, ZoomOut } from "lucide-react";
import { submitMode } from "../../api/modes";
import type { GameResult, GameSession } from "../../types/game";
import "./daily-recall.css";

type Props = {
  session: GameSession;
  onCompleted: () => void;
};

const days = Array.from({ length: 5 }, (_, index) => ({
  title: `Day0${index + 1}`,
  docs: [
    { name: `day0${index + 1}_lecture.pdf`, pages: 42 + index * 8 },
    ...(index % 2 === 0 ? [{ name: `day0${index + 1}_material.pdf`, pages: 24 + index * 4 }] : []),
  ],
}));

const confidenceLevels = [
  { level: 1, label: "Chưa chắc", emoji: "🤔" },
  { level: 2, label: "Phân vân", emoji: "🧐" },
  { level: 3, label: "Vừa", emoji: "👍" },
  { level: 4, label: "Tự tin", emoji: "💪" },
  { level: 5, label: "Chắc chắn", emoji: "🔥" },
];

const summaries = [
  ["AI khác automation vì có thể suy luận từ dữ liệu mới, không chỉ chạy luật cố định.", "LLM dự đoán token tiếp theo theo xác suất nên cần kiểm chứng nguồn.", "Dùng AI tốt nhất khi xác định rõ input, output, người dùng và rủi ro."],
  ["Feature scaling giúp gradient descent hội tụ ổn định hơn.", "Label là kết quả cần dự đoán; feature là tín hiệu có trước dự đoán.", "Data leakage làm điểm validation đẹp giả tạo."],
  ["Pattern không đồng nghĩa quan hệ nhân quả.", "Shortcut learning xảy ra khi mô hình học tín hiệu dễ nhưng sai bản chất.", "Chọn task dựa vào output mong muốn: phân loại, dự đoán số, gợi ý."],
  ["Prompt tốt có vai trò, bối cảnh, tiêu chí và định dạng đầu ra.", "Hallucination giảm bằng grounding, source và kiểm chứng.", "Prompt injection cần giới hạn quyền và tách dữ liệu khỏi chỉ dẫn."],
  ["Human-in-the-loop cần thiết ở quyết định rủi ro cao.", "Monitoring giúp phát hiện drift và lỗi sau triển khai.", "Evaluation phải đo đúng outcome học tập, không chỉ cảm giác hay."],
];

export function DailyRecallView({ session, onCompleted }: Props) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [confidence, setConfidence] = useState(3);
  const [result, setResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionTotalXp, setSessionTotalXp] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [sideTab, setSideTab] = useState<"summary" | "quiz">("summary");

  const payload = session.payload || {};
  const allQuestions = (payload.all_questions as Array<{
    question_id: string;
    title: string;
    prompt: string;
    evidence_ids: string[];
    due_reason: string;
    options: Array<{ id: string; text: string }>;
  }>) || [];
  const queueSize = allQuestions.length || 4;
  const isFinished = activeQuestionIndex >= queueSize;
  const doc = days[selectedDay].docs[selectedDoc] ?? days[selectedDay].docs[0];
  const currentQ = allQuestions[activeQuestionIndex] || {
    question_id: (payload.question_id as string) || "q-dr-001",
    title: session.title,
    prompt: session.prompt,
    evidence_ids: session.evidence_ids || ["T02-034"],
    due_reason: (payload.due_reason as string) || "Ôn tập định kỳ",
    options: (payload.options as Array<{ id: string; text: string }>) || [],
  };

  async function handleSubmit() {
    if (!selectedOption) return setError("Vui lòng chọn 1 đáp án trước khi nộp!");
    setLoading(true);
    setError("");
    try {
      const res = await submitMode("daily_recall", {
        user_id: "demo-user",
        course_id: "ml-foundations",
        session_id: session.session_id,
        question_id: currentQ.question_id,
        answer: selectedOption,
        confidence,
      });
      setResult(res);
      setSessionTotalXp((prev) => prev + res.xp);
      onCompleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gửi đáp án thất bại.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSkip() {
    setLoading(true);
    setError("");
    try {
      await submitMode("daily_recall", {
        user_id: "demo-user",
        course_id: "ml-foundations",
        session_id: session.session_id,
        question_id: currentQ.question_id,
        answer: "SKIP",
        confidence: 1,
      });
      onCompleted();
      handleNextQuestion();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bỏ qua câu hỏi thất bại.");
    } finally {
      setLoading(false);
    }
  }

  function handleNextQuestion() {
    setSelectedOption("");
    setConfidence(3);
    setResult(null);
    setError("");
    setActiveQuestionIndex((prev) => prev + 1);
  }

  function restart() {
    setSelectedOption("");
    setConfidence(3);
    setResult(null);
    setError("");
    setSessionTotalXp(0);
    setActiveQuestionIndex(0);
  }

  if (isFinished) {
    return (
      <section className="daily-finish">
        <Award size={42} />
        <h2>Hoàn thành Daily Recall</h2>
        <p>Câu sai/bỏ qua đã được đẩy sang Error Dungeon để ôn lại.</p>
        <strong>+{sessionTotalXp} XP</strong>
        <button className="primary-button" onClick={restart}><RefreshCw size={16} /> Ôn lại phiên này</button>
      </section>
    );
  }

  return (
    <section className="daily-shell">
      <aside className="daily-library">
        <div className="daily-library-head"><BookOpen size={22} /><div><h2>Học liệu môn học</h2><p>Chương, slide và tài liệu đã upload</p></div></div>
        {days.map((day, dayIndex) => (
          <section key={day.title} className={dayIndex === selectedDay ? "daily-day active" : "daily-day"}>
            <button onClick={() => {
              setSelectedDay(dayIndex);
              setSelectedDoc(0);
              setPage(1);
            }}><PlayCircle size={18} /><strong>{day.title}</strong><span>{day.docs.length} tài liệu · published</span></button>
            {dayIndex === selectedDay ? day.docs.map((item, docIndex) => (
              <button key={item.name} className={docIndex === selectedDoc ? "daily-doc selected" : "daily-doc"} onClick={() => {
                setSelectedDoc(docIndex);
                setPage(1);
              }}>
                <PlayCircle size={16} /><strong>{item.name}</strong><span>{item.pages} trang</span>
              </button>
            )) : null}
          </section>
        ))}
      </aside>

      <main className="daily-study">
        <div className="daily-toolbar">
          <button className="secondary-button"><PlayCircle size={16} /> Đọc</button>
          <button className="secondary-button"><PenLine size={16} /> Bút</button>
          <button className="secondary-button"><Highlighter size={16} /> Highlight</button>
          <span>Trang {page} · 1 note</span>
          <button className="secondary-button" onClick={() => setZoom((value) => Math.max(70, value - 10))}><ZoomOut size={16} /></button>
          <strong>{zoom}%</strong>
          <button className="secondary-button" onClick={() => setZoom((value) => Math.min(140, value + 10))}><ZoomIn size={16} /></button>
        </div>

        <section className="daily-reader">
          <div className="daily-page-meta"><span>Trang {page} / {doc.pages}</span><span>{doc.name}</span></div>
          <article className="daily-slide" style={{ transform: `scale(${zoom / 100})` }}>
            <small>AI IN ACTION — {days[selectedDay].title}</small>
            <h1>{selectedDay === 0 ? "AI & LLM Foundation" : currentQ.title.replace("Daily Recall — ", "")}</h1>
            <p>Bạn đang ôn lại phần kiến thức sẽ được hỏi trong Daily Recall. Sau này khu vực này hiển thị PDF thật bạn upload.</p>
            <b>VinCourse</b>
          </article>
        </section>

        <div className="daily-page-nav">
          <button className="secondary-button" onClick={() => setPage((value) => Math.max(1, value - 1))}>‹</button>
          <span>Trang {page} / {doc.pages}</span>
          <button className="secondary-button" onClick={() => setPage((value) => Math.min(doc.pages, value + 1))}>›</button>
        </div>
      </main>

      <aside className="daily-quiz">
        <div className="daily-side-tabs">
          <button className={sideTab === "summary" ? "active" : ""} onClick={() => setSideTab("summary")}><FileText size={15} /> Summary slide</button>
          <button className={sideTab === "quiz" ? "active" : ""} onClick={() => setSideTab("quiz")}><HelpCircle size={15} /> Trắc nghiệm</button>
        </div>

        {sideTab === "summary" ? (
          <div className="daily-summary">
            <div className="daily-quiz-head"><span>{days[selectedDay].title}</span><b>{doc.name}</b></div>
            <h2>Tóm tắt bài giảng</h2>
            <p>Ôn nhanh các ý chính trước khi làm câu hỏi recall.</p>
            <div className="daily-summary-list">
              {summaries[selectedDay].map((item, index) => <article key={item}><strong>{index + 1}</strong><p>{item}</p></article>)}
            </div>
            <div className="daily-summary-callout">
              <strong>Gợi ý học tập</strong>
              <p>Đọc summary trước, tự giải thích lại bằng lời của bạn, rồi chuyển sang trắc nghiệm để kiểm tra trí nhớ.</p>
            </div>
            <button className="primary-button" onClick={() => setSideTab("quiz")}>Làm trắc nghiệm <ArrowRight size={16} /></button>
          </div>
        ) : (
          <>
            <div className="daily-quiz-head"><span>Câu {activeQuestionIndex + 1}/{queueSize}</span><b>{currentQ.due_reason}</b></div>
            <h2>{currentQ.title}</h2>
            <p>{currentQ.prompt}</p>
            <div className="daily-source">{currentQ.evidence_ids.map((id) => <span key={id}>[{id}]</span>)}</div>
            <div className="daily-options">
              {currentQ.options.map((opt) => (
                <button key={opt.id} className={selectedOption === opt.id ? "selected" : ""} onClick={() => !result && setSelectedOption(opt.id)} disabled={Boolean(result)}>
                  <span>{opt.id}</span>{opt.text}
                </button>
              ))}
            </div>
            {!result ? (
              <>
                <div className="daily-confidence"><HelpCircle size={16} />{confidenceLevels.map((item) => <button key={item.level} className={confidence === item.level ? "active" : ""} onClick={() => setConfidence(item.level)}>{item.emoji}<small>{item.label}</small></button>)}</div>
                {error ? <p className="daily-error">{error}</p> : null}
                <div className="button-row"><button className="primary-button" disabled={loading || !selectedOption} onClick={() => void handleSubmit()}>{loading ? "Đang xử lý…" : <>Nộp bài <ArrowRight size={16} /></>}</button><button className="secondary-button" disabled={loading} onClick={() => void handleSkip()}><SkipForward size={16} /> Bỏ qua</button></div>
              </>
            ) : (
              <div className={result.correct ? "daily-result success" : "daily-result danger"}>
                {result.correct ? <CheckCircle2 /> : <ShieldAlert />}
                <strong>{result.correct ? "Chính xác!" : "Cần ôn lại"} · +{result.xp} XP</strong>
                <p>{result.feedback}</p>
                <button className="primary-button" onClick={handleNextQuestion}>{activeQuestionIndex + 1 < queueSize ? "Sang câu tiếp theo" : "Xem tổng kết"}</button>
              </div>
            )}
          </>
        )}
      </aside>
    </section>
  );
}
