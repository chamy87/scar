export function Checkbox({ label, checked, onChange, disabled, style }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'default' : 'pointer', font: 'var(--text-body-md)', color: 'var(--text-body)', opacity: disabled ? 0.45 : 1, ...style }}>
      <span style={{ position: 'relative', width: 22, height: 22, flexShrink: 0 }}>
        <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'inherit' }} />
        <span style={{
          position: 'absolute', inset: 0, borderRadius: 7, transition: 'all var(--duration-fast) var(--ease-out)',
          background: checked ? 'var(--teal-500)' : 'var(--surface-card)',
          border: `1.5px solid ${checked ? 'var(--teal-500)' : 'var(--border-strong)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {checked && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>}
        </span>
      </span>
      {label}
    </label>
  );
}
