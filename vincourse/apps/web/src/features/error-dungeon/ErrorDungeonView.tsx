import { useState } from "react";
import { Skull, BookOpen, AlertCircle, Award, CheckCircle, Zap, ShieldAlert, ArrowRight, HelpCircle, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { getModeSession, submitMode } from "../../api/modes";
import type { GameResult, GameSession } from "../../types/game";

type Props = {
  session: GameSession;
  onCompleted: () => void;
};

export function ErrorDungeonView({ session: initialSession, onCompleted }: Props) {
  const [session, setSession] = useState<GameSession>(initialSession);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [result, setResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const payload = session.payload || {};
  const isEmpty = Boolean(payload.empty);
  const queueSize = (payload.queue_size as number) || 0;
  const allUnresolved = (payload.all_unresolved as Array<{
    misconception_id: string;
    title: string;
    prompt: string;
    evidence_ids: string[];
    original_question: string;
    old_wrong_answer: string;
    original_correct_answer: string;
    source_summary: string;
    transfer_question: string;
    transfer_options: Array<{ id: string; text: string }>;
    ai_mentor_line?: string;
    ai_repair_steps?: string[];
    ai_transfer_drill?: string;
  }>) || [];

  const currentItem = allUnresolved[activeIndex] || {
    misconception_id: (payload.misconception_id as string) || "m-001",
    title: session.title,
    prompt: session.prompt,
    evidence_ids: session.evidence_ids || ["T02-034"],
    original_question: (payload.original_question as string) || "Câu hỏi đã làm sai.",
    old_wrong_answer: (payload.old_wrong_answer as string) || "Chưa có dữ liệu câu trả lời sai.",
    original_correct_answer: (payload.original_correct_answer as string) || "Chưa có dữ liệu đáp án đúng.",
    source_summary: (payload.source_summary as string) || "Đọc lại bài giảng để đối chiếu bằng chứng.",
    transfer_question: (payload.transfer_question as string) || "Trả lời câu hỏi tình huống mới để kiểm tra.",
    transfer_options: (payload.transfer_options as Array<{ id: string; text: string }>) || [],
    ai_mentor_line: (payload.ai_mentor_line as string) || "AI Coach: Sửa lỗi sai bằng bằng chứng, không học thuộc đáp án.",
    ai_repair_steps: (payload.ai_repair_steps as string[] | undefined) || [],
    ai_transfer_drill: (payload.ai_transfer_drill as string) || "",
  };

  async function reloadSession() {
    try {
      const updatedSession = await getModeSession("error_dungeon");
      setSession(updatedSession);
      setSelectedOption("");
      setResult(null);
      setError("");
      setActiveIndex(0);
    } catch {
      // Ignore background reload error
    }
  }

  async function handleSubmit() {
    if (!selectedOption) {
      setError("Vui lòng chọn 1 phương án giải quyết cho tình huống mới!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await submitMode("error_dungeon", {
        user_id: "demo-user",
        course_id: "ml-foundations",
        session_id: session.session_id,
        question_id: currentItem.misconception_id,
        answer: selectedOption,
        confidence: 5,
      });
      setResult(res);
      onCompleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gửi bài giải phóng lỗi thất bại.");
    } finally {
      setLoading(false);
    }
  }

  function handleNextDungeonItem() {
    void reloadSession();
  }

  // Empty Dungeon view when all misconceptions are cleared
  if (isEmpty || queueSize === 0) {
    return (
      <div style={{ width: "100%", color: "#0f172a", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "36px 24px", textAlign: "center", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto", border: "1px solid #bbf7d0" }}>
            <CheckCircle size={36} />
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#166534", margin: "0 0 8px 0" }}>
            Hầm Ngục Trống — Tất Cả Lỗi Sai Đã Được Tiêu Diệt! 🏆
          </h2>
          <p style={{ fontSize: "15px", color: "#475569", margin: "0 auto", maxWidth: "540px", lineHeight: "1.6" }}>
            🎉 Chức mừng bạn! Không còn lỗi sai nào trong danh sách. Hãy tiếp tục làm bài ở <strong>Daily Recall</strong> hoặc <strong>Story Quest</strong> để thử thách bản thân.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", color: "#0f172a", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Full Width White Container */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
        
        {/* Top Header Badge & Queue Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#faf5ff", color: "#7e22ce", padding: "6px 14px", borderRadius: "30px", border: "1px solid #e9d5ff" }}>
            <Skull size={16} color="#9333ea" />
            <span style={{ fontSize: "13px", fontWeight: 700 }}>
              Hầm Ngục Lỗi Sai ({activeIndex + 1}/{queueSize} quái vật)
            </span>
          </div>

          {allUnresolved.length > 1 && (
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                disabled={activeIndex === 0}
                onClick={() => { setActiveIndex((prev) => prev - 1); setSelectedOption(""); setResult(null); }}
                style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "4px 8px", cursor: activeIndex === 0 ? "not-allowed" : "pointer" }}
              >
                <ChevronLeft size={16} color="#475569" />
              </button>
              <button
                disabled={activeIndex + 1 >= allUnresolved.length}
                onClick={() => { setActiveIndex((prev) => prev + 1); setSelectedOption(""); setResult(null); }}
                style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "4px 8px", cursor: activeIndex + 1 >= allUnresolved.length ? "not-allowed" : "pointer" }}
              >
                <ChevronRight size={16} color="#475569" />
              </button>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#fefce8", color: "#a16207", border: "1px solid #fef08a", padding: "6px 14px", borderRadius: "30px", fontSize: "13px", fontWeight: 700 }}>
            <Zap size={14} color="#eab308" />
            <span>Recovery XP Bonus: +100</span>
          </div>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", margin: "0 0 12px 0", lineHeight: "1.4" }}>
          {currentItem.title}
        </h2>
        <p style={{ fontSize: "15px", color: "#475569", margin: "0 0 20px 0", lineHeight: "1.5" }}>
          {currentItem.prompt}
        </p>

        <div style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: "14px", padding: "16px 18px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6d28d9", fontSize: "14px", fontWeight: 800, marginBottom: "8px" }}>
            <Zap size={16} /> AI Recovery Coach
          </div>
          <p style={{ margin: "0 0 10px", color: "#3b0764", lineHeight: 1.55 }}>{currentItem.ai_mentor_line}</p>
          {currentItem.ai_repair_steps?.length ? (
            <ol style={{ margin: 0, paddingLeft: "20px", color: "#4c1d95", lineHeight: 1.7 }}>
              {currentItem.ai_repair_steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          ) : null}
          {currentItem.ai_transfer_drill ? <p style={{ margin: "10px 0 0", color: "#6d28d9", fontWeight: 700 }}>{currentItem.ai_transfer_drill}</p> : null}
        </div>

        {/* 1. CÂU HỎI ĐÃ BỊ SAI */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "#991b1b", marginBottom: "8px" }}>
            <HelpCircle size={15} /> 1. Câu hỏi bạn từng trả lời sai:
          </div>
          <div style={{ background: "#f8fafc", padding: "16px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", borderLeft: "4px solid #ef4444" }}>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", margin: 0, lineHeight: "1.5" }}>
              {currentItem.original_question}
            </p>
          </div>
        </div>

        {/* 2. ĐỐI CHIẾU: LỖI SAI CŨ VS ĐÁP ÁN ĐÚNG CHUẨN */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
          {/* Old Wrong Answer Card */}
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "16px", borderRadius: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#991b1b", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
              <AlertCircle size={15} /> Lỗi sai cũ bạn đã chọn:
            </div>
            <p style={{ fontSize: "14px", color: "#7f1d1d", margin: 0, lineHeight: "1.5", fontWeight: 500 }}>
              ❌ "{currentItem.old_wrong_answer}"
            </p>
          </div>

          {/* Original Correct Answer Card */}
          <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "16px", borderRadius: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#065f46", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
              <CheckCircle2 size={15} /> Đáp án đúng chuẩn:
            </div>
            <p style={{ fontSize: "14px", color: "#047857", margin: 0, lineHeight: "1.5", fontWeight: 600 }}>
              ✅ "{currentItem.original_correct_answer}"
            </p>
          </div>
        </div>

        {/* 3. KIẾN THỨC NGUỒN & BẰNG CHỨNG BÀI GIẢNG */}
        <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", padding: "16px 18px", borderRadius: "12px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0369a1", fontSize: "14px", fontWeight: 700, marginBottom: "6px" }}>
            <BookOpen size={16} /> Kiến thức & Bằng chứng bài giảng [{currentItem.evidence_ids.join(", ")}]:
          </div>
          <p style={{ fontSize: "14px", color: "#0c4a6e", margin: 0, lineHeight: "1.6" }}>
            {currentItem.source_summary}
          </p>
        </div>

        {/* 4. VẬN DỤNG TRÊN MỘT CÂU MỚI (TRANSFER CHALLENGE) */}
        <div style={{ background: "#faf5ff", padding: "20px", borderRadius: "14px", border: "1px solid #e9d5ff", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b21a8", fontWeight: 700, fontSize: "15px", marginBottom: "10px" }}>
            <Zap size={18} color="#9333ea" />
            <span>4. Vận dụng trên một tình huống mới (Transfer Challenge):</span>
          </div>
          <p style={{ fontSize: "15px", color: "#1e1035", lineHeight: "1.6", margin: "0 0 18px 0", fontWeight: 600 }}>
            {currentItem.transfer_question}
          </p>

          {/* Transfer Options List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {currentItem.transfer_options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => !result && setSelectedOption(opt.id)}
                  disabled={Boolean(result)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    background: isSelected ? "#f3e8ff" : "#ffffff",
                    border: isSelected ? "2px solid #9333ea" : "1px solid #e2e8f0",
                    color: "#0f172a",
                    cursor: result ? "default" : "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                    boxShadow: isSelected ? "0 4px 12px rgba(147, 51, 234, 0.12)" : "0 1px 2px rgba(0,0,0,0.02)",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: isSelected ? "#9333ea" : "#f1f5f9",
                      color: isSelected ? "#ffffff" : "#475569",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "13px",
                      flexShrink: 0,
                      border: isSelected ? "none" : "1px solid #cbd5e1",
                    }}
                  >
                    {opt.id}
                  </div>
                  <span style={{ fontSize: "14px", lineHeight: "1.5", paddingTop: "2px", color: isSelected ? "#3b0764" : "#334155", fontWeight: isSelected ? 600 : 400 }}>
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ color: "#dc2626", background: "#fef2f2", padding: "12px 16px", borderRadius: "10px", marginBottom: "20px", fontSize: "14px", border: "1px solid #fecaca" }}>
            {error}
          </div>
        )}

        {/* Submit Button */}
        {!result && (
          <button
            onClick={() => void handleSubmit()}
            disabled={loading || !selectedOption}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "12px",
              background: selectedOption ? "#9333ea" : "#94a3b8",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "16px",
              border: "none",
              cursor: selectedOption ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: selectedOption ? "0 4px 12px rgba(147, 51, 234, 0.3)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            {loading ? "Đang xử lý..." : <>⚔️ Tiêu diệt Lỗi sai trên câu hỏi mới <ArrowRight size={18} /></>}
          </button>
        )}

        {/* Result Card */}
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
              {result.correct ? <CheckCircle size={26} color="#059669" /> : <ShieldAlert size={26} color="#e11d48" />}
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: result.correct ? "#065f46" : "#9f1239" }}>
                {result.correct ? "💥 MISCONCEPTION DEFEATED!" : "Lỗi sai VẪN ĐƯỢC GIỮ LẠI trong Hầm ngục"}
              </h3>
            </div>

            <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#334155", margin: "0 0 14px 0" }}>
              {result.feedback}
            </p>

            {result.correct && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#ffffff", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", border: "1px solid #a7f3d0" }}>
                <Award size={20} color="#d97706" />
                <span style={{ color: "#d97706", fontWeight: 800, fontSize: "15px" }}>
                  +{result.xp} Recovery XP Bonus! (Đã xóa lỗi này khỏi Error Dungeon)
                </span>
              </div>
            )}

            {/* Next Action / Continue Button */}
            <button
              onClick={handleNextDungeonItem}
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
              {result.correct ? "Tiếp tục tiêu diệt lỗi sai tiếp theo ➔" : "Thử lại câu này 🔄"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
