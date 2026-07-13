import React from 'react';

export function Select({ label, hint, error, options = [], style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, font: 'var(--text-label)', color: 'var(--text-heading)', ...style }}>
      {label}
      <span style={{ position: 'relative', display: 'block' }}>
        <select
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{
            width: '100%', appearance: 'none', font: 'var(--text-body-md)', color: 'var(--ink-900)',
            padding: '11px 38px 11px 14px', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', outline: 'none',
            border: `1px solid ${error ? 'var(--error)' : focus ? 'var(--border-focus)' : 'var(--border-strong)'}`,
            boxShadow: focus ? 'var(--shadow-focus)' : 'none', cursor: 'pointer',
          }} {...rest}>
          {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
        </select>
        <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </span>
      {(error || hint) && <span style={{ font: 'var(--text-body-sm)', fontWeight: 400, color: error ? 'var(--error)' : 'var(--text-muted)' }}>{error || hint}</span>}
    </label>
  );
}
