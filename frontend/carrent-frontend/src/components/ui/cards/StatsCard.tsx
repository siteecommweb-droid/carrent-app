export default function StatsCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="text-sm text-black/60">{title}</div>

      <div className="text-3xl font-black mt-2">
        {value}
      </div>
    </div>
  );
}




