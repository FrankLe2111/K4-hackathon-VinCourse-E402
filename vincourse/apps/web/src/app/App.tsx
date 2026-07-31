import { useEffect, useState } from "react";
import {
  ArrowLeft, BookOpen, BrainCircuit, Code2, Flame, GraduationCap, Home, Map, Play,
  RefreshCcw, RotateCcw, ShieldAlert, Sparkles, Swords, Trophy, User,
} from "lucide-react";
import { listModes, getProgress, resetProgress } from "../api/modes";
import type { GameMode, ModeInfo, ProgressSummary } from "../types/game";
import { FeatureHost } from "../shared/components/FeatureHost";
import odysseyOwl from "../assets/odyssey-owl.png";

const modeIcons = {
  story: BookOpen,
  daily_recall: BrainCircuit,
  error_dungeon: ShieldAlert,
  lab_arena: Code2,
  boss_battle: Trophy,
  live_battle: Swords,
  understanding: Sparkles,
} satisfies Record<GameMode, typeof BookOpen>;

const modeStatus: Record<GameMode, string> = {
  story: "Đề xuất",
  daily_recall: "5 ngày ôn",
  error_dungeon: "Cần sửa",
  lab_arena: "Sẵn sàng Bài 4",
  boss_battle: "Sẵn sàng",
  live_battle: "Đấu trực tiếp",
  understanding: "Nâng cao",
};

const modeActions: Record<GameMode, string> = {
  story: "Mở bản đồ",
  daily_recall: "Bắt đầu ôn",
  error_dungeon: "Sửa lỗi sai",
  lab_arena: "Vào lab",
  boss_battle: "Thách đấu",
  live_battle: "Vào phòng",
  understanding: "Đấu AI",
};

function DashboardSkeleton() {
  return (
    <div className="mode-grid-skeleton">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-header shimmer-box" />
          <div className="skeleton-icon shimmer-box" />
          <div className="skeleton-title shimmer-box" />
          <div className="skeleton-text shimmer-box" />
          <div className="skeleton-btn shimmer-box" />
        </div>
      ))}
    </div>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export type Route =
  | "understanding" | "home" | "map" | "modes" | "quest" | "feedback"
  | "recovery" | "result" | "recall" | "mastery" | "error-dungeon"
  | "lab" | "boss" | "live" | "ai-adversary"
  | "admin-dashboard" | "admin-upload" | "admin-generate" | "admin-world"
  | "admin-questions" | "admin-analytics";
export type Role = "learner" | "admin";

export function App() {
  const [modes, setModes] = useState<ModeInfo[]>([]);
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [route, setRoute] = useState<Route>("modes");
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [featureKey, setFeatureKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function reload() {
    setError("");
    try {
      const [modeData, progressData] = await Promise.all([listModes(), getProgress()]);
      setModes(modeData);
      setProgress(progressData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    if (!window.confirm("Xóa toàn bộ XP, tiến độ nhiệm vụ và hàng đợi ôn tập?")) return;
    setError("");
    try {
      const resetData = await resetProgress();
      localStorage.removeItem("vincourse-story-quest");
      setProgress(resetData);
      setFeatureKey((current) => current + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể đặt lại tiến độ.");
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  const activeMode = modes.find((mode) => mode.mode === selectedMode);
  const totalXp = progress?.xp ?? 0;
  const completedCount = progress?.completed_modes.length ?? 0;
  const recoveryCount = progress?.recovery_queue_size ?? 0;
  const streakDays = Math.max(1, Math.min(7, Math.floor(totalXp / 120) + completedCount + 1));
  const level = Math.floor(totalXp / 500) + 1;

  function navigate(nextRoute: Route) {
    setRoute(nextRoute);
    const modeByRoute: Partial<Record<Route, GameMode>> = {
      quest: "story",
      recall: "daily_recall",
      "error-dungeon": "error_dungeon",
      lab: "lab_arena",
      boss: "boss_battle",
      live: "live_battle",
      "ai-adversary": "understanding",
      understanding: "understanding",
    };
    setSelectedMode(modeByRoute[nextRoute] ?? null);
  }

  const pageCopy: Record<"home" | "map" | "modes", { eyebrow: string; title: string; text: string }> = {
    home: {
      eyebrow: "Trang chủ",
      title: "Sẵn sàng tiếp tục hành trình?",
      text: "Theo dõi tiến độ, chọn hoạt động tiếp theo và quay lại các thử thách đang mở.",
    },
    map: {
      eyebrow: "Bản đồ khóa học",
      title: "AI Odyssey",
      text: "Đi qua từng vùng học tập, mở khóa nhiệm vụ và củng cố các khái niệm trọng tâm.",
    },
    modes: {
      eyebrow: "Chọn thử thách của bạn",
      title: "Sáu cách xây dựng năng lực",
      text: "Mỗi chế độ thu thập một loại minh chứng khác nhau: ghi nhớ, thực hành code, sửa lỗi sai và thi đấu cùng lớp.",
    },
  };
  const currentPage = route === "home" || route === "map" ? route : "modes";

  if (!selectedMode) {
    return (
      <main className="mode-select-page">
        <aside className="mode-rail">
          <div className="brand">
            <span className="brand-mark brand-v" aria-hidden="true">
              <GraduationCap size={24} />
            </span>
            <div><strong>VinCourse</strong><span>Học viên khám phá</span></div>
          </div>
          <p className="nav-label">Học tập</p>
          <nav className="rail-list" aria-label="Điều hướng chính">
            <button type="button" className={route === "home" ? "active" : ""} onClick={() => navigate("home")}><Home size={16} />Trang chủ</button>
            <button type="button" className={route === "map" ? "active" : ""} onClick={() => navigate("map")}><Map size={16} />Bản đồ khóa học</button>
            <button type="button" className={route === "modes" ? "active" : ""} onClick={() => navigate("modes")}><Sparkles size={16} />Chế độ chơi <b>{modes.length || 6}</b></button>
            <button type="button" onClick={() => navigate("recall")}><BrainCircuit size={16} />Ôn tập hằng ngày <b>5</b></button>
          </nav>
          <p className="nav-label">Khắc phục</p>
          <nav className="rail-list" aria-label="Khắc phục">
            <button type="button" onClick={() => navigate("error-dungeon")}><ShieldAlert size={16} />Hầm ngục lỗi sai <b>{recoveryCount}</b></button>
          </nav>
          <div className="rail-profile">
            <span className="avatar">LM</span>
            <span><strong>Linh Minh</strong><small>Level {level} explorer</small></span>
          </div>
        </aside>

        <section className="mode-select-panel">
          <div className="mode-dashboard-top">
            <div>
              <strong><span /> Nền tảng Học máy</strong>
              <small>Chế độ chơi</small>
            </div>
            <div className="dashboard-chips">
              <span className="language-chip"><b>VI</b><small>EN</small></span>
              <span><Flame size={16} />{streakDays} ngày liên tiếp</span>
              <span><Sparkles size={16} />{formatNumber(totalXp)} XP</span>
              <button className="icon-button chip-icon-button" onClick={() => void reload()} aria-label="Tải lại dữ liệu" title="Tải lại dữ liệu">
                <RefreshCcw size={18} />
              </button>
              <span className="avatar mint-avatar chip-avatar">LM</span>
            </div>
          </div>

          <div className="mode-select-hero">
            <div>
              <p>{pageCopy[currentPage].eyebrow}</p>
              <h1>{pageCopy[currentPage].title}</h1>
              <span>{pageCopy[currentPage].text}</span>
            </div>
            <img src={odysseyOwl} alt="Mascot cú VinCourse" />
          </div>

          {error && <div className="alert app-alert">{error}<button onClick={() => void reload()}>Thử lại</button></div>}

          <div className="mode-grid" aria-label="Chọn chế độ học">
            {loading ? <DashboardSkeleton /> : modes.map((mode) => {
              const Icon = modeIcons[mode.mode];
              const done = progress?.completed_modes.includes(mode.mode);
              return (
                <button key={mode.mode} className={`mode-card tone-${mode.mode}`} onClick={() => setSelectedMode(mode.mode)}>
                  <span className="mode-status">{done ? "Đã hoàn tất" : modeStatus[mode.mode]}</span>
                  <span className="mode-card-icon"><Icon size={24} /></span>
                  <span className="mode-card-copy">
                    <strong>{mode.title}</strong>
                    <small>{mode.description}</small>
                    <em>{modeActions[mode.mode]}</em>
                  </span>
                  <span className="mode-card-action">{done ? "✓" : <Play size={18} />}</span>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell game-shell">
      <main className="workspace">
        <header className="topbar">
          <div className="topbar-title">
            <img src={odysseyOwl} alt="Mascot cú VinCourse" />
            <div>
            <p>AI Learning Adventure</p>
            <h1>{activeMode?.title ?? "Sẵn sàng cho nhiệm vụ mới?"}</h1>
            </div>
          </div>
          <div className="topbar-actions">
            <button className="ghost-button" onClick={() => navigate("modes")}>
              <ArrowLeft size={16} /><span>Chọn mode</span>
            </button>
            <button className="ghost-button danger-button" onClick={() => void handleReset()} title="Xóa toàn bộ tiến độ">
              <RotateCcw size={16} /><span>Đặt lại</span>
            </button>
            <button className="icon-button" onClick={() => void reload()} aria-label="Tải lại dữ liệu" title="Tải lại dữ liệu">
              <RefreshCcw size={18} />
            </button>
          </div>
        </header>

        {error && <div className="alert app-alert">{error}<button onClick={() => void reload()}>Thử lại</button></div>}

        <section className="stats" aria-label="Tiến độ tổng quan">
          <div><span className="stat-icon xp"><Sparkles size={18} /></span><span>Tổng XP</span><strong>{formatNumber(totalXp)} <small>XP</small></strong></div>
          <div><span className="stat-icon quest"><Flame size={18} /></span><span>Streak học tập</span><strong>{streakDays}<small> ngày</small></strong></div>
          <div><span className="stat-icon recovery"><ShieldAlert size={18} /></span><span>Cần củng cố</span><strong>{recoveryCount}<small> câu</small></strong></div>
        </section>

        <FeatureHost key={`${selectedMode}-${featureKey}`} mode={selectedMode} onCompleted={() => void reload()} />
      </main>
    </div>
  );
}
