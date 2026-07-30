import { useEffect, useMemo, useState } from "react";
import { Bell, BookOpen, ChevronRight, Flame, Gamepad2, Menu, RefreshCcw, Sparkles } from "lucide-react";
import { FeatureHost } from "../shared/components/FeatureHost";
import { VisionScreen } from "./VisionScreens";
import type { GameMode } from "../types/game";

export type Route =
  | "understanding" | "home" | "map" | "modes" | "quest" | "feedback"
  | "recovery" | "result" | "recall" | "mastery" | "error-dungeon"
  | "lab" | "boss" | "live" | "ai-adversary"
  | "admin-dashboard" | "admin-upload" | "admin-generate" | "admin-world"
  | "admin-questions" | "admin-analytics";
export type Role = "student" | "admin";

const studentNav: Array<[string, Route, string, string?]> = [
  ["HỌC TẬP", "understanding", "", ""],
  ["✓", "understanding", "Hiểu Thật", "AI"],
  ["⌂", "home", "Trang chủ"],
  ["⌘", "map", "Bản đồ khóa học"],
  ["◇", "modes", "Chế độ chơi", "7"],
  ["↻", "recall", "Ôn tập hằng ngày", "4"],
  ["◎", "mastery", "Năng lực của tôi"],
  ["KHẮC PHỤC", "recovery", "", ""],
  ["⚑", "error-dungeon", "Hầm ngục sai lầm", "3"],
  ["◈", "ai-adversary", "Đối thủ AI"],
];
const adminNav: Array<[string, Route, string, string?]> = [
  ["COURSE STUDIO", "admin-dashboard", "", ""],
  ["⌂", "admin-dashboard", "Tổng quan"],
  ["↑", "admin-upload", "Tải bài giảng"],
  ["⌘", "admin-world", "Thế giới khóa học"],
  ["?", "admin-questions", "Question Studio", "24"],
  ["THEO DÕI", "admin-analytics", "", ""],
  ["▥", "admin-analytics", "Phân tích học tập"],
  ["●", "live", "Live Battle"],
];

const routeTitles: Record<Route, string> = {
  understanding: "Hiểu Thật · AI checkpoint", home: "Trang chủ học viên", map: "Bản đồ khóa học",
  modes: "Chế độ chơi", quest: "Story Quest", feedback: "Phản hồi học tập",
  recovery: "Nhiệm vụ khắc phục", result: "Kết quả nhiệm vụ", recall: "Ôn tập hằng ngày",
  mastery: "Bằng chứng năng lực", "error-dungeon": "Hầm ngục sai lầm", lab: "Đấu trường thực hành",
  boss: "Đại chiến Trùm", live: "Live Class Battle", "ai-adversary": "Đối thủ AI",
  "admin-dashboard": "Bảng điều khiển giảng viên", "admin-upload": "Tải bài giảng",
  "admin-generate": "AI tạo khóa học", "admin-world": "Thế giới đã tạo",
  "admin-questions": "Question Studio", "admin-analytics": "Phân tích học tập",
};

function routeFromHash(): Route {
  const value = window.location.hash.slice(1) as Route;
  return value in routeTitles ? value : "home";
}

export function App() {
  const [route, setRoute] = useState<Route>(routeFromHash);
  const [role, setRole] = useState<Role>(routeFromHash().startsWith("admin-") ? "admin" : "student");
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const [xp, setXp] = useState(1240);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState("");
  const nav = role === "student" ? studentNav : adminNav;
  const profile = role === "student" ? { initials: "LM", name: "Linh Minh", title: "Học viên khám phá" } : { initials: "AN", name: "Dr. An Nguyen", title: "Giảng viên khóa học" };

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function navigate(next: Route) {
    window.location.hash = next;
    setRoute(next);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function toggleRole() {
    const next = role === "student" ? "admin" : "student";
    setRole(next);
    navigate(next === "admin" ? "admin-dashboard" : "home");
  }
  const content = useMemo(() => {
    if (route === "lab") return <FeatureHost mode={"lab_arena" as GameMode} onCompleted={() => setXp((value) => value + 120)} />;
    return <VisionScreen route={route} role={role} navigate={navigate} addXp={(value) => setXp((current) => current + value)} notify={setToast} />;
  }, [route, role]);

  return (
    <div className="vc-app">
      <aside className={`vc-sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="vc-brand" onClick={() => navigate("home")}><span>V</span>VinCourse</button>
        <nav>
          {nav.map(([icon, target, label, badge], index) => label ? (
            <button key={`${target}-${index}`} className={route === target ? "active" : ""} onClick={() => navigate(target)}>
              <i>{icon}</i><span>{label}</span>{badge && <b>{badge}</b>}
            </button>
          ) : <div className="vc-nav-section" key={`${target}-${index}`}>{icon}</div>)}
        </nav>
        <div className="vc-profile">
          <span>{profile.initials}</span><div><strong>{profile.name}</strong><small>{profile.title}</small></div>
          <button onClick={toggleRole}>⇄</button>
        </div>
      </aside>

      <div className="vc-shell">
        <header className="vc-topbar">
          <button className="vc-mobile-menu" onClick={() => setSidebarOpen((value) => !value)}><Menu size={18} /></button>
          <div className="vc-context"><i /><div><strong>{["map", "quest"].includes(route) ? "AI Odyssey" : "Nền tảng Học máy"}</strong><small>{routeTitles[route]}</small></div></div>
          <div className="vc-top-actions">
            <button className="vc-mvp" onClick={() => navigate("understanding")}>MVP · Hiểu Thật</button>
            <div className="vc-chip"><Gamepad2 size={14} /><strong>Vision UI</strong><small>Mô phỏng</small></div>
            <div className="vc-language"><button className={language === "vi" ? "active" : ""} onClick={() => setLanguage("vi")}>VI</button><button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button></div>
            <div className="vc-chip"><Flame size={14} /><strong>7</strong><small>ngày liên tiếp</small></div>
            <div className="vc-chip"><Sparkles size={14} /><strong>{xp.toLocaleString("vi-VN")}</strong><small>XP</small></div>
            <button className="vc-icon" onClick={() => setToast("Bạn có 4 lượt ôn tập hôm nay.")}><Bell size={16} /></button>
            <button className="vc-avatar" onClick={toggleRole}>{profile.initials}</button>
          </div>
        </header>
        <main className="vc-view">
          <div className="vc-breadcrumb"><BookOpen size={14} /> {routeTitles[route]} <ChevronRight size={13} /></div>
          {content}
        </main>
      </div>
      {toast && <div className="vc-toast"><RefreshCcw size={15} /><div><strong>{toast}</strong><small>Đã hoàn tất thao tác mô phỏng.</small></div></div>}
    </div>
  );
}
