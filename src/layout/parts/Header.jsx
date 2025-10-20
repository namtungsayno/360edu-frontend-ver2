import { Menu, Sun, Moon } from "lucide-react";
export default function Header({ onToggleSidebar, theme, onToggleTheme }) {
  return (
    <header className="sticky top-0 z-50 h-14 bg-white dark:bg-slate-900 shadow-soft flex items-center justify-between px-4">
      <button className="icon-btn" onClick={onToggleSidebar}>
        <Menu size={20} />
      </button>
      <div className="flex items-center gap-2 font-bold">
        <img src="/logo192.png" alt="360edu" className="w-6 h-6 rounded-lg" />
        <span>360edu</span>
      </div>
      <button className="icon-btn" onClick={onToggleTheme}>
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
}
