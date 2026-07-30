import { useState } from "react";
import "./live-battle.css";

type Stage = "join" | "waiting" | "play" | "submitted" | "result";

const room = "VINC-24";
const challenge = {
  title: "Boss: Gradient Divergence",
  prompt: "Model không hội tụ dù tăng số epoch. Hành động đầu tiên hợp lý nhất là gì?",
  correct: "B",
  choices: [
    ["A", "Tăng epoch để mô hình có thêm thời gian học."],
    ["B", "Chuẩn hóa feature trước khi train lại."],
    ["C", "Xóa validation set để có thêm dữ liệu train."],
    ["D", "Đổi tên cột để mô hình bớt bias."],
  ],
};

export function LiveBattle({ onCompleted }: { onCompleted: () => void }) {
  const [stage, setStage] = useState<Stage>("join");
  const [code, setCode] = useState(room);
  const [answer, setAnswer] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [confidence, setConfidence] = useState("");
  const [error, setError] = useState("");
  const ready = Boolean(answer && confidence && reasoning.trim().length >= 20);

  function join() {
    if (code.trim().toUpperCase() !== room) {
      setError(`Room ${code || "—"} chưa mở. Demo dùng ${room}.`);
      return;
    }
    setError("");
    setStage("waiting");
  }

  function submit() {
    if (!ready) return;
    setStage("submitted");
    onCompleted();
  }

  if (stage === "join") {
    return (
      <section className="live-shell">
        <div className="live-hero">
          <p className="live-eyebrow">Live Class Battle · Simulated demo</p>
          <h2>Cả lớp cùng đánh boss kiến thức.</h2>
          <p>Vào phòng, trả lời theo team, giải thích lý do và nhận điểm từ độ đúng, chất lượng lập luận, calibration.</p>
        </div>
        <div className="live-grid">
          <section className="live-card">
            <h3>Join room</h3>
            <label className="live-field">Class code<input value={code} onChange={(event) => setCode(event.target.value)} /></label>
            {error ? <p className="live-error">{error}</p> : <small>Demo code: {room}</small>}
            <div className="button-row">
              <button className="primary-button" onClick={join}>Join battle</button>
              <button className="secondary-button" onClick={() => setCode(room)}>Use demo code</button>
            </div>
          </section>
          <ScoringCard />
        </div>
      </section>
    );
  }

  if (stage === "waiting") {
    return (
      <section className="live-shell">
        <StageStrip stage={stage} />
        <section className="live-card live-waiting">
          <div className="live-countdown"><span>Starts in</span><strong>03</strong></div>
          <div><h2>Team Gradient đã sẵn sàng</h2><p>Giảng viên sẽ mở shared challenge khi các team đã vào phòng.</p><button className="primary-button" onClick={() => setStage("play")}>Start simulated challenge</button></div>
        </section>
      </section>
    );
  }

  if (stage === "play") {
    return (
      <section className="live-shell">
        <StageStrip stage={stage} />
        <section className="live-card">
          <p className="live-eyebrow">Room {room} · Team Gradient</p>
          <h2>{challenge.title}</h2>
          <p>{challenge.prompt}</p>
          <div className="live-answer-list">
            {challenge.choices.map(([id, text]) => (
              <button key={id} className={answer === id ? "selected" : ""} onClick={() => setAnswer(id)}>
                <span>{id}</span>{text}
              </button>
            ))}
          </div>
          <label className="live-field">Explain your reasoning<textarea value={reasoning} onChange={(event) => setReasoning(event.target.value)} placeholder="Vì sao đây là hành động tốt nhất cho team?" /></label>
          <div className="live-confidence">
            {["low", "medium", "high"].map((item) => <button key={item} className={confidence === item ? "active" : ""} onClick={() => setConfidence(item)}>{item}</button>)}
          </div>
          <button className="primary-button" disabled={!ready} onClick={submit}>Submit for Team Gradient</button>
        </section>
      </section>
    );
  }

  if (stage === "submitted") {
    return (
      <section className="live-shell">
        <StageStrip stage="play" />
        <section className="live-card live-submitted">
          <h2>Answer submitted</h2>
          <p>Câu trả lời đã khóa. Đang chờ giảng viên reveal kết quả toàn lớp.</p>
          <div className="live-progress"><span style={{ width: "78%" }} /></div>
          <button className="primary-button" onClick={() => setStage("result")}>Simulate instructor reveal</button>
        </section>
      </section>
    );
  }

  const correct = answer === challenge.correct;
  return (
    <section className="live-shell">
      <StageStrip stage="result" />
      <section className={`live-card live-result ${correct ? "success" : "danger"}`}>
        <div className="live-badge">{correct ? "✓" : "!"}</div>
        <div>
          <p className="live-eyebrow">{correct ? "Battle complete" : "Recovery queued"}</p>
          <h2>{correct ? "Team Gradient placed #1" : "Cả lớp thắng; misconception thành nhiệm vụ ôn"}</h2>
          <p>{correct ? "Bạn liên kết được feature scale với gradient stability." : "Đóng góp vẫn được ghi nhận, Feature Scaling được đưa vào recovery."}</p>
        </div>
      </section>
      <div className="live-grid">
        <Score label="Correctness" score={correct ? 40 : 0} />
        <Score label="Explanation" score={correct && reasoning.length > 30 ? 36 : 18} />
        <Score label="Calibration" score={correct ? 20 : confidence === "low" ? 14 : 8} />
      </div>
      <button className="secondary-button" onClick={() => {
        setStage("join");
        setAnswer("");
        setReasoning("");
        setConfidence("");
      }}>Replay student demo</button>
    </section>
  );
}

function StageStrip({ stage }: { stage: Stage }) {
  const stages: Stage[] = ["join", "waiting", "play", "result"];
  const active = stages.indexOf(stage === "submitted" ? "play" : stage);
  return <div className="live-stage-strip">{stages.map((item, index) => <span key={item} className={index < active ? "done" : index === active ? "active" : ""}>{index + 1}<small>{item}</small></span>)}</div>;
}

function ScoringCard() {
  return <section className="live-card"><h3>How your team scores</h3><div className="live-score-grid"><Score label="Correctness" score={40} /><Score label="Explanation" score={40} /><Score label="Calibration" score={20} /></div></section>;
}

function Score({ label, score }: { label: string; score: number }) {
  return <div className="live-score"><strong>{score}</strong><span>{label}</span></div>;
}
