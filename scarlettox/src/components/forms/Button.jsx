import React from 'react';

export function Button({ variant = 'primary', size = 'md', icon, full, disabled, children, style, ...rest }) {
  const pad = size === 'sm' ? '8px 16px' : size === 'lg' ? '14px 28px' : '11px 22px';
  const fontSize = size === 'sm' ? 14 : size === 'lg' ? 17 : 15;
  const variants = {
    primary:   { background: 'var(--brand)', color: 'var(--text-on-brand)', border: '1px solid transparent', boxShadow: 'var(--shadow-card)' },
    secondary: { background: 'var(--surface-card)', color: 'var(--ink-900)', border: '1px solid var(--border-strong)' },
    ghost:     { background: 'transparent', color: 'var(--teal-700)', border: '1px solid transparent' },
  };
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const hoverBg = { primary: 'var(--brand-strong)', secondary: 'var(--surface-tint)', ghost: 'var(--accent-soft)' };
  const pressBg = { primary: 'var(--coral-700)', secondary: 'var(--surface-sunken)', ghost: 'var(--teal-100)' };
  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: pad, borderRadius: 'var(--radius-pill)', cursor: disabled ? 'default' : 'pointer',
        font: `600 ${fontSize}px/1.2 var(--font-body)`, width: full ? '100%' : undefined,
        transition: 'all var(--duration-fast) var(--ease-out)',
        ...variants[variant],
        ...(hover && !disabled ? { background: hoverBg[variant], boxShadow: variant === 'primary' ? 'var(--shadow-lifted)' : undefined, color: variant === 'ghost' ? 'var(--teal-700)' : variants[variant].color } : {}),
        ...(press && !disabled ? { background: pressBg[variant], transform: 'scale(0.98)' } : {}),
        ...(disabled ? { opacity: 0.45 } : {}),
        ...style,
      }}
      {...rest}
    >
      {icon}{children}
    </button>
  );
}
