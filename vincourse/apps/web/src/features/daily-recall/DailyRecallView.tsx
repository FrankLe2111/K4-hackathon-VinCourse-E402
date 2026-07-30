import { useState } from "react";
import { Clock, ShieldAlert, Award, ArrowRight, CheckCircle2, Sparkles, HelpCircle, SkipForward, RefreshCw } from "lucide-react";
import { submitMode } from "../../api/modes";
import type { GameResult, GameSession } from "../../types/game";

type Props = {
  session: GameSession;
  onCompleted: () => void;
};

const CONFIDENCE_LEVELS = [
  { level: 1, label: "Chưa chắc", emoji: "🤔" },
  { level: 2, label: "Hơi phân vân", emoji: "🧐" },
  { level: 3, label: "Vừa phải", emoji: "👍" },
  { level: 4, label: "Tự tin", emoji: "💪" },
  { level: 5, label: "Chắc chắn 100%", emoji: "🔥" },
];

export function DailyRecallView({ session, onCompleted }: Props) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(3);
  const [result, setResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionTotalXp, setSessionTotalXp] = useState<number>(0);

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

  const currentQ = allQuestions[activeQuestionIndex] || {
    question_id: (payload.question_id as string) || "q-dr-001",
    title: session.title,
    prompt: session.prompt,
    evidence_ids: session.evidence_ids || ["T02-034"],
    due_reason: (payload.due_reason as string) || "Ôn tập định kỳ",
    options: (payload.options as Array<{ id: string; text: string }>) || [],
  };

  async function handleSubmit() {
    if (!selectedOption) {
      setError("Vui lòng chọn 1 đáp án trước khi nộp!");
      return;
    }
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
      // Record SKIP action in backend so it creates a recovery item in Error Dungeon!
      await submitMode("daily_recall", {
        user_id: "demo-user",
        course_id: "ml-foundations",
        session_id: session.session_id,
        question_id: currentQ.question_id,
        answer: "SKIP",
        confidence: 1,
      });
      onCompleted();
      // Move to next question immediately
      setSelectedOption("");
      setConfidence(3);
      setResult(null);
      setActiveQuestionIndex((prev) => prev + 1);
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

  function handleRestartSession() {
    setSelectedOption("");
    setConfidence(3);
    setResult(null);
    setError("");
    setSessionTotalXp(0);
    setActiveQuestionIndex(0);
  }

  // Final Session Summary Screen
  if (isFinished) {
    return (
      <div style={{ width: "100%", color: "#0f172a", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "32px", textAlign: "center", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto", border: "1px solid #a7f3d0" }}>
            <Award size={36} />
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#065f46", margin: "0 0 8px 0" }}>
            🎉 Hoàn Thành Phiên Ôn Tập Daily Recall!
          </h2>
          <p style={{ fontSize: "15px", color: "#475569", margin: "0 0 24px 0" }}>
            Bạn đã hoàn thành phiên ôn tập hôm nay. Các câu làm sai/bỏ qua đã được lưu vào <strong>Error Dungeon</strong> để tiêu diệt!
          </p>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#fef3c7", color: "#b45309", padding: "12px 24px", borderRadius: "30px", fontWeight: 800, fontSize: "18px", border: "1px solid #fde68a", marginBottom: "28px" }}>
            <Sparkles size={20} color="#d97706" /> +{sessionTotalXp} Tổng XP Đạt Được
          </div>

          <div>
            <button
              onClick={handleRestartSession}
              style={{
                padding: "14px 28px",
                borderRadius: "12px",
                background: "#4f46e5",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "15px",
                border: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
              }}
            >
              <RefreshCw size={16} /> Ôn Tập Lại Phiên Này
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", color: "#0f172a", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Full Width White Card */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
        
        {/* Top Header Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f1f5f9", padding: "6px 14px", borderRadius: "30px", border: "1px solid #e2e8f0" }}>
            <Clock size={15} color="#0284c7" />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#0284c7" }}>Câu {activeQuestionIndex + 1} / {queueSize}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#eef2ff", color: "#4f46e5", border: "1px solid #c7d2fe", padding: "6px 14px", borderRadius: "30px", fontSize: "13px", fontWeight: 600 }}>
            <Sparkles size={14} color="#6366f1" />
            <span>{currentQ.due_reason}</span>
          </div>
        </div>

        {/* Question Prompt Card */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: "0 0 12px 0", lineHeight: "1.4" }}>
            {currentQ.title}
          </h2>
          <div style={{ background: "#f8fafc", padding: "18px 20px", borderRadius: "12px", borderLeft: "4px solid #4f46e5", borderTop: "1px solid #f1f5f9", borderRight: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#334155", margin: 0, fontWeight: 500 }}>
              {currentQ.prompt}
            </p>
          </div>
        </div>

        {/* Evidence Source Chip */}
        {currentQ.evidence_ids && currentQ.evidence_ids.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>Nguồn bài giảng:</span>
            {currentQ.evidence_ids.map((id) => (
              <span key={id} style={{ background: "#e0f2fe", color: "#0369a1", padding: "3px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 700, border: "1px solid #bae6fd" }}>
                [{id}]
              </span>
            ))}
          </div>
        )}

        {/* Multiple Choice Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => !result && setSelectedOption(opt.id)}
                disabled={Boolean(result)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  padding: "16px 18px",
                  borderRadius: "12px",
                  background: isSelected ? "#eef2ff" : "#ffffff",
                  border: isSelected ? "2px solid #4f46e5" : "1px solid #e2e8f0",
                  color: "#0f172a",
                  cursor: result ? "default" : "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                  boxShadow: isSelected ? "0 4px 12px rgba(79, 70, 229, 0.12)" : "0 1px 2px rgba(0,0,0,0.02)",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: isSelected ? "#4f46e5" : "#f1f5f9",
                    color: isSelected ? "#ffffff" : "#475569",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "14px",
                    flexShrink: 0,
                    border: isSelected ? "none" : "1px solid #cbd5e1",
                  }}
                >
                  {opt.id}
                </div>
                <span style={{ fontSize: "15px", lineHeight: "1.5", paddingTop: "2px", color: isSelected ? "#1e1b4b" : "#334155", fontWeight: isSelected ? 600 : 400 }}>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Confidence Selector */}
        {!result && (
          <div style={{ background: "#f8fafc", padding: "18px", borderRadius: "14px", marginBottom: "24px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", fontSize: "14px", color: "#475569", fontWeight: 600 }}>
              <HelpCircle size={16} color="#4f46e5" />
              <span>Đánh giá mức tự tin của bạn:</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
              {CONFIDENCE_LEVELS.map((item) => {
                const isActive = confidence === item.level;
                return (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setConfidence(item.level)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      padding: "10px 4px",
                      borderRadius: "10px",
                      background: isActive ? "#4f46e5" : "#ffffff",
                      border: isActive ? "2px solid #4f46e5" : "1px solid #cbd5e1",
                      color: isActive ? "#ffffff" : "#64748b",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      boxShadow: isActive ? "0 4px 10px rgba(79, 70, 229, 0.2)" : "none",
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>{item.emoji}</span>
                    <span style={{ fontSize: "11px", fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Alert message */}
        {error && (
          <div style={{ color: "#dc2626", background: "#fef2f2", padding: "12px 16px", borderRadius: "10px", marginBottom: "20px", fontSize: "14px", border: "1px solid #fecaca" }}>
            {error}
          </div>
        )}

        {/* Action Buttons Row */}
        {!result ? (
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => void handleSubmit()}
              disabled={loading || !selectedOption}
              style={{
                flex: 1,
                padding: "16px",
                borderRadius: "12px",
                background: selectedOption ? "#4f46e5" : "#94a3b8",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "16px",
                border: "none",
                cursor: selectedOption ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: selectedOption ? "0 4px 12px rgba(79, 70, 229, 0.3)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              {loading ? "Đang xử lý..." : <>Xác nhận & Nộp bài <ArrowRight size={18} /></>}
            </button>

            <button
              onClick={() => void handleSkip()}
              disabled={loading}
              title="Bỏ qua câu hỏi này và đẩy vào Error Dungeon"
              style={{
                padding: "16px 20px",
                borderRadius: "12px",
                background: "#f1f5f9",
                color: "#475569",
                fontWeight: 600,
                fontSize: "14px",
                border: "1px solid #cbd5e1",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Bỏ qua ⏭️
            </button>
          </div>
        ) : null}

        {/* Result Card with Next Question Action */}
        {result && (
          <div
            style={{
              marginTop: "24px",
              padding: "20px",
              borderRadius: "14px",
              background: result.correct ? "#ecfdf5" : "#fff1f2",
              border: result.correct ? "1px solid #a7f3d0" : "1px solid #fecdd3",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              {result.correct ? <CheckCircle2 size={24} color="#059669" /> : <ShieldAlert size={24} color="#e11d48" />}
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: result.correct ? "#065f46" : "#9f1239" }}>
                {result.correct ? "Chính xác!" : "Lưu ý Lỗi sai Misconception"} ({result.status.toUpperCase()})
              </h3>
            </div>

            <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#334155", margin: "0 0 14px 0" }}>
              {result.feedback}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "14px", background: "#ffffff", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", border: "1px solid #e2e8f0" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#d97706", fontWeight: 700 }}>
                <Award size={18} /> +{result.xp} XP
              </span>
              <span style={{ color: "#0284c7", fontWeight: 600 }}>Mastery: +{result.mastery_delta}</span>
            </div>

            {/* Next Question CTA Button */}
            <button
              onClick={handleNextQuestion}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                background: result.correct ? "#059669" : "#4f46e5",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "15px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              {activeQuestionIndex + 1 < queueSize ? (
                <>Sang câu tiếp theo ({activeQuestionIndex + 2}/{queueSize}) <ArrowRight size={18} /></>
              ) : (
                <>Xem tổng kết phiên ôn tập 🎉 <ArrowRight size={18} /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
