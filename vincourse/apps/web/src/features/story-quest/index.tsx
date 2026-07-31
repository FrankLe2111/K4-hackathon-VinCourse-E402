import { useEffect, useMemo, useState } from "react";
import { getModeSession, submitMode } from "../../api/modes";
import type { GameResult, GameSession } from "../../types/game";
import castleIcon from "../../assets/castle.png";
import circleIcon from "../../assets/circle.png";
import cityscapeIcon from "../../assets/cityscape.png";
import doorIcon from "../../assets/door.png";
import metalworkingIcon from "../../assets/metalworking.png";
import mountainIcon from "../../assets/mountain.png";
import odysseyOwl from "../../assets/odyssey-owl.png";
import parkIcon from "../../assets/park.png";
import ruralIcon from "../../assets/rural.png";
import shippingIcon from "../../assets/shipping.png";
import stadiumIcon from "../../assets/stadium.png";
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
  [2, "Thấp"],
  [3, "Vừa"],
  [5, "Cao"],
] as const;
const zoneMeta = [
  ["✦", "Khởi hành cùng Mira, Patch và ORA."],
  ["?", "Đóng khung đúng người dùng và pain point."],
  ["◫", "Đi qua dữ liệu, feature, label và bias."],
  ["⌁", "Nhận ra pattern, correlation và shortcut learning."],
  ["⚒", "Hiểu training loop và parameter update."],
  ["◎", "Chọn metric và đánh giá mô hình phù hợp."],
  ["△", "Khám phá representation và neural network."],
  ["◌", "Làm việc với LLM, grounding và hallucination."],
  ["⚖", "Giữ human review, privacy và escalation an toàn."],
  ["◆", "Ghép scope, evaluation và oversight."],
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
    "ai-vs-automation": "Phân biệt AI và tự động hóa",
    verification: "Kiểm chứng nguồn",
    "appropriate-ai-use": "Dùng AI đúng việc",
  };
  return known[id] ?? id.split("-").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");
}

function mentorLine(result: GameResult | null, hintUsed: boolean, context: string) {
  if (result?.correct) return "Tốt lắm. Cú trả lời này không chỉ đúng — nó có lý do phía sau.";
  if (result) return "Sai là dữ liệu học tập. Ta đã đánh dấu nó để quay lại mạnh hơn.";
  if (hintUsed) return "Gợi ý là la bàn, không phải đáp án. Hãy dùng nó để kiểm chứng suy nghĩ của mình.";
  return context;
}

export function StoryQuest({ onCompleted }: { onCompleted: () => void }) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [save, setSave] = useState<Save>(loadSave);
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
      .catch((err) => setError(err instanceof Error ? err.message : "Không tải được Story Quest."))
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
  const meta = zoneMeta[save.zoneIndex] ?? ["◆", "Checkpoint AI Odyssey."];
  const showIntro = zone ? !save.startedZones.includes(zone.id) : false;
  const achievements = [
    save.streak >= 3 ? `Streak x${save.streak}` : "",
    save.perfectZones.includes(zone?.id ?? "") ? "Perfect zone" : "",
    save.recoveries.length === 0 ? "Clean run" : "",
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

  function selectZone(nextZoneIndex: number) {
    if (nextZoneIndex > save.unlocked) return;
    updateSave({ zoneIndex: nextZoneIndex });
    setQuestionIndex(0);
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
      setError(err instanceof Error ? err.message : "Không chấm được checkpoint.");
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
    setQuestionIndex(zones[nextZoneIndex].questions.findIndex((candidateQuestion) => candidateQuestion.id === item.question_id));
    setShowResult(false);
    resetQuestion();
  }

  function restartStory() {
    updateSave(EMPTY_SAVE);
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

  if (loading && !session) return <section className="feature-panel"><h2>Đang tải Story Quest…</h2></section>;
  if (error && !session) return <section className="feature-panel alert">{error}</section>;
  if (!zone || !question) return <section className="feature-panel alert">Question bank chưa sẵn sàng.</section>;

  if (showIntro) {
    return (
      <section className="story-shell">
        <section className="story-zone-intro">
          <div className="story-intro-orb">{meta[0]}</div>
          <p className="story-eyebrow">Zone {String(save.zoneIndex).padStart(2, "0")} · Mission Brief</p>
          <h1>{zone.name}</h1>
          <p>{meta[1]} Hoàn thành ít nhất {passMark}/{zone.questions.length} question để mở zone tiếp theo.</p>
          <div className="story-intro-grid">
            <span><strong>{zone.questions.length}</strong> checkpoint</span>
            <span><strong>{zone.questions.reduce((total, item) => total + item.xp, 0)}</strong> XP tối đa</span>
            <span><strong>{zoneRecoveries.length}</strong> câu cần ôn</span>
          </div>
          <div className="story-dialogue">
            <img src={odysseyOwl} alt="Mascot cú AI Odyssey" />
            <p>“Đi chậm mà chắc. Mục tiêu không phải đoán đúng, mà là hiểu vì sao đúng.”</p>
          </div>
          <div className="button-row">
            <button className="primary-button" onClick={() => updateSave((current) => ({
              ...current,
              startedZones: current.startedZones.includes(zone.id) ? current.startedZones : [...current.startedZones, zone.id],
            }))}>Bắt đầu zone</button>
            <button className="secondary-button" onClick={() => setSoundOn((current) => !current)}>{soundOn ? "Tắt âm thanh" : "Bật âm thanh"}</button>
          </div>
        </section>
      </section>
    );
  }

  if (showResult) {
    const passed = correctInZone >= passMark;
    const isFinalZone = save.zoneIndex === zones.length - 1;
    const needsReview = zoneRecoveries.slice(0, 3);
    return (
      <section className={`story-result-panel ${passed ? "success" : "danger"}`}>
        <img className="story-result-mascot" src={odysseyOwl} alt="Mascot cú chúc mừng học tập" />
        <div className="story-unlock-burst">{passed ? "✦" : "!"}</div>
        <p className="story-eyebrow">{passed ? "End-of-zone reward" : "Chưa đủ 80%"}</p>
        <h2>{zone.name}</h2>
        <p>{passed ? "Mở khóa zone tiếp theo." : "Chưa mở khóa zone tiếp theo."} Đúng {correctInZone}/{zone.questions.length}, cần ít nhất {passMark} câu.</p>
        <div className="story-reward-grid">
          <span><strong>{save.earnedXp}</strong> XP đã nhận</span>
          <span><strong>{save.bonusXp}</strong> XP bonus</span>
          <span><strong>{save.bestStreak}</strong> streak tốt nhất</span>
          <span><strong>{save.recoveries.length}</strong> câu cần ôn</span>
        </div>
        {passed && save.perfectZones.includes(zone.id) ? <p className="story-bonus">Perfect zone bonus: +20 XP</p> : null}
        {needsReview.length ? (
          <div className="story-review-list">
            <strong>Câu cần ôn:</strong>
            {needsReview.map((item) => {
              const recovery = save.recoveries.find((candidate) => candidate.question_id === item.id);
              return recovery ? <button key={item.id} onClick={() => openRecovery(recovery)}>{titleForConcept(item.concept_id)} · {item.id}</button> : null;
            })}
          </div>
        ) : <p className="story-bonus">Không có câu sai trong zone này. Gọn đẹp!</p>}
        <div className="button-row">
          {passed ? (
            <button className="primary-button" onClick={() => isFinalZone ? restartStory() : selectZone(save.zoneIndex + 1)}>
              {isFinalZone ? "Chơi lại từ đầu" : "Vào zone tiếp theo"}
            </button>
          ) : (
            <>
              <button className="primary-button" onClick={() => {
                setQuestionIndex(0);
                setShowResult(false);
                resetQuestion();
              }}>Chơi lại vòng này</button>
              {save.recoveries.length ? <button className="secondary-button" onClick={() => openRecovery(save.recoveries[0])}>Làm lại câu sai</button> : null}
            </>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="story-shell">
      <header className="story-hero">
        <div>
          <p className="story-eyebrow">Story Quest · AI Odyssey</p>
          <h2>AI Odyssey</h2>
          <p>Trở thành Nhà Kiến Tạo AI cùng Mira, Patch và ORA. Sai vẫn được đi tiếp; mỗi zone cần đạt 80% để mở khóa vòng sau.</p>
          <div className="story-progress" aria-label={`Tiến độ zone ${zoneProgress}%`}>
            <span style={{ width: `${zoneProgress}%` }} />
          </div>
          <small>Zone progress: {correctInZone}/{passMark} câu đúng để pass · streak hiện tại {save.streak}</small>
          {achievements.length ? <div className="story-achievements">{achievements.map((item) => <span key={item}>{item}</span>)}</div> : null}
        </div>
        <div className="story-mascot-stage" aria-label="Mascot AI Odyssey">
          <img src={odysseyOwl} alt="Mascot cú AI Odyssey" />
          <b>MENTOR<br />CÚ LA BÀN</b>
        </div>
        <button className="secondary-button" onClick={restartStory}>Reset tiến độ</button>
      </header>

      <div className="story-map">
        {zones.map((item, index) => {
          const zoneCorrect = item.questions.filter((candidate) => completed.has(candidate.id)).length;
          const passed = zoneCorrect >= Math.ceil(item.questions.length * 0.8);
          const recovery = save.recoveries.find((candidate) => item.questions.some((itemQuestion) => itemQuestion.id === candidate.question_id));
          const meta = zoneMeta[index] ?? ["◆", "Checkpoint AI Odyssey."];
          const icon = zoneIcons[index];
          return (
            <button
              key={item.id}
              className={`${index === save.zoneIndex ? "active" : passed ? "done" : ""} ${index > save.unlocked ? "locked" : ""}`}
              disabled={index > save.unlocked}
              onClick={() => selectZone(index)}
            >
              <div className="story-zone-marker">{icon ? <img src={icon} alt="" /> : <span>{meta[0]}</span>}<small>{String(index).padStart(2, "0")}</small></div>
              {recovery ? <b className="story-recovery-badge" onClick={(event) => {
                event.stopPropagation();
                openRecovery(recovery);
              }}>!</b> : null}
              <div className="story-zone-copy">
                <strong>{item.name}</strong>
                <span>{meta[1]}</span>
                <span>{index > save.unlocked ? "🔒 Chưa mở khóa" : passed ? "✓ Đã chinh phục" : `${zoneCorrect}/${item.questions.length} question`}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="story-checkpoints">
        {zone.questions.map((item, index) => {
          const recovery = save.recoveries.find((candidate) => candidate.question_id === item.id);
          const done = completed.has(item.id);
          return (
            <button
              key={item.id}
              className={`${index === questionIndex ? "current" : ""} ${done ? "done" : ""} ${recovery ? "recovery" : ""}`}
              onClick={() => {
                if (recovery) openRecovery(recovery);
                else {
                  setQuestionIndex(index);
                  resetQuestion();
                }
              }}
              title={recovery ? "Câu sai: bấm để làm lại" : `Checkpoint ${index + 1}`}
            >
              {recovery ? "!" : done ? "✓" : index + 1}
            </button>
          );
        })}
      </div>

      <div className="story-layout">
        <aside className="story-journal">
          <div className="story-emblem">{meta[0]}</div>
          <p className="story-eyebrow">Nhật ký nhiệm vụ</p>
          <h2>{titleForConcept(question.concept_id)}</h2>
          <p>{meta[1]}</p>
          <div className="story-stat"><span>Checkpoint</span><strong>{questionIndex + 1}</strong></div>
          <div className="story-stat"><span>Phần thưởng</span><strong>{question.xp} XP</strong></div>
          <div className="story-stat"><span>Lần thử</span><strong>{save.attempts[question.id] ?? 0}</strong></div>
          <div className="story-stat"><span>Zone pass</span><strong>{correctInZone}/{passMark}</strong></div>
          <div className="story-stat"><span>Streak</span><strong>{save.streak}</strong></div>
          <div className="story-guide"><img src={odysseyOwl} alt="Mascot mentor" /><p>“{mentorLine(result, hintUsed, question.context)}”</p></div>
        </aside>

        <main className="feature-panel story-card">
          <div className="story-card-head">
            <span className="story-tag">Question {questionIndex + 1}</span>
            <span className="story-tag">{question.id}</span>
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
                    ___{index + 1}___
                    <input value={codeAnswers[index] ?? ""} onChange={(event) => {
                      const next = [...codeAnswers];
                      next[index] = event.target.value;
                      setCodeAnswers(next);
                    }} disabled={Boolean(result)} />
                  </label>
                ))}
              </div>
              <ul className="story-visible-tests">{question.visible_tests?.map((test) => <li key={test}>{test}</li>)}</ul>
            </>
          )}

          {hintUsed && <p className="story-hint">Gợi ý: {question.hint ?? question.hints?.[0]}</p>}
          {error && <p className="alert">{error}</p>}

          {result && (
            <div className={`story-result ${result.correct ? "success" : "danger"}`}>
              {result.correct ? <b className="story-xp-pop">+{result.xp}{save.streak > 0 && save.streak % 3 === 0 ? " +5" : ""} XP</b> : null}
              <strong>{result.correct ? `Đúng · +${result.xp} XP${save.streak > 0 && save.streak % 3 === 0 ? " · streak +5 XP" : ""}` : "Chưa đúng · đã lưu câu sai"}</strong>
              <p>{result.feedback}</p>
              <p>{result.next_action}</p>
            </div>
          )}

          <div className="button-row story-actions">
            {!result ? (
              <>
                <button className="secondary-button" onClick={() => setHintUsed(true)}>Nhận gợi ý</button>
                {question.type === "quiz" && confidence.map(([value, label]) => (
                  <button key={value} className={selfConfidence === value ? "secondary-button active" : "secondary-button"} onClick={() => setSelfConfidence(value)}>{label}</button>
                ))}
                <button className="primary-button" onClick={() => void submit()} disabled={!ready || loading}>{loading ? "Đang chấm…" : "Xác nhận"}</button>
              </>
            ) : (
              <>
                <button className="primary-button" onClick={nextQuestion}>{questionIndex === zone.questions.length - 1 ? "Xem kết quả vòng" : result.correct ? "Tiếp tục" : "Tiếp tục; câu sai đã lưu"}</button>
                {!result.correct && <button className="secondary-button" onClick={resetQuestion}>Thử lại ngay</button>}
              </>
            )}
          </div>
        </main>

        <aside className="story-recovery-panel">
          <h3>Error Dungeon</h3>
          {save.recoveries.length ? save.recoveries.map((item) => (
            <button key={item.question_id} onClick={() => openRecovery(item)}>
              <strong>{titleForConcept(item.concept_id)}</strong>
              <em>{item.priority === "high" ? "Ưu tiên cao" : "Cần ôn lại"}</em>
              <span>{item.feedback}</span>
            </button>
          )) : <p>Chưa có câu sai nào.</p>}
        </aside>
      </div>
    </section>
  );
}
