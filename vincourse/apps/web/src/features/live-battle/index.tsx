import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Clock3,
  LockKeyhole,
  Radio,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Users
} from "lucide-react";

import { getModeSession, submitMode } from "../../api/modes";
import type { GameResult, GameSession } from "../../types/game";
import "./styles.css";

export const featureName = "Live Class Battle";

type LiveOption = {
  id: string;
  text: string;
};

type LivePayload = {
  room_code: string;
  team: string;
  joined_count: number;
  submitted_count: number;
  phase: string;
  question_id: string;
  requires_reasoning: boolean;
  min_reasoning_length: number;
  options: LiveOption[];
  distribution: Record<string, number>;
  scoring: {
    correctness: number;
    explanation?: number;
  };
  demo: boolean;
};

type StudentStage = "join" | "waiting" | "answering" | "submitted" | "result";
type InstructorStage = "setup" | "lobby" | "monitor" | "locked" | "reveal" | "summary";
type Role = "student" | "instructor";

type Props = {
  onCompleted?: () => void;
};

const STUDENT_STAGES = ["Tham gia", "Phòng chờ", "Trả lời", "Kết quả"];
const INSTRUCTOR_STAGES = ["Thiết lập", "Phòng chờ", "Theo dõi", "Khóa", "Công bố", "Tổng kết"];

function parsePayload(session: GameSession): LivePayload {
  const payload = session.payload as Partial<LivePayload>;
  return {
    room_code: String(payload.room_code ?? "VINC-24"),
    team: String(payload.team ?? "Team Gradient"),
    joined_count: Number(payload.joined_count ?? 18),
    submitted_count: Number(payload.submitted_count ?? 9),
    phase: String(payload.phase ?? "answering"),
    question_id: String(payload.question_id ?? "live-feature-scaling-01"),
    requires_reasoning: payload.requires_reasoning !== false,
    min_reasoning_length: Number(payload.min_reasoning_length ?? 20),
    options: Array.isArray(payload.options) ? payload.options : [],
    distribution: payload.distribution ?? {},
    scoring: payload.scoring ?? (
      payload.requires_reasoning === false
        ? { correctness: 100 }
        : { correctness: 50, explanation: 50 }
    ),
    demo: payload.demo !== false
  };
}

function StageRail({ labels, active }: { labels: string[]; active: number }) {
  return (
    <div className="live-stage-rail" aria-label="Tiến trình">
      {labels.map((label, index) => (
        <div className={`live-stage ${index < active ? "is-done" : ""} ${index === active ? "is-active" : ""}`} key={label}>
          <span>{index < active ? <Check size={13} /> : index + 1}</span>
          <small>{label}</small>
        </div>
      ))}
    </div>
  );
}

function DemoNotice() {
  return (
    <div className="live-demo-notice">
      <Radio size={15} />
      <strong>Phiên live mô phỏng</strong>
      <span>Dữ liệu lớp được giữ local, chưa dùng WebSocket.</span>
    </div>
  );
}

function ScoreRules({ payload }: { payload: LivePayload }) {
  const rules: Array<[number, string, string]> = [
    [payload.scoring.correctness, "Độ chính xác", "Chọn đúng chẩn đoán"]
  ];
  if (payload.requires_reasoning && payload.scoring.explanation !== undefined) {
    rules.push([payload.scoring.explanation, "Lập luận", "Giải thích rõ cơ chế"]);
  }
  return (
    <div className="live-score-rules">
      {rules.map(([score, title, detail]) => (
        <div key={String(title)}>
          <strong>{score}</strong>
          <span>{title}</span>
          <small>{detail}</small>
        </div>
      ))}
      <div>
        <strong>—</strong>
        <span>Mức tự tin</span>
        <small>Chỉ ghi nhận, chưa tính điểm</small>
      </div>
    </div>
  );
}

function ResultPanel({ result, onReplay }: { result: GameResult; onReplay: () => void }) {
  const isSuccess = result.status === "mastered";
  const isPartial = result.status === "partial";
  const isReplay = result.payload.replay === true;
  return (
    <section className={`live-result-card live-result-${result.status}`}>
      <div className="live-result-icon">{isSuccess ? <Check /> : isPartial ? <Sparkles /> : <ShieldAlert />}</div>
      <div>
        <p className="live-kicker">
          {isReplay ? "Kết quả chơi lại" : isSuccess ? "Đội đã ghi điểm" : isPartial ? "Đúng nhưng cần nói rõ hơn" : "Đã tạo nhiệm vụ khắc phục"}
        </p>
        <h3>{result.feedback}</h3>
        <div className="live-result-metrics">
          <span>+{result.xp} XP</span>
          <span>Mastery +{result.mastery_delta}</span>
          <span>{result.evidence_ids.join(", ")}</span>
        </div>
        <p>{result.next_action}</p>
        <button className="live-button live-button-secondary" onClick={onReplay}>
          <RotateCcw size={16} /> Chơi lại
        </button>
      </div>
    </section>
  );
}

export function LiveBattleFeature({ onCompleted }: Props) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [role, setRole] = useState<Role>("student");
  const [studentStage, setStudentStage] = useState<StudentStage>("join");
  const [instructorStage, setInstructorStage] = useState<InstructorStage>("setup");
  const [roomCode, setRoomCode] = useState("VINC-24");
  const [joinError, setJoinError] = useState("");
  const [answer, setAnswer] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [confidence, setConfidence] = useState(3);
  const [result, setResult] = useState<GameResult | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadSession() {
    setLoading(true);
    setError("");
    try {
      const nextSession = await getModeSession("live_battle");
      setSession(nextSession);
      setRoomCode(String(nextSession.payload.room_code ?? "VINC-24"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được phiên Live Battle.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSession();
  }, []);

  if (loading) {
    return <section className="live-battle live-loading">Đang kết nối phòng thi đấu...</section>;
  }

  if (!session) {
    return (
      <section className="live-battle live-error">
        <ShieldAlert />
        <h2>Không tải được Live Battle</h2>
        <p>{error}</p>
        <button className="live-button live-button-primary" onClick={() => void loadSession()}>Thử lại</button>
      </section>
    );
  }

  const activeSession = session;
  const payload = parsePayload(activeSession);
  const selectedOption = payload.options.find((option) => option.id === answer);
  const reasoningValid = (
    !payload.requires_reasoning
    || reasoning.trim().length >= payload.min_reasoning_length
  );
  const canSubmit = Boolean(answer && reasoningValid && confidence);

  function resetStudent() {
    setStudentStage("join");
    setAnswer("");
    setReasoning("");
    setConfidence(3);
    setResult(null);
    setJoinError("");
  }

  function joinRoom() {
    if (roomCode.trim().toUpperCase() !== payload.room_code) {
      setJoinError(`Không tìm thấy phòng "${roomCode || "trống"}". Dùng mã ${payload.room_code}.`);
      return;
    }
    setJoinError("");
    setStudentStage("waiting");
  }

  async function submitAnswer() {
    if (!canSubmit) return;
    setStudentStage("submitted");
    setSubmitting(true);
    setError("");
    try {
      const nextResult = await submitMode("live_battle", {
        user_id: "demo-user",
        course_id: "ml-foundations",
        session_id: activeSession.session_id,
        question_id: payload.question_id,
        answer: JSON.stringify({
          option_id: answer,
          reasoning: reasoning.trim(),
          room_code: payload.room_code
        }),
        confidence
      });
      setResult(nextResult);
      setStudentStage("result");
      onCompleted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không gửi được câu trả lời.");
      setStudentStage("answering");
    } finally {
      setSubmitting(false);
    }
  }

  function renderStudent() {
    if (studentStage === "join") {
      return (
        <div className="live-two-column">
          <section className="live-card live-room-card">
            <span className="live-pill live-pill-success">Đang diễn ra</span>
            <h3>ML Foundations · Team Battle</h3>
            <p>{payload.joined_count} học viên đang chờ cùng giải cứu Broken Model.</p>
            <label htmlFor="live-room-code">Mã lớp</label>
            <input
              id="live-room-code"
              value={roomCode}
              onChange={(event) => {
                setRoomCode(event.target.value);
                setJoinError("");
              }}
            />
            <small>Mã demo: {payload.room_code}</small>
            {joinError && <p className="live-inline-error">{joinError}</p>}
            <button className="live-button live-button-primary" onClick={joinRoom}>
              Tham gia trận đấu <ArrowRight size={16} />
            </button>
          </section>
          <section className="live-card">
            <p className="live-kicker">Cách tính điểm</p>
            <h3>Không chỉ chọn đúng</h3>
            <ScoreRules payload={payload} />
          </section>
        </div>
      );
    }

    if (studentStage === "waiting") {
      return (
        <div className="live-two-column">
          <section className="live-card live-waiting-card">
            <div className="live-countdown"><Clock3 size={18} /><strong>03</strong><span>giây</span></div>
            <div>
              <span className="live-pill live-pill-success">Đã xếp đội</span>
              <h3>{payload.team}</h3>
              <p>Bạn sẽ cùng ba thành viên khác bước vào pha chẩn đoán.</p>
              <button className="live-button live-button-primary" onClick={() => setStudentStage("answering")}>
                Bắt đầu thử thách <ArrowRight size={16} />
              </button>
            </div>
          </section>
          <aside className="live-card live-team-list">
            <p className="live-kicker">Phòng {payload.room_code}</p>
            <h3>{payload.joined_count} người · 4 đội</h3>
            {["Bạn", "Huy Nguyen", "Mai Anh", "Thanh Khoa"].map((name, index) => (
              <div key={name}><span>{index === 0 ? "LM" : ["HN", "MA", "TK"][index - 1]}</span><strong>{name}</strong><small>Sẵn sàng</small></div>
            ))}
          </aside>
        </div>
      );
    }

    if (studentStage === "answering") {
      return (
        <div className="live-game-layout">
          <section className="live-card live-challenge">
            <div className="live-challenge-meta">
              <span className="live-pill">Pha 2/4 · Chẩn đoán</span>
              <span><Clock3 size={14} /> 01:24</span>
            </div>
            <h3>{activeSession.prompt}</h3>
            <div className="live-options">
              {payload.options.map((option) => (
                <button className={answer === option.id ? "is-selected" : ""} key={option.id} onClick={() => setAnswer(option.id)}>
                  <span>{option.id}</span>{option.text}
                </button>
              ))}
            </div>
            {payload.requires_reasoning && (
              <>
                <label htmlFor="live-reasoning">Giải thích lập luận cho đội</label>
                <textarea
                  id="live-reasoning"
                  value={reasoning}
                  onChange={(event) => setReasoning(event.target.value)}
                  placeholder="Vì sao đây là hành động nên thử đầu tiên?"
                />
                <small>
                  Tối thiểu {payload.min_reasoning_length} ký tự. Lập luận sai vẫn được ghi nhận để tạo recovery.
                </small>
              </>
            )}
            <div className="live-confidence">
              <strong>Mức tự tin</strong>
              {[1, 2, 3, 4, 5].map((value) => (
                <button className={confidence === value ? "is-selected" : ""} key={value} onClick={() => setConfidence(value)}>{value}</button>
              ))}
            </div>
            {error && <p className="live-inline-error">{error}</p>}
            <button className="live-button live-button-primary" disabled={!canSubmit || submitting} onClick={() => void submitAnswer()}>
              {submitting ? "Đang gửi..." : `Gửi cho ${payload.team}`} <ArrowRight size={16} />
            </button>
          </section>
          <aside className="live-card live-rail">
            <p className="live-kicker">Trạng thái lớp</p>
            <h3>{payload.submitted_count}/{payload.joined_count} đã trả lời</h3>
            <div className="live-progress"><span style={{ width: `${payload.submitted_count / payload.joined_count * 100}%` }} /></div>
            <ScoreRules payload={payload} />
          </aside>
        </div>
      );
    }

    if (studentStage === "submitted" && !result) {
      return (
        <section className="live-card live-submitted">
          <div className="live-result-icon"><LockKeyhole /></div>
          <p className="live-kicker">Đã khóa câu trả lời</p>
          <h3>{selectedOption?.text}</h3>
          <p>Hệ thống đang tổng hợp lập luận của {payload.team}.</p>
          <div className="live-progress"><span style={{ width: "78%" }} /></div>
        </section>
      );
    }

    return result ? <ResultPanel result={result} onReplay={resetStudent} /> : null;
  }

  function renderInstructor() {
    const distributionTotal = Object.values(payload.distribution).reduce((total, value) => total + value, 0) || 1;

    if (instructorStage === "setup") {
      return (
        <div className="live-two-column">
          <section className="live-card live-setup">
            <p className="live-kicker">Tạo phiên thi đấu</p>
            <h3>Rescue the Broken Model</h3>
            <div className="live-form-grid">
              <label>Khóa học<select><option>ML Foundations</option></select></label>
              <label>Chế độ đội<select><option>Đội nhỏ</option><option>Cá nhân</option><option>Cả lớp</option></select></label>
              <label>Thời gian<select><option>90 giây</option><option>60 giây</option></select></label>
            </div>
            <ScoreRules payload={payload} />
            <button className="live-button live-button-primary" onClick={() => setInstructorStage("lobby")}>Tạo phòng</button>
          </section>
          <section className="live-card live-local-note">
            <Radio />
            <h3>Điều khiển local</h3>
            <p>Join count, timer, biểu đồ và misconception là dữ liệu mô phỏng trong hackathon.</p>
          </section>
        </div>
      );
    }

    if (instructorStage === "lobby") {
      return (
        <div className="live-two-column">
          <section className="live-card live-code-card">
            <span>Mã lớp</span><strong>{payload.room_code}</strong>
            <small>{payload.joined_count} học viên · 4 đội đã sẵn sàng</small>
            <button className="live-button live-button-primary" onClick={() => setInstructorStage("monitor")}>Bắt đầu câu hỏi</button>
          </section>
          <section className="live-card live-team-list">
            {["Team Gradient", "Data Sparks", "Vector Crew", "Loss Hunters"].map((team, index) => (
              <div key={team}><span>{index + 1}</span><strong>{team}</strong><small>Sẵn sàng</small></div>
            ))}
          </section>
        </div>
      );
    }

    if (instructorStage === "summary") {
      return (
        <section className="live-result-card live-result-mastered">
          <div className="live-result-icon"><Check /></div>
          <div>
            <p className="live-kicker">Tổng kết lớp</p>
            <h3>Cả lớp đã đánh bại Broken Model</h3>
            <p>43% ban đầu tin rằng tăng epoch sẽ sửa huấn luyện bất ổn. Hãy giao recovery về Feature Scaling.</p>
            <div className="live-result-metrics"><span>18 học viên</span><span>4 đội</span><span>1 misconception</span></div>
            <button className="live-button live-button-secondary" onClick={() => setInstructorStage("setup")}><RotateCcw size={16} /> Tạo trận khác</button>
          </div>
        </section>
      );
    }

    const locked = instructorStage === "locked" || instructorStage === "reveal";
    const revealed = instructorStage === "reveal";
    return (
      <div className="live-game-layout">
        <section className="live-card live-monitor">
          <div className="live-challenge-meta">
            <span className={`live-pill ${locked ? "live-pill-warning" : "live-pill-danger"}`}>{locked ? "Đã khóa đáp án" : "Phát hiện misconception"}</span>
            <span>{locked ? payload.joined_count : payload.submitted_count}/{payload.joined_count} phản hồi</span>
          </div>
          <h3>{activeSession.prompt}</h3>
          <div className="live-bars">
            {payload.options.map((option) => {
              const count = payload.distribution[option.id] ?? 0;
              return (
                <div key={option.id}>
                  <span style={{ height: `${Math.max(12, count / distributionTotal * 100)}%` }} />
                  <strong>{Math.round(count / distributionTotal * 100)}%</strong>
                  <small>{option.id}</small>
                </div>
              );
            })}
          </div>
          {hintVisible && <div className="live-hint"><strong>Gợi ý đã gửi:</strong> So sánh đóng góp của từng feature vào một bước gradient.</div>}
          {revealed && <div className="live-reveal"><strong>Đáp án B · Scale the features</strong><p>Đưa feature về miền tương đương giúp cập nhật gradient cân bằng hơn.</p></div>}
          <div className="live-action-row">
            <button className="live-button live-button-secondary" disabled={hintVisible || revealed} onClick={() => setHintVisible(true)}>Công bố gợi ý</button>
            <button className="live-button live-button-secondary" disabled={locked} onClick={() => setInstructorStage("locked")}><LockKeyhole size={15} /> Khóa đáp án</button>
            <button className="live-button live-button-primary" disabled={!locked || revealed} onClick={() => setInstructorStage("reveal")}>Hiện giải thích</button>
            {revealed && <button className="live-button live-button-primary" onClick={() => setInstructorStage("summary")}>Tổng kết lớp</button>}
          </div>
        </section>
        <aside className="live-card live-rail">
          <p className="live-kicker">Misconception stream</p>
          <div className="live-misconception"><ShieldAlert size={17} /><div><strong>Tăng epoch sửa bất ổn</strong><small>6 học viên · đang tăng</small></div></div>
          <div className="live-misconception"><ShieldAlert size={17} /><div><strong>Learning rate cao luôn nhanh hơn</strong><small>2 học viên</small></div></div>
          <p className="live-kicker live-ranking-title">Xếp hạng đội</p>
          {["Team Gradient · 820", "Data Sparks · 760", "Vector Crew · 710"].map((team, index) => <p className="live-rank" key={team}><span>{index + 1}</span>{team}</p>)}
        </aside>
      </div>
    );
  }

  const studentActive = studentStage === "join" ? 0 : studentStage === "waiting" ? 1 : studentStage === "result" ? 3 : 2;
  const instructorActive = INSTRUCTOR_STAGES.findIndex((_, index) => index === ({
    setup: 0,
    lobby: 1,
    monitor: 2,
    locked: 3,
    reveal: 4,
    summary: 5
  })[instructorStage]);

  return (
    <section className="live-battle">
      <header className="live-header">
        <div>
          <p className="live-kicker">Mode 6 · Cộng tác</p>
          <h2>Live Class Battle</h2>
          <p>Kahoot theo lớp, nhưng chấm cả lập luận và độ tự tin.</p>
        </div>
        <div className="live-role-switch" aria-label="Chọn vai trò">
          <button className={role === "student" ? "is-active" : ""} onClick={() => setRole("student")}><Users size={15} /> Học viên</button>
          <button className={role === "instructor" ? "is-active" : ""} onClick={() => setRole("instructor")}><Sparkles size={15} /> Giảng viên</button>
        </div>
      </header>
      <DemoNotice />
      <StageRail labels={role === "student" ? STUDENT_STAGES : INSTRUCTOR_STAGES} active={role === "student" ? studentActive : instructorActive} />
      {role === "student" ? renderStudent() : renderInstructor()}
    </section>
  );
}
