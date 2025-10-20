export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-3.5 py-2.5 text-sm font-medium transition";
  const styles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline:
      "border border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
    subtle:
      "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700",
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
