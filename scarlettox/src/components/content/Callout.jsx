export function Callout({ tone = 'info', title, children, style }) {
  const tones = {
    info: { bg: 'var(--info-bg)', fg: 'var(--teal-700)' },
    success: { bg: 'var(--success-bg)', fg: 'var(--success)' },
    warning: { bg: 'var(--warning-bg)', fg: 'var(--warning)' },
    error: { bg: 'var(--error-bg)', fg: 'var(--error)' },
  };
  const t = tones[tone];
  return (
    <div style={{ display: 'flex', gap: 12, padding: '16px 18px', borderRadius: 'var(--radius-lg)', background: t.bg, ...style }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
      <div style={{ font: 'var(--text-body-sm)', color: 'var(--ink-700)' }}>
        {title && <strong style={{ display: 'block', color: t.fg, font: 'var(--text-label)', marginBottom: 4 }}>{title}</strong>}
        {children}
      </div>
    </div>
  );
}
