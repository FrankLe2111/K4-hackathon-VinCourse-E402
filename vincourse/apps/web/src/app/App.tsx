import { useEffect, useState } from "react";
import { Gamepad2, RefreshCcw } from "lucide-react";
import { listModes, getProgress } from "../api/modes";
import type { GameMode, ModeInfo, ProgressSummary } from "../types/game";
import { FeatureHost } from "../shared/components/FeatureHost";

export function App() {
  const [modes, setModes] = useState<ModeInfo[]>([]);
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [selectedMode, setSelectedMode] = useState<GameMode>("story");
  const [error, setError] = useState("");

  async function reload() {
    setError("");
    try {
      const [modeData, progressData] = await Promise.all([listModes(), getProgress()]);
      setModes(modeData);
      setProgress(progressData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cannot load API.");
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Gamepad2 size={24} />
          <div>
            <strong>VinCourse</strong>
            <span>Team scaffold</span>
          </div>
        </div>

        <nav className="mode-list">
          {modes.map((mode) => (
            <button
              key={mode.mode}
              className={mode.mode === selectedMode ? "active" : ""}
              onClick={() => setSelectedMode(mode.mode)}
            >
              <strong>{mode.title}</strong>
              <span>{mode.owner}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p>Hackathon base</p>
            <h1>One app, separate feature modules.</h1>
          </div>
          <button className="icon-button" onClick={() => void reload()} aria-label="Reload">
            <RefreshCcw size={18} />
          </button>
        </header>

        {error && <div className="alert">{error}</div>}

        <section className="stats">
          <div>
            <span>XP</span>
            <strong>{progress?.xp ?? 0}</strong>
          </div>
          <div>
            <span>Completed modes</span>
            <strong>{progress?.completed_modes.length ?? 0}</strong>
          </div>
          <div>
            <span>Recovery queue</span>
            <strong>{progress?.recovery_queue_size ?? 0}</strong>
          </div>
        </section>

        <FeatureHost mode={selectedMode} onCompleted={() => void reload()} />
      </main>
    </div>
  );
}

