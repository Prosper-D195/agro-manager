export default function StatCard({ title, value, color = 'bg-green-100 text-green-800' }) {
  return (
    <div className={`p-4 rounded shadow ${color}`}>
      <div className="text-sm">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}