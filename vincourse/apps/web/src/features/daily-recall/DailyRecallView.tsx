import { useState } from "react";
import { ArrowRight, Award, BookOpen, CheckCircle2, FileText, HelpCircle, Highlighter, PenLine, PlayCircle, RefreshCw, ShieldAlert, SkipForward, ZoomIn, ZoomOut } from "lucide-react";
import { submitMode } from "../../api/modes";
import type { GameResult, GameSession } from "../../types/game";
import day4Pdf from "../../assets/day4.pdf";
import "./daily-recall.css";

type Props = {
  session: GameSession;
  onCompleted: () => void;
};

const days = Array.from({ length: 5 }, (_, index) => ({
  title: `Day0${index + 1}`,
  docs: [
    index === 3 ? { name: "day4.pdf", pages: 9, src: day4Pdf } : { name: `day0${index + 1}_lecture.pdf`, pages: 42 + index * 8 },
    ...(index % 2 === 0 ? [{ name: `day0${index + 1}_material.pdf`, pages: 24 + index * 4 }] : []),
  ],
}));

const confidenceLevels = [
  { level: 1, label: "Chưa chắc", emoji: "🤔" },
  { level: 2, label: "Phân vân", emoji: "🧐" },
  { level: 3, label: "Vừa", emoji: "👍" },
  { level: 4, label: "Tự tin", emoji: "💪" },
  { level: 5, label: "Rất chắc", emoji: "🔥" },
];

const summaries = [
  ["AI khác automation vì có thể suy luận từ dữ liệu mới, không chỉ chạy luật cố định.", "LLM dự đoán token tiếp theo theo xác suất nên cần kiểm chứng nguồn.", "Dùng AI tốt nhất khi xác định rõ input, output, người dùng và rủi ro."],
  ["Feature scaling giúp gradient descent hội tụ ổn định hơn.", "Label là kết quả cần dự đoán; feature là tín hiệu có trước dự đoán.", "Data leakage làm điểm validation đẹp giả tạo."],
  ["Pattern không đồng nghĩa quan hệ nhân quả.", "Shortcut learning xảy ra khi mô hình học tín hiệu dễ nhưng sai bản chất.", "Chọn task dựa vào output mong muốn: phân loại, dự đoán số, gợi ý."],
  [
    "Prompt là interface giữa human intent và model behavior; specificity beats cleverness.",
    "RTCF gồm Role, Task, Context, Format; bắt đầu với Task + Format trước.",
    "Negative prompt hiệu quả nhất khi có positive alternative: nói model nên làm gì thay vì chỉ nói đừng.",
    "Zero-shot nên thử trước; few-shot dùng khi cần format/consistency; CoT chỉ nên dùng cho reasoning nhiều bước.",
    "System prompt production-grade cần persona, rules, capabilities, constraints và output format.",
    "System prompt phải được test với happy path, edge case, out-of-scope, injection, tool decision và format consistency.",
  ],
  ["Human-in-the-loop cần thiết ở quyết định rủi ro cao.", "Monitoring giúp phát hiện drift và lỗi sau triển khai.", "Evaluation phải đo đúng outcome học tập, không chỉ cảm giác hay."],
];

export function DailyRecallView({ session, onCompleted }: Props) {
  const [viewLevel, setViewLevel] = useState<"doc_list" | "doc_reader">("doc_list");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [confidence, setConfidence] = useState(3);
  const [result, setResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionTotalXp, setSessionTotalXp] = useState(0);
  const [selectedDay, setSelectedDay] = useState(3);
  const [selectedDoc, setSelectedDoc] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [sideTab, setSideTab] = useState<"summary" | "quiz">("summary");

  const payload = session.payload || {};
  const aiSummary = selectedDay === 3 ? (payload.ai_summary as string[] | undefined) ?? summaries[selectedDay] : summaries[selectedDay];
  const aiFlashcards = selectedDay === 3 ? (payload.ai_flashcards as Array<{ front: string; back: string }> | undefined) ?? [] : [];
  const aiGeneratedQuestions = selectedDay === 3 ? (payload.ai_generated_questions as string[] | undefined) ?? [] : [];
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
  const isRealPdf = "src" in doc;
  const currentQ = allQuestions[activeQuestionIndex] || {
    question_id: (payload.question_id as string) || "q-dr-001",
    title: session.title,
    prompt: session.prompt,
    evidence_ids: session.evidence_ids || ["T02-034"],
    due_reason: (payload.due_reason as string) || "Ôn tập định kỳ",
    options: (payload.options as Array<{ id: string; text: string }>) || [],
  };

  function selectDoc(dayIndex: number, docIndex: number) {
    setSelectedDay(dayIndex);
    setSelectedDoc(docIndex);
    setPage(1);
    setViewLevel("doc_reader");
  }

  function backToDocList() {
    setViewLevel("doc_list");
  }

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
    setViewLevel("doc_list");
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

  // =========================================================================
  // LEVEL 1: DANH SÁCH HỌC LIỆU MÔN HỌC (DOCUMENT LIST SELECTION VIEW)
  // =========================================================================
  if (viewLevel === "doc_list") {
    return (
      <section className="daily-shell-list">
        {/* Banner Header */}
        <header className="daily-list-hero">
          <div>
            <span className="daily-tag">Ôn Tập Hằng Ngày · Spaced Practice</span>
            <h2>Học Liệu Môn Học</h2>
            <p>Danh sách các bài giảng, slide PDF và tài liệu môn học. Bấm vào tài liệu bên dưới để mở Slide và bắt đầu ôn tập.</p>
            <div className="daily-list-stats">
              <span>📚 5 Ngày học bài giảng</span>
              <span>⚡ {queueSize} Câu hỏi recall đến hạn</span>
            </div>
          </div>
        </header>

        {/* Document Selection Grid */}
        <div className="daily-doc-grid">
          {days.map((day, dayIndex) => (
            <div key={day.title} className="daily-day-group">
              <div className="daily-day-head">
                <BookOpen size={20} />
                <h3>{day.title}</h3>
                <span>{day.docs.length} Tài liệu · Published</span>
              </div>
              
              <div className="daily-day-docs">
                {day.docs.map((item, docIndex) => (
                  <button
                    key={item.name}
                    className="daily-doc-card"
                    onClick={() => selectDoc(dayIndex, docIndex)}
                  >
                    <div className="daily-doc-icon">
                      <FileText size={24} />
                    </div>
                    <div className="daily-doc-info">
                      <strong>{item.name}</strong>
                      <p>{item.pages} trang · Tài liệu slide chính thức</p>
                    </div>
                    <span className="daily-doc-btn">Xem Slide & Ôn tập ➔</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // =========================================================================
  // LEVEL 2: GIAO DIỆN 2 CỘT (SLIDE PDF 60% + TÓM TẮT & TRẮC NGHIỆM 40%)
  // =========================================================================
  return (
    <section className="daily-shell-reader">
      {/* FLOATING XP TOAST POPUP WHEN CORRECT */}
      {result?.correct && (
        <div className="story-xp-popup-toast">
          <div className="story-xp-popup-badge">✨ +{result.xp} XP ✨</div>
          <p>Chính xác! Bạn nhận được <strong>+{result.xp} XP</strong> vào tổng điểm Daily Recall.</p>
        </div>
      )}

      {/* Top Header Nav for Reader */}
      <div className="daily-reader-nav">
        <button className="secondary-button story-back-btn" onClick={backToDocList}>
          ⬅ Quay lại danh sách Học liệu
        </button>

        <div className="daily-reader-title">
          <h3>{doc.name}</h3>
          <span>Trang {page} / {doc.pages}</span>
        </div>

        <div className="daily-reader-toolbar">
          <button className="secondary-button" onClick={() => setZoom((v) => Math.max(70, v - 10))}><ZoomOut size={16} /></button>
          <strong>{zoom}%</strong>
          <button className="secondary-button" onClick={() => setZoom((v) => Math.min(140, v + 10))}><ZoomIn size={16} /></button>
        </div>
      </div>

      {/* 2-COLUMN WORKSPACE: LEFT = SLIDE (60%), RIGHT = SUMMARY & QUIZ (40%) */}
      <div className="daily-2col-layout">
        {/* COLUMN 1: PDF SLIDE VIEWER (60%) */}
        <main className="daily-slide-col">
          <div className="daily-reader-box">
            <div className="daily-page-meta">
              <span>{doc.name}</span>
              <span>Trang {page} / {doc.pages}</span>
            </div>

            {isRealPdf ? (
              <iframe className="daily-pdf" src={`${doc.src}#page=${page}&zoom=${zoom}`} title={doc.name} />
            ) : (
              <article className="daily-slide" style={{ transform: `scale(${zoom / 100})` }}>
                <small>AI IN ACTION — {days[selectedDay].title}</small>
                <h1>{selectedDay === 0 ? "AI & LLM Foundation" : currentQ.title.replace("Daily Recall — ", "")}</h1>
                <p>Bạn đang xem Slide học liệu của {days[selectedDay].title}. Vùng này hiển thị PDF slide chính thức của môn học.</p>
                <b>VinCourse AI Odyssey</b>
              </article>
            )}

            <div className="daily-page-nav">
              <button className="secondary-button" onClick={() => setPage((v) => Math.max(1, v - 1))}>‹ Trang trước</button>
              <span>Trang {page} / {doc.pages}</span>
              <button className="secondary-button" onClick={() => setPage((v) => Math.min(doc.pages, v + 1))}>Trang sau ›</button>
            </div>
          </div>
        </main>

        {/* COLUMN 2: SUMMARY & QUIZ INTERACTIVE PANEL (40%) */}
        <aside className="daily-interactive-col">
          <div className="daily-side-tabs">
            <button className={sideTab === "summary" ? "active" : ""} onClick={() => setSideTab("summary")}>
              <FileText size={15} /> Tóm tắt bài giảng
            </button>
            <button className={sideTab === "quiz" ? "active" : ""} onClick={() => setSideTab("quiz")}>
              <HelpCircle size={15} /> Trắc nghiệm ({activeQuestionIndex + 1}/{queueSize})
            </button>
          </div>

          {sideTab === "summary" ? (
            <div className="daily-summary">
              <div className="daily-quiz-head"><span>{days[selectedDay].title}</span><b>{doc.name}</b></div>
              <h2>Tóm tắt bài giảng</h2>
              <p>AI Coach tóm tắt nhanh các ý chính trước khi làm câu hỏi recall.</p>
              <div className="daily-summary-list">
                {aiSummary.map((item, index) => (
                  <article key={item}><strong>{index + 1}</strong><p>{item}</p></article>
                ))}
              </div>

              {aiFlashcards.length ? (
                <>
                  <h3>Flashcard AI</h3>
                  <div className="daily-summary-list">
                    {aiFlashcards.map((card) => (
                      <article key={card.front}><strong>Q</strong><p><b>{card.front}</b><br />{card.back}</p></article>
                    ))}
                  </div>
                </>
              ) : null}

              {aiGeneratedQuestions.length ? (
                <div className="daily-summary-callout">
                  <strong>Câu hỏi AI gợi ý</strong>
                  <p>{aiGeneratedQuestions.join(" · ")}</p>
                </div>
              ) : null}

              <button className="primary-button daily-start-quiz-btn" onClick={() => setSideTab("quiz")}>
                Làm trắc nghiệm ôn tập
              </button>
            </div>
          ) : (
            <div className="daily-quiz-box">
              <div className="daily-quiz-head">
                <span>Câu {activeQuestionIndex + 1}/{queueSize}</span>
                <b>{currentQ.due_reason}</b>
              </div>
              <h2>{currentQ.title}</h2>
              <p className="daily-q-prompt">{currentQ.prompt}</p>
              <div className="daily-source">
                {currentQ.evidence_ids.map((id) => <span key={id}>Nguồn [{id}]</span>)}
              </div>

              <div className="daily-options">
                {currentQ.options.map((opt) => (
                  <button
                    key={opt.id}
                    className={selectedOption === opt.id ? "selected" : ""}
                    onClick={() => !result && setSelectedOption(opt.id)}
                    disabled={Boolean(result)}
                  >
                    <span>{opt.id}</span>
                    <span>{opt.text}</span>
                  </button>
                ))}
              </div>

              {!result ? (
                <>
                  <div className="daily-confidence">
                    <p>Độ tự tin:</p>
                    <div className="daily-confidence-btns">
                      {confidenceLevels.map((item) => (
                        <button
                          key={item.level}
                          className={confidence === item.level ? "active" : ""}
                          onClick={() => setConfidence(item.level)}
                        >
                          {item.emoji} <small>{item.label}</small>
                        </button>
                      ))}
                    </div>
                  </div>

                  {error ? <p className="daily-error">{error}</p> : null}

                  <div className="daily-quiz-actions">
                    <button className="primary-button" disabled={loading || !selectedOption} onClick={() => void handleSubmit()}>
                      {loading ? "Đang xử lý…" : <>Nộp bài 🚀</>}
                    </button>
                    <button className="secondary-button" disabled={loading} onClick={() => void handleSkip()}>
                      <SkipForward size={16} /> Bỏ qua ⏭️
                    </button>
                  </div>
                </>
              ) : (
                <div className={result.correct ? "daily-result success" : "daily-result danger"}>
                  <div className="story-result-title-row">
                    <strong>{result.correct ? "🎉 CHÍNH XÁC!" : "❌ CẦN ÔN LẠI"}</strong>
                    <span className="story-result-badge">{result.correct ? `+${result.xp} XP` : "Đã chuyển Error Dungeon"}</span>
                  </div>
                  <p>{result.feedback}</p>
                  <button className="primary-button" onClick={handleNextQuestion}>
                    {activeQuestionIndex + 1 < queueSize ? "Sang câu tiếp theo ➔" : "Xem tổng kết 🏆"}
                  </button>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
