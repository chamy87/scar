export function ProgressBar({ value = 0, max = 100, label, valueLabel, style }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {(label || valueLabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--text-label)', color: 'var(--text-heading)' }}>
          <span>{label}</span>
          <span style={{ color: 'var(--coral-600)' }}>{valueLabel}</span>
        </div>
      )}
      <div role="progressbar" aria-valuenow={value} aria-valuemax={max} style={{ height: 12, borderRadius: 'var(--radius-pill)', background: 'var(--surface-sunken)', overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', borderRadius: 'var(--radius-pill)', background: 'var(--coral-500)', transition: 'width var(--duration-slow) var(--ease-out)' }} />
      </div>
    </div>
  );
}
