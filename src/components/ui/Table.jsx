export default function Table({ head, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-left bg-zinc-50 dark:bg-zinc-800/60">
          <tr>
            {head.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {children}
        </tbody>
      </table>
    </div>
  );
}
