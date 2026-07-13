import React from 'react';

export function IconButton({ label, variant = 'secondary', size = 'md', disabled, children, style, ...rest }) {
  const dim = size === 'sm' ? 34 : size === 'lg' ? 52 : 44;
  const variants = {
    primary: { background: 'var(--brand)', color: '#fff', border: '1px solid transparent' },
    secondary: { background: 'var(--surface-card)', color: 'var(--ink-700)', border: '1px solid var(--border-strong)' },
    ghost: { background: 'transparent', color: 'var(--ink-700)', border: '1px solid transparent' },
  };
  const [hover, setHover] = React.useState(false);
  const hoverBg = { primary: 'var(--brand-strong)', secondary: 'var(--surface-tint)', ghost: 'var(--accent-soft)' };
  return (
    <button aria-label={label} title={label} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: dim, height: dim, borderRadius: 'var(--radius-pill)', display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'default' : 'pointer',
        transition: 'all var(--duration-fast) var(--ease-out)',
        ...variants[variant],
        ...(hover && !disabled ? { background: hoverBg[variant] } : {}),
        ...(disabled ? { opacity: 0.45 } : {}),
        ...style,
      }} {...rest}>
      {children}
    </button>
  );
}
