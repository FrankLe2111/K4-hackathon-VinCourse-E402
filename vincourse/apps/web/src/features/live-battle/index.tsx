import { useEffect, useState } from "react";
import "./live-battle.css";

type Stage = "join" | "lobby" | "countdown" | "play" | "feedback" | "result";
type Answer = { id: string; text: string };
type Question = { prompt: string; correct: string; answers: Answer[] };

const room = "VINC-24";
const secondsPerQuestion = 15;
const questions: Question[] = [
  {
    prompt: "Model không hội tụ dù tăng số epoch. Hành động đầu tiên hợp lý nhất là gì?",
    correct: "B",
    answers: [
      { id: "A", text: "Tăng epoch để mô hình học lâu hơn." },
      { id: "B", text: "Chuẩn hóa feature trước khi train lại." },
      { id: "C", text: "Xóa validation set để thêm dữ liệu train." },
      { id: "D", text: "Đổi tên cột để giảm bias." },
    ],
  },
  {
    prompt: "Cách dùng AI nào khác tự động hóa thông thường nhất?",
    correct: "C",
    answers: [
      { id: "A", text: "Luôn chạy đúng một chuỗi lệnh cố định." },
      { id: "B", text: "Chỉ copy dữ liệu từ ô này sang ô khác." },
      { id: "C", text: "Suy luận từ dữ liệu mới và tạo dự đoán/đề xuất." },
      { id: "D", text: "Bấm nút gửi email theo lịch." },
    ],
  },
  {
    prompt: "Khi AI trả lời rất tự tin nhưng không nêu nguồn, bước tốt nhất là gì?",
    correct: "D",
    answers: [
      { id: "A", text: "Tin vì câu trả lời nghe chắc chắn." },
      { id: "B", text: "Yêu cầu AI viết lại tự tin hơn." },
      { id: "C", text: "Bỏ qua toàn bộ câu trả lời." },
      { id: "D", text: "Yêu cầu nguồn và kiểm chứng tuyên bố chính." },
    ],
  },
];

const classmates = [
  ["Minh", 2310],
  ["Huyen", 2050],
  ["Duc", 1720],
  ["Phuoc", 1440],
] as const;

export function LiveBattle({ onCompleted }: { onCompleted: () => void }) {
  const [stage, setStage] = useState<Stage>("join");
  const [code, setCode] = useState(room);
  const [name, setName] = useState("Linh");
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(secondsPerQuestion);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lastPoints, setLastPoints] = useState(0);
  const [error, setError] = useState("");
  const question = questions[index];
  const correct = selected === question.correct;

  useEffect(() => {
    if (stage !== "play") return;
    if (timeLeft <= 0) {
      lockAnswer("");
      return;
    }
    const timer = window.setTimeout(() => setTimeLeft((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [stage, timeLeft]);

  function join() {
    if (code.trim().toUpperCase() !== room) {
      setError(`Room ${code || "—"} chưa mở. Demo dùng ${room}.`);
      return;
    }
    setError("");
    setStage("lobby");
  }

  function startRound() {
    setIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    startQuestion(0);
  }

  function startQuestion(nextIndex: number) {
    setIndex(nextIndex);
    setSelected("");
    setLastPoints(0);
    setTimeLeft(secondsPerQuestion);
    setStage("countdown");
    window.setTimeout(() => setStage("play"), 700);
  }

  function lockAnswer(answerId: string) {
    if (stage !== "play") return;
    const isCorrect = answerId === question.correct;
    const nextStreak = isCorrect ? streak + 1 : 0;
    const speedPoints = isCorrect ? Math.max(250, Math.round(1000 * (timeLeft / secondsPerQuestion))) : 0;
    const streakBonus = isCorrect && nextStreak >= 2 ? nextStreak * 100 : 0;
    const points = speedPoints + streakBonus;
    setSelected(answerId);
    setLastPoints(points);
    setScore((current) => current + points);
    setStreak(nextStreak);
    setBestStreak((current) => Math.max(current, nextStreak));
    setStage("feedback");
    if (index === questions.length - 1) onCompleted();
  }

  function nextQuestion() {
    if (index === questions.length - 1) {
      setStage("result");
      return;
    }
    startQuestion(index + 1);
  }

  if (stage === "join") {
    return (
      <section className="live-shell live-kahoot">
        <div className="live-hero">
          <p className="live-eyebrow">Live Class Battle · Kahoot style</p>
          <h2>Vào phòng. Trả lời nhanh. Giữ streak.</h2>
          <p>Mỗi học viên tham gia độc lập. Điểm giảm dần theo thời gian, trả lời đúng liên tiếp sẽ có bonus.</p>
        </div>
        <div className="live-grid">
          <section className="live-card">
            <h3>Join class battle</h3>
            <label className="live-field">Tên người chơi<input value={name} onChange={(event) => setName(event.target.value)} /></label>
            <label className="live-field">Class code<input value={code} onChange={(event) => setCode(event.target.value)} /></label>
            {error ? <p className="live-error">{error}</p> : <small>Demo code: {room}</small>}
            <div className="button-row">
              <button className="primary-button" onClick={join}>Join battle</button>
              <button className="secondary-button" onClick={() => setCode(room)}>Use demo code</button>
            </div>
          </section>
          <section className="live-card">
            <h3>Scoring</h3>
            <div className="live-score-grid">
              <Score label="Fast correct" score={1000} />
              <Score label="Minimum correct" score={250} />
              <Score label="Streak bonus" score={200} />
            </div>
          </section>
        </div>
      </section>
    );
  }

  if (stage === "lobby") {
    return (
      <section className="live-shell">
        <section className="live-card live-waiting">
          <div className="live-countdown"><span>Room</span><strong>{room}</strong></div>
          <div>
            <p className="live-eyebrow">Lobby</p>
            <h2>{name || "Player"} đã vào phòng</h2>
            <p>18 learners online · battle gồm {questions.length} câu hỏi · trả lời càng nhanh điểm càng cao.</p>
            <button className="primary-button" onClick={startRound}>Start battle</button>
          </div>
        </section>
        <Leaderboard name={name} score={score} />
      </section>
    );
  }

  if (stage === "countdown") {
    return <section className="live-shell"><section className="live-card live-countdown-screen"><strong>{index + 1}</strong><h2>Question incoming…</h2></section></section>;
  }

  if (stage === "play") {
    const percent = Math.round((timeLeft / secondsPerQuestion) * 100);
    return (
      <section className="live-shell live-kahoot">
        <div className="live-topline">
          <strong>Question {index + 1}/{questions.length}</strong>
          <span>{score} pts</span>
          <span>🔥 streak {streak}</span>
        </div>
        <div className="live-timer"><span style={{ width: `${percent}%` }} /></div>
        <section className="live-card live-question">
          <div className="live-clock">{timeLeft}</div>
          <h2>{question.prompt}</h2>
          <div className="live-answer-list">
            {question.answers.map((answerItem) => (
              <button key={answerItem.id} className={`answer-${answerItem.id.toLowerCase()}`} onClick={() => lockAnswer(answerItem.id)}>
                <span>{answerItem.id}</span>{answerItem.text}
              </button>
            ))}
          </div>
        </section>
      </section>
    );
  }

  if (stage === "feedback") {
    return (
      <section className="live-shell">
        <section className={`live-card live-result ${correct ? "success" : "danger"}`}>
          <div className="live-badge">{correct ? "✓" : "!"}</div>
          <div>
            <p className="live-eyebrow">{correct ? "Correct" : selected ? "Not quite" : "Time up"}</p>
            <h2>{correct ? `+${lastPoints} điểm` : "0 điểm · câu này vào recovery"}</h2>
            <p>Đáp án đúng: {question.correct}. {correct ? `Streak hiện tại: ${streak}.` : "Đừng lo, sai là tín hiệu để ôn đúng chỗ."}</p>
          </div>
        </section>
        <Leaderboard name={name} score={score} />
        <button className="primary-button" onClick={nextQuestion}>{index === questions.length - 1 ? "Xem bảng xếp hạng" : "Câu tiếp theo"}</button>
      </section>
    );
  }

  return (
    <section className="live-shell">
      <section className="live-card live-result success">
        <div className="live-badge">🏆</div>
        <div>
          <p className="live-eyebrow">Battle complete</p>
          <h2>{name || "Player"} đạt {score} điểm</h2>
          <p>Best streak: {bestStreak}. Trả lời nhanh + giữ streak là chìa khóa thắng lớp.</p>
        </div>
      </section>
      <Leaderboard name={name} score={score} />
      <button className="secondary-button" onClick={() => setStage("join")}>Replay battle</button>
    </section>
  );
}

function Score({ label, score }: { label: string; score: number }) {
  return <div className="live-score"><strong>{score}</strong><span>{label}</span></div>;
}

function Leaderboard({ name, score }: { name: string; score: number }) {
  const rows = [...classmates, [name || "You", score] as const].sort((left, right) => right[1] - left[1]);
  return <section className="live-card"><h3>Live leaderboard</h3><div className="live-leaderboard">{rows.map(([player, points], index) => <div key={player} className={player === (name || "You") ? "me" : ""}><strong>#{index + 1}</strong><span>{player}</span><b>{points} pts</b></div>)}</div></section>;
}
