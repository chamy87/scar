import React from 'react';

export function Card({ variant = 'default', padding = 24, children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const interactive = variant === 'lifted';
  const variants = {
    default: { background: 'var(--surface-card)', boxShadow: 'var(--shadow-card)' },
    lifted: { background: 'var(--surface-card)', boxShadow: 'var(--shadow-card)', cursor: 'pointer' },
    tinted: { background: 'var(--accent-soft)' },
    outline: { background: 'var(--surface-card)', border: '1px solid var(--border-soft)' },
  };
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 'var(--radius-lg)', padding,
        transition: 'all var(--duration-fast) var(--ease-out)',
        ...variants[variant],
        ...(interactive && hover ? { boxShadow: 'var(--shadow-lifted)', transform: 'translateY(-2px)' } : {}),
        ...style,
      }} {...rest}>
      {children}
    </div>
  );
}
