export default function AlertBadge({ status }) {
  // status: "ok" | "alerte" | "critique"
  const styles = {
    ok: 'bg-green-100 text-green-800',
    alerte: 'bg-orange-100 text-orange-800',
    critique: 'bg-red-100 text-red-800',
  };

  const labels = {
    ok: 'OK',
    alerte: 'Alerte',
    critique: 'Critique',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}