import { Button } from '../components';
import { DONATE_URL } from './links.js';

export function GiveLink({ children, style }) {
  return (
    <a href={DONATE_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'inline-flex', ...style }}>
      {children}
    </a>
  );
}

export function Wordmark({ size = 26 }) {
  return (
    <span style={{ font: '700 ' + size + 'px/1 var(--font-display)', color: 'var(--ink-900)' }}>
      scarlett<span style={{ color: 'var(--coral-500)' }}>ox</span>
    </span>
  );
}

export function Header({ page, onNav }) {
  const links = [['home', 'Home'], ['learn', 'About TOF'], ['donate', 'Donate']];
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--border-soft)' }}>
      <div className="sx-header-row" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '14px var(--container-pad)' }}>
        <a href="/" onClick={e => { e.preventDefault(); onNav('home'); }} style={{ textDecoration: 'none' }}><Wordmark /></a>
        <nav style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center', flexWrap: 'wrap' }}>
          {links.slice(0, 2).map(([id, label]) => (
            <a key={id} href={id === 'home' ? '/' : '/' + id} onClick={e => { e.preventDefault(); onNav(id); }} style={{
              font: '600 15px/1.2 var(--font-body)', textDecoration: 'none', padding: '8px 14px', borderRadius: 'var(--radius-pill)',
              color: page === id ? 'var(--coral-600)' : 'var(--ink-700)', background: page === id ? 'var(--brand-soft)' : 'transparent',
            }}>{label}</a>
          ))}
          <GiveLink style={{ marginLeft: 8 }}><Button variant="primary" size="sm">Give today</Button></GiveLink>
        </nav>
      </div>
    </header>
  );
}

export function Footer({ onNav }) {
  return (
    <footer style={{ background: 'var(--surface-inverse)', color: 'var(--cream-200)', marginTop: 96 }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '56px var(--container-pad) 40px', display: 'flex', flexWrap: 'wrap', gap: 48, justifyContent: 'space-between' }}>
        <div style={{ maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ font: '700 24px/1 var(--font-display)', color: '#fff' }}>scarlett<span style={{ color: 'var(--coral-300)' }}>ox</span></span>
          <p style={{ font: 'var(--text-body-sm)', color: 'var(--ink-300)' }}>Made in honor of Scarlett — "ox" for the oxygen every little heart deserves. Education and hope for families facing Tetralogy of Fallot; every donation goes to Cook Children's Hospital Foundation.</p>
        </div>
        <div style={{ display: 'flex', gap: 64 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ font: 'var(--text-overline)', letterSpacing: 'var(--tracking-overline)', textTransform: 'uppercase', color: 'var(--ink-500)' }}>Site</span>
            {[['home', 'Home'], ['learn', 'About TOF'], ['donate', 'Donate']].map(([id, label]) => (
              <a key={id} href={id === 'home' ? '/' : '/' + id} onClick={e => { e.preventDefault(); onNav(id); }} style={{ font: 'var(--text-body-sm)', color: 'var(--cream-200)', textDecoration: 'none' }}>{label}</a>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 240 }}>
            <span style={{ font: 'var(--text-overline)', letterSpacing: 'var(--tracking-overline)', textTransform: 'uppercase', color: 'var(--ink-500)' }}>A note</span>
            <p style={{ font: 'var(--text-body-sm)', color: 'var(--ink-300)' }}>This site is for general education, not medical advice.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Section({ tint, children, style }) {
  return (
    <section className="sx-section" style={{ background: tint ? 'var(--surface-card)' : 'transparent', padding: '72px 0', ...style }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-pad)' }}>{children}</div>
    </section>
  );
}

export function Overline({ color = 'var(--teal-500)', children }) {
  return <span style={{ font: 'var(--text-overline)', letterSpacing: 'var(--tracking-overline)', textTransform: 'uppercase', color }}>{children}</span>;
}

export function PhotoPlaceholder({ label, ratio = '4 / 3', style }) {
  return (
    <div style={{ aspectRatio: ratio, borderRadius: 'var(--radius-xl)', background: 'var(--surface-sunken)', border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24, font: 'var(--text-body-sm)', color: 'var(--text-muted)', ...style }}>
      {label}
    </div>
  );
}
