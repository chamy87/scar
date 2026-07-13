import React from 'react';

export function Input({ label, hint, error, style, inputStyle, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, font: 'var(--text-label)', color: 'var(--text-heading)', ...style }}>
      {label}
      <input
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          font: 'var(--text-body-md)', color: 'var(--ink-900)', padding: '11px 14px',
          borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', outline: 'none',
          border: `1px solid ${error ? 'var(--error)' : focus ? 'var(--border-focus)' : 'var(--border-strong)'}`,
          boxShadow: focus ? 'var(--shadow-focus)' : 'none',
          transition: 'box-shadow var(--duration-fast) var(--ease-out)',
          ...inputStyle,
        }}
        {...rest}
      />
      {(error || hint) && (
        <span style={{ font: 'var(--text-body-sm)', fontWeight: 400, color: error ? 'var(--error)' : 'var(--text-muted)' }}>{error || hint}</span>
      )}
    </label>
  );
}
