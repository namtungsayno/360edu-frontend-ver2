export default function Footer() {
  return (
    <footer className="mt-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-500 px-4 py-3">
      © {new Date().getFullYear()} 360edu • All rights reserved.
    </footer>
  );
}
