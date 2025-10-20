export function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white dark:bg-zinc-900 rounded-2xl shadow-sm ring-1 ring-zinc-200/60 dark:ring-zinc-700 ${className}`}
    >
      {children}
    </div>
  );
}
export function CardHeader({ title, actions }) {
  return (
    <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      {actions}
    </div>
  );
}
export function CardBody({ children, className = "" }) {
  return <div className={`px-5 py-5 ${className}`}>{children}</div>;
}
