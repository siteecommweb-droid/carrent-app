export default function FleetStatusCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="text-sm text-black/60">{title}</div>

      <div className="mt-2 text-2xl font-black">{value}</div>
    </div>
  );
}
