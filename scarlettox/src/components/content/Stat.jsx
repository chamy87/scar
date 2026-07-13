export function Stat({ value, label, tone = 'brand', style }) {
  const colors = { brand: 'var(--coral-500)', accent: 'var(--teal-500)', ink: 'var(--ink-900)' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      <span style={{ font: 'var(--text-stat)', color: colors[tone] }}>{value}</span>
      <span style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)', maxWidth: 220 }}>{label}</span>
    </div>
  );
}
