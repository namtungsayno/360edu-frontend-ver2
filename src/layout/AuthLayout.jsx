import { Outlet } from "react-router-dom";
import PageTransition from "./PageTransition";

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT: FORM */}
      <section className="flex items-center justify-center px-6 py-12 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <img
              src="/logo192.png"
              alt="360edu"
              className="w-8 h-8 rounded-xl"
            />
            <span className="font-semibold">360edu</span>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft p-6">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </div>
      </section>

      {/* RIGHT: INTRO */}
      <section className="relative hidden lg:flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500" />
        <div className="absolute inset-0 [background:radial-gradient(circle_at_1px_1px,white_.6px,transparent_0)] [background-size:24px_24px] opacity-20" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/20 blur-3xl rounded-full" />
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 blur-2xl rounded-full" />
        <div className="relative z-10 text-center text-white max-w-md px-8">
          <h2 className="text-3xl font-bold mb-2">Chào mừng đến 360edu</h2>
          <p className="text-white/90">Học cá nhân hoá – theo nhịp của bạn.</p>
        </div>
      </section>
    </div>
  );
}
