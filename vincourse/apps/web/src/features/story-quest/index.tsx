import { useEffect, useMemo, useState } from "react";
import { getModeSession, submitMode } from "../../api/modes";
import type { GameResult, GameSession } from "../../types/game";
import castleIcon from "../../assets/castle.png";
import circleIcon from "../../assets/circle.png";
import cityscapeIcon from "../../assets/cityscape.png";
import doorIcon from "../../assets/door.png";
import metalworkingIcon from "../../assets/metalworking.png";
import mountainIcon from "../../assets/mountain.png";
import parkIcon from "../../assets/park.png";
import ruralIcon from "../../assets/rural.png";
import shippingIcon from "../../assets/shipping.png";
import stadiumIcon from "../../assets/stadium.png";
import odysseyOwl from "../../assets/odyssey-owl.png";
import "./story-quest.css";

type StoryOption = { id: string; text: string };
type StoryQuestion = {
  id: string;
  type: "quiz" | "code";
  concept_id: string;
  xp: number;
  context: string;
  difficulty?: string;
  prompt?: string;
  hint?: string;
  options?: StoryOption[];
  task?: string;
  starter_code?: string;
  blank_count?: number;
  visible_tests?: string[];
  hints?: string[];
};
type StoryZone = { id: string; name: string; questions: StoryQuestion[] };
type Recovery = { question_id: string; concept_id: string; feedback: string; priority: "normal" | "high" };
type Save = {
  zoneIndex: number;
  unlocked: number;
  completed: string[];
  recoveries: Recovery[];
  attempts: Record<string, number>;
  earnedXp: number;
  streak: number;
  bestStreak: number;
  bonusXp: number;
  perfectZones: string[];
  startedZones: string[];
};

const SAVE_KEY = "vincourse-story-quest";
const EMPTY_SAVE: Save = {
  zoneIndex: 0,
  unlocked: 0,
  completed: [],
  recoveries: [],
  attempts: {},
  earnedXp: 0,
  streak: 0,
  bestStreak: 0,
  bonusXp: 0,
  perfectZones: [],
  startedZones: [],
};
const confidence = [
  [2, "Chưa tự tin 🤔"],
  [3, "Tự tin vừa 👍"],
  [5, "Rất chắc chắn 🔥"],
] as const;

const zoneMeta = [
  ["✦", "Tương tác ban đầu với AI, phân biệt ứng dụng thực tế."],
  ["?", "Đóng khung bài toán đúng nhu cầu và pain-point người dùng."],
  ["◫", "Xử lý dữ liệu đầu vào, đặc trưng feature và nhãn label."],
  ["⌁", "Nhận biết quy luật pattern, mối tương quan correlation."],
  ["⚒", "Tìm hiểu vòng lặp huấn luyện training loop và cập nhật tham số."],
  ["◎", "Lựa chọn thước đo metric đánh giá chất lượng mô hình."],
  ["△", "Khám phá mạng nơ-ron nhân tạo Neural Network."],
  ["◌", "Ứng dụng mô hình ngôn ngữ lớn LLM và xử lý ảo giác."],
  ["⚖", "Đảm bảo tính an toàn, bảo mật và sự giám sát của con người."],
  ["◆", "Tổng hợp toàn bộ kỹ năng xây dựng dự án AI thực tế."],
] as const;

const zoneIcons = [doorIcon, cityscapeIcon, parkIcon, ruralIcon, shippingIcon, metalworkingIcon, mountainIcon, circleIcon, stadiumIcon, castleIcon];

function loadSave(): Save {
  try {
    return { ...EMPTY_SAVE, ...JSON.parse(localStorage.getItem(SAVE_KEY) || "{}") };
  } catch {
    return EMPTY_SAVE;
  }
}

function titleForConcept(id: string) {
  const known: Record<string, string> = {
    "ai-vs-automation": "Phân biệt AI và Tự động hóa",
    verification: "Kiểm chứng nguồn dữ liệu",
    "appropriate-ai-use": "Sử dụng AI đúng mục đích",
    "problem-framing": "Định hình bài toán AI",
    "user-pain-points": "Xác định nỗi đau người dùng",
    "data-quality": "Chất lượng dữ liệu & Feature",
    "bias-and-fairness": "Độ lệch Bias và Công bằng",
  };
  return known[id] ?? id.split("-").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");
}

function mentorLine(result: GameResult | null, hintUsed: boolean, context: string) {
  if (result?.correct) return "Xuất sắc! Đáp án chuẩn xác và lý giải rất rõ ràng.";
  if (result) return "Sai lầm cũng là cơ hội học hỏi. Lỗi này đã được lưu để củng cố lại!";
  if (hintUsed) return "Gợi ý chỉ là kim chỉ nam, hãy áp dụng để suy luận nhé.";
  return context;
}

export function StoryQuest({ onCompleted }: { onCompleted: () => void }) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [save, setSave] = useState<Save>(loadSave);
  const [viewLevel, setViewLevel] = useState<"zone_list" | "zone_detail">("zone_list");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [selfConfidence, setSelfConfidence] = useState(3);
  const [codeAnswers, setCodeAnswers] = useState<string[]>([]);
  const [hintUsed, setHintUsed] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void getModeSession("story")
      .then(setSession)
      .catch((err) => setError(err instanceof Error ? err.message : "Không tải được dữ liệu Hành Trình AI."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  }, [save]);

  const zones = (session?.payload.zones as StoryZone[] | undefined) ?? [];
  const zone = zones[save.zoneIndex];
  const question = zone?.questions[questionIndex];
  const completed = useMemo(() => new Set(save.completed), [save.completed]);
  const passMark = zone ? Math.ceil(zone.questions.length * 0.8) : 0;
  const correctInZone = zone?.questions.filter((item) => completed.has(item.id)).length ?? 0;
  const zoneProgress = passMark ? Math.min(100, Math.round((correctInZone / passMark) * 100)) : 0;
  const zoneRecoveries = zone?.questions.filter((item) => save.recoveries.some((recovery) => recovery.question_id === item.id)) ?? [];
  const ready = question?.type === "quiz"
    ? Boolean(selected)
    : codeAnswers.length === (question?.blank_count ?? 0) && codeAnswers.every((answer) => answer.trim());
  const meta = zoneMeta[save.zoneIndex] ?? ["◆", "Thử thách kiến thức AI."];
  const showIntro = zone ? !save.startedZones.includes(zone.id) : false;
  const achievements = [
    save.streak >= 3 ? `Chuỗi làm đúng x${save.streak} 🔥` : "",
    save.perfectZones.includes(zone?.id ?? "") ? "Chinh phục xuất sắc ⭐" : "",
    save.recoveries.length === 0 ? "Làm bài hoàn hảo ✨" : "",
  ].filter(Boolean);

  function updateSave(patch: Partial<Save> | ((current: Save) => Save)) {
    setSave((current) => typeof patch === "function" ? patch(current) : { ...current, ...patch });
  }

  function resetQuestion() {
    setSelected("");
    setSelfConfidence(3);
    setCodeAnswers([]);
    setHintUsed(false);
    setResult(null);
    setError("");
  }

  function openZoneDetail(targetZoneIndex: number) {
    if (targetZoneIndex > save.unlocked) return;
    updateSave({ zoneIndex: targetZoneIndex });
    setViewLevel("zone_detail");
    setQuestionIndex(0);
    setShowResult(false);
    resetQuestion();
  }

  function backToZoneList() {
    setViewLevel("zone_list");
    setShowResult(false);
    resetQuestion();
  }

  async function submit() {
    if (!question || !session) return;
    setLoading(true);
    setError("");
    try {
      const next = await submitMode("story", {
        user_id: "demo-user",
        course_id: "ml-foundations",
        session_id: session.session_id,
        question_id: question.id,
        answer: question.type === "quiz" ? selected : JSON.stringify(codeAnswers),
        confidence: selfConfidence,
      });
      setResult(next);
      playTone(next.correct);
      updateSave((current) => {
        const attempts = { ...current.attempts, [question.id]: (current.attempts[question.id] ?? 0) + 1 };
        if (next.correct) {
          const wasCompleted = current.completed.includes(question.id);
          const streak = wasCompleted ? current.streak : current.streak + 1;
          const streakBonus = !wasCompleted && streak > 0 && streak % 3 === 0 ? 5 : 0;
          return {
            ...current,
            attempts,
            streak,
            bestStreak: Math.max(current.bestStreak, streak),
            completed: wasCompleted ? current.completed : [...current.completed, question.id],
            earnedXp: wasCompleted ? current.earnedXp : current.earnedXp + next.xp + streakBonus,
            bonusXp: current.bonusXp + streakBonus,
            recoveries: current.recoveries.filter((item) => item.question_id !== question.id),
          };
        }
        if (current.recoveries.some((item) => item.question_id === question.id)) return { ...current, attempts, streak: 0 };
        return {
          ...current,
          attempts,
          streak: 0,
          recoveries: [...current.recoveries, {
            question_id: question.id,
            concept_id: question.concept_id,
            feedback: next.feedback,
            priority: selfConfidence >= 5 ? "high" : "normal",
          }],
        };
      });
      onCompleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không chấm được kết quả.");
    } finally {
      setLoading(false);
    }
  }

  function nextQuestion() {
    if (!zone) return;
    if (questionIndex < zone.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      resetQuestion();
      return;
    }
    const passed = correctInZone >= passMark;
    setShowResult(true);
    if (passed) {
      updateSave((current) => {
        const perfectBonus = correctInZone === zone.questions.length && !current.perfectZones.includes(zone.id) ? 20 : 0;
        return {
          ...current,
          unlocked: Math.max(current.unlocked, save.zoneIndex + 1),
          earnedXp: current.earnedXp + perfectBonus,
          bonusXp: current.bonusXp + perfectBonus,
          perfectZones: perfectBonus ? [...current.perfectZones, zone.id] : current.perfectZones,
        };
      });
    }
  }

  function openRecovery(item: Recovery) {
    const nextZoneIndex = zones.findIndex((candidate) => candidate.questions.some((candidateQuestion) => candidateQuestion.id === item.question_id));
    if (nextZoneIndex < 0) return;
    updateSave({ zoneIndex: nextZoneIndex, unlocked: Math.max(save.unlocked, nextZoneIndex) });
    setViewLevel("zone_detail");
    setQuestionIndex(zones[nextZoneIndex].questions.findIndex((candidateQuestion) => candidateQuestion.id === item.question_id));
    setShowResult(false);
    resetQuestion();
  }

  function restartStory() {
    updateSave(EMPTY_SAVE);
    setViewLevel("zone_list");
    setQuestionIndex(0);
    setShowResult(false);
    resetQuestion();
  }

  function playTone(correct: boolean) {
    if (!soundOn) return;
    const AudioContext = window.AudioContext || (window as Window & { webkitAudioContext?: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const audio = new AudioContext();
    const tone = audio.createOscillator();
    const gain = audio.createGain();
    tone.frequency.value = correct ? 740 : 190;
    gain.gain.value = 0.035;
    tone.connect(gain);
    gain.connect(audio.destination);
    tone.start();
    tone.stop(audio.currentTime + 0.12);
  }

  if (loading && !session) return (
    <div className="vc-loading-container">
      <div className="vc-loading-card">
        <div className="vc-loading-owl-wrapper">
          <div className="vc-loading-glow-circle" />
          <div className="vc-loading-spinner-ring" />
          <img src={odysseyOwl} alt="Mascot cú VinCourse" className="vc-loading-owl" />
        </div>
        <h3>Đang mở Hành Trình AI...</h3>
        <p>AI Coach đang nạp dữ liệu bản đồ và các Vùng kiến thức cho bạn.</p>
        <div className="vc-loading-bar-track">
          <div className="vc-loading-bar-fill" />
        </div>
      </div>
    </div>
  );

  if (error && !session) return (
    <div className="vc-loading-container">
      <div className="vc-loading-card" style={{ borderColor: "#fecaca" }}>
        <div className="vc-loading-owl-wrapper">
          <img src={odysseyOwl} alt="Mascot cú VinCourse" className="vc-loading-owl" style={{ filter: "grayscale(0.4)" }} />
        </div>
        <h3 style={{ color: "#b91c1c" }}>Không kết nối được máy chủ</h3>
        <p style={{ color: "#64748b" }}>{error}</p>
        <p style={{ fontSize: "13px", color: "#94a3b8" }}>Hãy đảm bảo API đang chạy tại <strong>localhost:8000</strong> rồi thử lại.</p>
      </div>
    </div>
  );

  if (!zone || !question) return (
    <div className="vc-loading-container">
      <div className="vc-loading-card">
        <div className="vc-loading-owl-wrapper">
          <div className="vc-loading-glow-circle" />
          <div className="vc-loading-spinner-ring" />
          <img src={odysseyOwl} alt="Mascot cú VinCourse" className="vc-loading-owl" />
        </div>
        <h3>Đang chuẩn bị bài học...</h3>
        <p>Dữ liệu bài học đang được tải. Vui lòng chờ trong giây lát.</p>
        <div className="vc-loading-bar-track">
          <div className="vc-loading-bar-fill" />
        </div>
      </div>
    </div>
  );

  if (showIntro && viewLevel === "zone_detail") {
    return (
      <section className="story-shell">
        <section className="story-zone-intro">
          <button className="secondary-button story-back-btn-light" onClick={backToZoneList}>⬅ Quay lại danh sách Vùng</button>
          <div className="story-intro-orb">{meta[0]}</div>
          <p className="story-eyebrow">Vùng kiến thức {String(save.zoneIndex).padStart(2, "0")} · Giới thiệu nhiệm vụ</p>
          <h1>{zone.name}</h1>
          <p>{meta[1]} Hoàn thành ít nhất {passMark}/{zone.questions.length} câu hỏi để mở khóa vùng tiếp theo.</p>
          <div className="story-intro-grid">
            <span><strong>{zone.questions.length}</strong> bài học</span>
            <span><strong>{zone.questions.reduce((total, item) => total + item.xp, 0)}</strong> XP tối đa</span>
            <span><strong>{zoneRecoveries.length}</strong> câu cần ôn</span>
          </div>
          <div className="story-dialogue">
            <p>“Học tập là hành trình tích lũy. Hãy bình tĩnh suy luận để hiểu rõ bản chất kiến thức nhé!”</p>
          </div>
          <div className="button-row">
            <button className="primary-button" onClick={() => updateSave((current) => ({
              ...current,
              startedZones: current.startedZones.includes(zone.id) ? current.startedZones : [...current.startedZones, zone.id],
            }))}>Bắt đầu làm bài</button>
            <button className="secondary-button" onClick={() => setSoundOn((current) => !current)}>{soundOn ? "Tắt âm thanh" : "Bật âm thanh"}</button>
          </div>
        </section>
      </section>
    );
  }

  if (showResult && viewLevel === "zone_detail") {
    const passed = correctInZone >= passMark;
    const isFinalZone = save.zoneIndex === zones.length - 1;
    const needsReview = zoneRecoveries.slice(0, 3);
    return (
      <section className={`story-result-panel ${passed ? "success" : "danger"}`}>
        <button className="secondary-button story-back-btn" onClick={backToZoneList}>⬅ Quay lại danh sách Vùng</button>
        <div className="story-unlock-burst">{passed ? "✦" : "!"}</div>
        <p className="story-eyebrow">{passed ? "Chúc mừng hoàn thành Vùng!" : "Cần cố gắng thêm"}</p>
        <h2>{zone.name}</h2>
        <p>{passed ? "Bạn đã xuất sắc vượt qua chỉ tiêu!" : "Bạn chưa đủ 80% số câu đúng."} Làm đúng {correctInZone}/{zone.questions.length} câu (cần đạt ít nhất {passMark} câu).</p>
        <div className="story-reward-grid">
          <span><strong>{save.earnedXp}</strong> XP đã đạt</span>
          <span><strong>{save.bonusXp}</strong> XP thưởng</span>
          <span><strong>{save.bestStreak}</strong> Chuỗi đúng nhất</span>
          <span><strong>{save.recoveries.length}</strong> Câu cần ôn</span>
        </div>
        {passed && save.perfectZones.includes(zone.id) ? <p className="story-bonus">Thưởng hoàn thành 100%: +20 XP 🔥</p> : null}
        {needsReview.length ? (
          <div className="story-review-list">
            <strong>Các câu cần củng cố lại:</strong>
            {needsReview.map((item) => {
              const recovery = save.recoveries.find((candidate) => candidate.question_id === item.id);
              return recovery ? <button key={item.id} onClick={() => openRecovery(recovery)}>{titleForConcept(item.concept_id)} · {item.id}</button> : null;
            })}
          </div>
        ) : <p className="story-bonus">🎉 Bạn làm đúng 100% không có câu sai nào trong Vùng này!</p>}
        <div className="button-row">
          {passed ? (
            <button className="primary-button" onClick={() => isFinalZone ? restartStory() : openZoneDetail(save.zoneIndex + 1)}>
              {isFinalZone ? "Học lại từ đầu 🔄" : "Sang Vùng tiếp theo ➔"}
            </button>
          ) : (
            <>
              <button className="primary-button" onClick={() => {
                setQuestionIndex(0);
                setShowResult(false);
                resetQuestion();
              }}>Làm lại Vùng này 🔄</button>
              {save.recoveries.length ? <button className="secondary-button" onClick={() => openRecovery(save.recoveries[0])}>Làm lại câu sai</button> : null}
            </>
          )}
        </div>
      </section>
    );
  }

  // =========================================================================
  // LEVEL 1: DANH SÁCH CÁC VÙNG KIẾN THỨC (ZONE LIST VIEW)
  // =========================================================================
  if (viewLevel === "zone_list") {
    return (
      <section className="story-shell">
        {/* Banner Header */}
        <header className="story-hero">
          <div>
            <p className="story-eyebrow">Story Quest · Hành Trình AI</p>
            <h2>Hành Trình Khám Phá AI</h2>
            <p>Khám phá các Vùng kiến thức AI & Machine Learning. Chọn từng Vùng bên dưới để bắt đầu học bài.</p>
            <div className="story-progress" aria-label={`Tiến độ tổng hợp`}>
              <span style={{ width: `${Math.round(((save.unlocked + 1) / zones.length) * 100)}%` }} />
            </div>
            <small>Đã mở khóa: {save.unlocked + 1}/{zones.length} Vùng · Tổng XP: {save.earnedXp} XP · Chuỗi đúng: {save.streak}</small>
            {achievements.length ? <div className="story-achievements">{achievements.map((item) => <span key={item}>{item}</span>)}</div> : null}
          </div>
          <button className="secondary-button" onClick={restartStory}>Làm lại từ đầu 🔄</button>
        </header>

        {/* Stacked List of Zone Cards */}
        <div className="story-stacked-zones">
          <div className="story-stacked-header">
            <h3>🗺️ Danh sách các Vùng Kiến Thức (Chọn Vùng để học bài):</h3>
          </div>

          {zones.map((item, zIndex) => {
            const isCurrentActive = save.zoneIndex === zIndex;
            const zoneCorrect = item.questions.filter((candidate) => completed.has(candidate.id)).length;
            const passed = zoneCorrect >= Math.ceil(item.questions.length * 0.8);
            const isLocked = zIndex > save.unlocked;
            const recovery = save.recoveries.find((candidate) => item.questions.some((itemQuestion) => itemQuestion.id === candidate.question_id));
            const metaInfo = zoneMeta[zIndex] ?? ["◆", "Thử thách kiến thức AI."];
            const icon = zoneIcons[zIndex];

            return (
              <button
                key={item.id}
                className={`story-stacked-card ${isCurrentActive ? "active" : ""} ${passed ? "done" : ""} ${isLocked ? "locked" : ""}`}
                disabled={isLocked}
                onClick={() => openZoneDetail(zIndex)}
              >
                <div className="story-stacked-left">
                  <div className="story-zone-marker">
                    {icon ? <img src={icon} alt="" /> : <span>{metaInfo[0]}</span>}
                    <small>{String(zIndex).padStart(2, "0")}</small>
                  </div>
                  
                  <div className="story-stacked-info">
                    <div className="story-stacked-title-row">
                      <h3>{item.name}</h3>
                      {recovery && <span className="story-recovery-pill">! Có câu cần ôn</span>}
                    </div>
                    <p className="story-stacked-desc">{metaInfo[1]}</p>
                    <div className="story-stacked-tags">
                      <span className="story-badge-status">
                        {isLocked ? "🔒 Chưa mở khóa" : passed ? "✓ Đã hoàn thành" : `${zoneCorrect}/${item.questions.length} câu đã xong`}
                      </span>
                      <span className="story-badge-count">{item.questions.length} Bài học con</span>
                    </div>
                  </div>
                </div>

                <div className="story-stacked-action">
                  {!isLocked ? <span className="story-enter-btn">Vào Vùng học bài ➔</span> : <span className="story-lock-text">Chưa mở</span>}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  // =========================================================================
  // LEVEL 2: TRANG CHI TIẾT VÙNG & GIAO DIỆN LÀM BÀI (ZONE DETAIL VIEW)
  // =========================================================================
  return (
    <section className="story-shell">
      {/* FLOATING XP POPUP TOAST WHEN ANSWER IS CORRECT */}
      {result?.correct && (
        <div className="story-xp-popup-toast">
          <div className="story-xp-popup-badge">✨ +{result.xp} XP ✨</div>
          <p>
            Chính xác! Bạn nhận được <strong>+{result.xp} XP</strong>
            {save.streak > 0 && save.streak % 3 === 0 ? " · Thưởng chuỗi +5 XP 🔥" : ""}
          </p>
        </div>
      )}

      {/* Top Header Navigation for Zone Detail */}
      <div className="story-detail-top-nav">
        <button className="secondary-button story-back-btn" onClick={backToZoneList}>
          ⬅ Quay lại danh sách Vùng
        </button>
        
        <div className="story-detail-zone-title">
          <h2>{zone.name}</h2>
          <span className="story-badge-status">
            Đã xong {correctInZone}/{zone.questions.length} câu
          </span>
        </div>
      </div>

      {/* Sub-Question / Box List Row */}
      <div className="story-boxes-panel">
        <div className="story-boxes-header">
          <span>📌 Danh sách các Bài học thuộc {zone.name} (Bấm vào từng bài để chọn):</span>
        </div>
        
        <div className="story-question-boxes-grid">
          {zone.questions.map((qItem, qIndex) => {
            const isDone = completed.has(qItem.id);
            const isRec = save.recoveries.some((candidate) => candidate.question_id === qItem.id);
            const isCurrentSelectedQ = questionIndex === qIndex;

            return (
              <button
                key={qItem.id}
                className={`story-q-box ${isCurrentSelectedQ ? "selected" : ""} ${isDone ? "done" : ""} ${isRec ? "recovery" : ""}`}
                onClick={() => {
                  setQuestionIndex(qIndex);
                  resetQuestion();
                }}
              >
                <div className="story-q-box-badge">
                  {isRec ? "!" : isDone ? "✓" : qIndex + 1}
                </div>
                <div className="story-q-box-content">
                  <strong>Bài {qIndex + 1}: {titleForConcept(qItem.concept_id)}</strong>
                  <p>{qItem.prompt ?? qItem.task}</p>
                  <span className="story-q-xp">+{qItem.xp} XP</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Question Workspace (Question Card + Journal + Recovery Panel) */}
      <div className="story-layout">
        <aside className="story-journal">
          <div className="story-emblem">{meta[0]}</div>
          <p className="story-eyebrow">Sổ tay học viên</p>
          <h2>{titleForConcept(question.concept_id)}</h2>
          <p>{meta[1]}</p>
          <div className="story-stat"><span>Câu số</span><strong>{questionIndex + 1} / {zone.questions.length}</strong></div>
          <div className="story-stat"><span>Điểm thưởng</span><strong>+{question.xp} XP</strong></div>
          <div className="story-stat"><span>Số lần thử</span><strong>{save.attempts[question.id] ?? 0} lần</strong></div>
          <div className="story-stat"><span>Đạt chỉ tiêu</span><strong>{correctInZone}/{passMark} câu</strong></div>
          <div className="story-stat"><span>Chuỗi đúng</span><strong>{save.streak} câu</strong></div>
          <div className="story-guide"><p>“{mentorLine(result, hintUsed, question.context)}”</p></div>
        </aside>

        <main className="feature-panel story-card">
          <div className="story-card-head">
            <span className="story-tag">Bài {questionIndex + 1} / {zone.questions.length}</span>
            <span className="story-tag">Mã: {question.id}</span>
          </div>
          <h2>{question.prompt ?? question.task}</h2>

          {question.type === "quiz" ? (
            <div className="story-answer-list">
              {question.options?.map((option) => (
                <button key={option.id} className={`story-answer ${selected === option.id ? "selected" : ""} ${result && selected === option.id ? result.correct ? "correct" : "wrong" : ""}`} onClick={() => setSelected(option.id)} disabled={Boolean(result)}>
                  <span className="story-answer-key">{option.id}</span>
                  <span>{option.text}</span>
                </button>
              ))}
            </div>
          ) : (
            <>
              <pre className="story-code-block">{question.starter_code}</pre>
              <div className="story-blank-list">
                {Array.from({ length: question.blank_count ?? 0 }, (_, index) => (
                  <label key={index}>
                    Vị trí ___{index + 1}___
                    <input value={codeAnswers[index] ?? ""} onChange={(event) => {
                      const next = [...codeAnswers];
                      next[index] = event.target.value;
                      setCodeAnswers(next);
                    }} disabled={Boolean(result)} placeholder="Nhập đáp án..." />
                  </label>
                ))}
              </div>
              <ul className="story-visible-tests">{question.visible_tests?.map((test) => <li key={test}>Checklist: {test}</li>)}</ul>
            </>
          )}

          {hintUsed && <p className="story-hint">💡 Gợi ý: {question.hint ?? question.hints?.[0]}</p>}
          {error && <p className="alert">{error}</p>}

          {result && (
            <div className={`story-result ${result.correct ? "success" : "danger"}`}>
              <div className="story-result-title-row">
                <strong>{result.correct ? "🎉 CHÍNH XÁC!" : "❌ CHƯA CHÍNH XÁC"}</strong>
                <span className="story-result-badge">{result.correct ? `+${result.xp} XP` : "Đã lưu hầm ngục"}</span>
              </div>
              <p>{result.feedback}</p>
              <p>{result.next_action}</p>
            </div>
          )}

          <div className="button-row story-actions">
            {!result ? (
              <>
                <button className="secondary-button" onClick={() => setHintUsed(true)}>Xem gợi ý 💡</button>
                {question.type === "quiz" && confidence.map(([value, label]) => (
                  <button key={value} className={selfConfidence === value ? "secondary-button active" : "secondary-button"} onClick={() => setSelfConfidence(value)}>{label}</button>
                ))}
                <button className="primary-button" onClick={() => void submit()} disabled={!ready || loading}>{loading ? "Đang kiểm tra..." : "Nộp bài 🚀"}</button>
              </>
            ) : (
              <>
                <button className="primary-button" onClick={nextQuestion}>{questionIndex === zone.questions.length - 1 ? "Xem kết quả Vùng 🏆" : result.correct ? "Sang câu tiếp theo ➔" : "Tiếp tục (đã lưu lỗi sai)"}</button>
                {!result.correct && <button className="secondary-button" onClick={resetQuestion}>Làm lại câu này 🔄</button>}
              </>
            )}
          </div>
        </main>

        <aside className="story-recovery-panel">
          <h3>Hầm Ngục Lỗi Sai 🛡️</h3>
          {save.recoveries.length ? save.recoveries.map((item) => (
            <button key={item.question_id} onClick={() => openRecovery(item)}>
              <strong>{titleForConcept(item.concept_id)}</strong>
              <em>{item.priority === "high" ? "🚨 Cần khắc phục gấp" : "📌 Cần ôn lại"}</em>
              <span>{item.feedback}</span>
            </button>
          )) : <p>🎉 Chưa có câu sai nào trong hầm ngục!</p>}
        </aside>
      </div>
    </section>
  );
}
