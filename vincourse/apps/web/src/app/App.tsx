import { useEffect, useState } from "react";
import {
  BookOpen, BrainCircuit, Code2, Flame, Gamepad2, RefreshCcw,
  RotateCcw, ShieldAlert, Sparkles, Swords, Trophy, User,
} from "lucide-react";
import { listModes, getProgress, resetProgress } from "../api/modes";
import type { GameMode, ModeInfo, ProgressSummary } from "../types/game";
import { FeatureHost } from "../shared/components/FeatureHost";

const modeIcons = {
  story: BookOpen,
  daily_recall: BrainCircuit,
  error_dungeon: ShieldAlert,
  lab_arena: Code2,
  boss_battle: Trophy,
  live_battle: Swords,
  understanding: Sparkles,
} satisfies Record<GameMode, typeof BookOpen>;

export function App() {
  const [modes, setModes] = useState<ModeInfo[]>([]);
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [selectedMode, setSelectedMode] = useState<GameMode>("story");
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

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark"><Gamepad2 size={23} /></span>
          <div><strong>VinCourse</strong><span>Learning Odyssey</span></div>
        </div>

        <p className="nav-label">Hành trình học tập</p>
        <nav className="mode-list" aria-label="Chế độ học">
          {loading ? <div className="nav-skeleton">Đang mở bản đồ…</div> : modes.map((mode) => {
            const Icon = modeIcons[mode.mode];
            return (
              <button
                key={mode.mode}
                className={mode.mode === selectedMode ? "active" : ""}
                onClick={() => setSelectedMode(mode.mode)}
                aria-current={mode.mode === selectedMode ? "page" : undefined}
              >
                <span className="mode-icon"><Icon size={18} /></span>
                <span className="mode-copy"><strong>{mode.title}</strong><small>{mode.description}</small></span>
                {progress?.completed_modes.includes(mode.mode) ? <span className="mode-done">✓</span> : null}
              </button>
            );
          })}
        </nav>

        <div className="learner-card">
          <span className="avatar"><User size={18} /></span>
          <span><strong>Nhà kiến tạo AI</strong><small>Level {Math.floor((progress?.xp ?? 0) / 500) + 1}</small></span>
          <Flame size={18} />
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p>AI Learning Adventure</p>
            <h1>{activeMode?.title ?? "Sẵn sàng cho nhiệm vụ mới?"}</h1>
          </div>
          <div className="topbar-actions">
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
          <div><span className="stat-icon xp"><Sparkles size={18} /></span><span>Điểm kinh nghiệm</span><strong>{progress?.xp ?? 0} <small>XP</small></strong></div>
          <div><span className="stat-icon quest"><Trophy size={18} /></span><span>Nhiệm vụ hoàn tất</span><strong>{progress?.completed_modes.length ?? 0}<small>/{modes.length || 7}</small></strong></div>
          <div><span className="stat-icon recovery"><ShieldAlert size={18} /></span><span>Cần củng cố</span><strong>{progress?.recovery_queue_size ?? 0}<small> câu</small></strong></div>
        </section>

        <FeatureHost key={`${selectedMode}-${featureKey}`} mode={selectedMode} onCompleted={() => void reload()} />
      </main>
    </div>
  );
}
