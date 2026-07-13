export function Radio({ label, name, value, checked, onChange, disabled, style }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'default' : 'pointer', font: 'var(--text-body-md)', color: 'var(--text-body)', opacity: disabled ? 0.45 : 1, ...style }}>
      <span style={{ position: 'relative', width: 22, height: 22, flexShrink: 0 }}>
        <input type="radio" name={name} value={value} checked={checked} onChange={onChange} disabled={disabled} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'inherit' }} />
        <span style={{
          position: 'absolute', inset: 0, borderRadius: '50%', transition: 'all var(--duration-fast) var(--ease-out)',
          background: 'var(--surface-card)',
          border: `${checked ? '7px' : '1.5px'} solid ${checked ? 'var(--teal-500)' : 'var(--border-strong)'}`,
          boxSizing: 'border-box',
        }} />
      </span>
      {label}
    </label>
  );
}
