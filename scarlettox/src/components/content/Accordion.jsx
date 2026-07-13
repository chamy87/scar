import React from 'react';

export function Accordion({ items = [], style }) {
  const [open, setOpen] = React.useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{ borderBottom: '1px solid var(--border-soft)' }}>
            <button onClick={() => setOpen(isOpen ? -1 : i)} style={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
              background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
              padding: '18px 4px', font: 'var(--text-h4)', color: 'var(--text-heading)',
            }}>
              {it.title}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--teal-500)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: 'transform var(--duration-med) var(--ease-out)', transform: isOpen ? 'rotate(180deg)' : 'none' }}><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: 'grid-template-rows var(--duration-med) var(--ease-out)' }}>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ font: 'var(--text-body-md)', color: 'var(--text-body)', padding: '0 4px 18px', maxWidth: 640 }}>{it.body}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
