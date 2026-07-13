export function Badge({ tone = 'neutral', children, style }) {
  const tones = {
    neutral: { background: 'var(--surface-sunken)', color: 'var(--ink-700)' },
    brand: { background: 'var(--brand-soft)', color: 'var(--coral-700)' },
    accent: { background: 'var(--accent-soft)', color: 'var(--teal-700)' },
    success: { background: 'var(--success-bg)', color: 'var(--success)' },
    warning: { background: 'var(--warning-bg)', color: 'var(--warning)' },
    error: { background: 'var(--error-bg)', color: 'var(--error)' },
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px',
      borderRadius: 'var(--radius-pill)', font: '600 13px/1.4 var(--font-body)',
      ...tones[tone], ...style,
    }}>{children}</span>
  );
}
