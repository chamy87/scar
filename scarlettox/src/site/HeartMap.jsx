import React from 'react';

// Interactive TOF heart — simplified schematic, not medical illustration.
// Two modes: 'tof' (the four differences + mixing blood flow) and 'fixed' (the repair).
const TOF_DEFECTS = [
  {
    id: 'vsd', n: 1, x: 200, y: 252,
    title: 'Ventricular septal defect',
    gloss: 'a hole in the wall between the two pumping chambers',
    body: 'The wall (septum) between the right and left ventricles has an opening, letting oxygen-poor and oxygen-rich blood mix.',
  },
  {
    id: 'aorta', n: 2, x: 232, y: 92,
    title: 'Overriding aorta',
    gloss: 'the big artery sits over the hole, not just the left side',
    body: "The aorta — the vessel carrying blood to the body — is shifted so it sits directly above the hole, receiving blood from both ventricles.",
  },
  {
    id: 'stenosis', n: 3, x: 152, y: 84,
    title: 'Pulmonary stenosis',
    gloss: 'a narrowed path from the heart to the lungs',
    body: 'The valve and vessel leading to the lungs are narrower than usual, so less blood gets there to pick up oxygen.',
  },
  {
    id: 'hypertrophy', n: 4, x: 118, y: 265,
    title: 'Right ventricular hypertrophy',
    gloss: 'a thickened right pumping chamber',
    body: 'Because the right ventricle works harder to push blood through the narrow path, its muscle wall grows thicker.',
  },
];

const TOF_REPAIRS = [
  {
    id: 'patch', n: 1, x: 196, y: 252,
    title: 'A patch closes the hole',
    body: 'Surgeons sew a small patch over the opening between the ventricles. Oxygen-poor and oxygen-rich blood stop mixing, and the aorta now receives only oxygen-rich blood.',
  },
  {
    id: 'widen', n: 2, x: 158, y: 84,
    title: 'The path to the lungs is widened',
    body: 'The narrowed valve and vessel are opened up — sometimes with a patch, sometimes a new valve — so blood flows freely to the lungs to pick up oxygen. The thickened muscle relaxes over time.',
  },
];

// Blood-flow routes (SMIL animateMotion paths)
const FLOW_LUNGS = 'M150 320 C150 260 152 200 158 150 C161 120 162 95 160 56';
const FLOW_BODY = 'M252 315 C246 260 241 200 238 150 C236 110 235 70 235 34';
const FLOW_MIX = 'M152 300 C165 280 182 264 196 253 C218 234 230 180 234 120 C235 88 235 60 235 34';

function FlowDots({ d, color, n = 3, dur = 4, r = 5 }) {
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => (
        <circle key={i} r={r} fill={color} opacity="0.85">
          <animateMotion dur={dur + 's'} repeatCount="indefinite" begin={(-(i * dur) / n) + 's'} path={d} />
        </circle>
      ))}
    </g>
  );
}

export function HeartMap({ style }) {
  const [mode, setMode] = React.useState('tof');
  const [selected, setSelected] = React.useState(null);
  const isTof = mode === 'tof';
  const items = isTof ? TOF_DEFECTS : TOF_REPAIRS;
  const sel = items.find(d => d.id === selected);
  const hl = (id) => selected === id;
  const spotColor = isTof ? 'var(--coral-500)' : 'var(--gold-600)';
  const spotColorHl = isTof ? 'var(--coral-600)' : 'var(--gold-400)';
  const switchMode = (m) => { setMode(m); setSelected(null); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, ...style }}>
      <div style={{ display: 'inline-flex', gap: 4, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-pill)', padding: 4, alignSelf: 'flex-start' }}>
        {[['tof', 'A heart with TOF'], ['fixed', 'After the repair']].map(([m, label]) => (
          <button key={m} onClick={() => switchMode(m)} style={{
            border: 'none', cursor: 'pointer', padding: '9px 20px', borderRadius: 'var(--radius-pill)',
            font: '600 15px/1.2 var(--font-body)', transition: 'all var(--duration-fast) var(--ease-out)',
            background: mode === m ? 'var(--surface-card)' : 'transparent',
            color: mode === m ? 'var(--ink-900)' : 'var(--text-muted)',
            boxShadow: mode === m ? 'var(--shadow-card)' : 'none',
          }}>{label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <svg width="340" height="380" viewBox="0 0 380 420" role="img" preserveAspectRatio="xMidYMid meet" aria-label={isTof ? 'Diagram of a heart with Tetralogy of Fallot, with animated blood flow' : 'Diagram of a repaired heart with normal blood flow'} style={{ animation: 'fh-heartbeat 2.4s var(--ease-out) infinite', transformOrigin: '50% 60%', width: '100%', maxWidth: 340, height: 'auto' }}>
            {/* aorta */}
            <path d="M215 115 L215 38 Q215 24 229 24 L241 24 Q255 24 255 38 L255 120 Z" fill={hl('aorta') ? 'var(--coral-300)' : 'var(--coral-100)'} stroke={hl('aorta') ? 'var(--coral-600)' : 'var(--coral-300)'} strokeWidth="3" style={{ transition: 'all .3s' }} />
            {/* pulmonary artery: pinched with TOF, wide after repair */}
            {isTof ? (
              <path d="M138 120 C136 96 132 84 144 66 Q150 56 162 56 Q174 56 178 68 C186 88 180 98 180 118 C172 104 168 98 159 98 C150 98 146 106 138 120 Z" fill={hl('stenosis') ? 'var(--teal-300)' : 'var(--teal-100)'} stroke={hl('stenosis') ? 'var(--teal-700)' : 'var(--teal-300)'} strokeWidth="3" style={{ transition: 'all .3s' }} />
            ) : (
              <path d="M140 120 C135 94 137 66 150 57 Q160 50 170 57 C182 66 184 94 180 120 Z" fill={hl('widen') ? 'var(--gold-100)' : 'var(--teal-100)'} stroke={hl('widen') ? 'var(--gold-600)' : 'var(--teal-300)'} strokeWidth="3" strokeDasharray={hl('widen') ? '6 5' : 'none'} style={{ transition: 'all .3s' }} />
            )}
            {/* heart body */}
            <path d="M190 128 C150 92 66 100 56 190 C46 280 120 370 190 396 C260 376 334 288 324 196 C314 104 230 92 190 128 Z" fill="var(--cream-50)" stroke="var(--ink-300)" strokeWidth="3" />
            {/* right ventricle — thick wall with TOF, calmer after repair */}
            <path d="M110 190 C88 230 96 300 158 340 C170 346 180 340 180 326 L180 200 C180 186 168 178 152 180 C136 182 120 182 110 190 Z" fill={hl('hypertrophy') ? 'var(--teal-100)' : 'var(--surface-card)'} stroke={hl('hypertrophy') ? 'var(--teal-700)' : 'var(--teal-300)'} strokeWidth={isTof ? (hl('hypertrophy') ? 13 : 9) : 6} style={{ transition: 'all .3s' }} />
            {/* left ventricle */}
            <path d="M212 200 L212 330 C212 344 224 350 236 342 C284 310 300 250 288 208 C282 188 264 182 248 186 C236 189 224 192 212 200 Z" fill="var(--surface-card)" stroke="var(--coral-300)" strokeWidth="5" />
            {/* septum */}
            <line x1="196" y1="176" x2="196" y2="228" stroke={hl('vsd') ? 'var(--coral-600)' : 'var(--ink-300)'} strokeWidth="8" strokeLinecap="round" style={{ transition: 'all .3s' }} />
            <line x1="196" y1="278" x2="196" y2="344" stroke={hl('vsd') ? 'var(--coral-600)' : 'var(--ink-300)'} strokeWidth="8" strokeLinecap="round" style={{ transition: 'all .3s' }} />
            {isTof && hl('vsd') && <circle cx="196" cy="253" r="17" fill="none" stroke="var(--coral-500)" strokeWidth="3" strokeDasharray="4 5" />}
            {/* the repair patch */}
            {!isTof && (
              <rect x="187" y="230" width="18" height="46" rx="9" fill="var(--gold-400)" stroke={hl('patch') ? 'var(--gold-600)' : '#fff'} strokeWidth="3" style={{ transition: 'all .3s' }} />
            )}
            {/* blood flow */}
            {isTof ? (
              <g>
                <FlowDots d={FLOW_LUNGS} color="var(--teal-500)" n={2} dur={5} r={4} />
                <FlowDots d={FLOW_MIX} color="var(--teal-500)" n={3} dur={4} />
                <FlowDots d={FLOW_BODY} color="var(--coral-500)" n={3} dur={4} />
              </g>
            ) : (
              <g>
                <FlowDots d={FLOW_LUNGS} color="var(--teal-500)" n={4} dur={3.5} />
                <FlowDots d={FLOW_BODY} color="var(--coral-500)" n={4} dur={3.5} />
              </g>
            )}
            {/* hotspots */}
            {items.map(d => (
              <g key={d.id} onClick={() => setSelected(selected === d.id ? null : d.id)} style={{ cursor: 'pointer' }}>
                <circle cx={d.x} cy={d.y} r="15" fill={hl(d.id) ? spotColorHl : spotColor} stroke="#fff" strokeWidth="3" style={{ transition: 'all .15s' }} />
                <text x={d.x} y={d.y + 5} textAnchor="middle" fill="#fff" style={{ font: '700 14px var(--font-body)', userSelect: 'none' }}>{d.n}</text>
              </g>
            ))}
          </svg>
          <div style={{ display: 'flex', gap: 18, font: 'var(--text-body-sm)', color: 'var(--text-muted)', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--teal-500)' }}></span>oxygen-poor blood</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--coral-500)' }}></span>oxygen-rich blood</span>
            {!isTof && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--gold-400)' }}></span>patch</span>}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 260, maxWidth: 420 }}>
          {sel ? (
            <div key={mode + sel.id} style={{ animation: 'fh-fade-up .3s var(--ease-out)' }}>
              <span style={{ font: 'var(--text-overline)', letterSpacing: 'var(--tracking-overline)', textTransform: 'uppercase', color: isTof ? 'var(--coral-500)' : 'var(--gold-600)' }}>{isTof ? 'Difference ' + sel.n + ' of 4' : 'Repair step ' + sel.n + ' of 2'}</span>
              <h3 style={{ font: 'var(--text-h3)', margin: '8px 0 4px' }}>{sel.title}</h3>
              {sel.gloss && <p style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 12 }}>— {sel.gloss}</p>}
              <p style={{ font: 'var(--text-body-md)', marginTop: sel.gloss ? 0 : 12 }}>{sel.body}</p>
            </div>
          ) : isTof ? (
            <div key="intro-tof" style={{ animation: 'fh-fade-up .3s var(--ease-out)' }}>
              <h3 style={{ font: 'var(--text-h3)', marginBottom: 8 }}>Watch what the blood does</h3>
              <p style={{ font: 'var(--text-body-md)' }}>With TOF, some oxygen-poor blood (teal) slips through the hole and heads out to the body without visiting the lungs first. Less oxygen is why some babies look bluish. Tap a numbered spot to see each difference.</p>
            </div>
          ) : (
            <div key="intro-fixed" style={{ animation: 'fh-fade-up .3s var(--ease-out)' }}>
              <h3 style={{ font: 'var(--text-h3)', marginBottom: 8 }}>One surgery fixes it</h3>
              <p style={{ font: 'var(--text-body-md)' }}>Usually before a baby's first birthday, surgeons repair everything at once. Now teal blood goes to the lungs, coral blood goes to the body — no mixing. Tap a gold spot to see each step.</p>
            </div>
          )}
          <ol style={{ margin: '20px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map(d => (
              <li key={d.id}>
                <button onClick={() => setSelected(selected === d.id ? null : d.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, background: hl(d.id) ? (isTof ? 'var(--brand-soft)' : 'var(--gold-100)') : 'transparent',
                  border: 'none', borderRadius: 'var(--radius-pill)', padding: '6px 14px 6px 6px', cursor: 'pointer',
                  font: (hl(d.id) ? 600 : 400) + ' 15px/1.3 var(--font-body)', color: hl(d.id) ? (isTof ? 'var(--coral-700)' : 'var(--gold-600)') : 'var(--text-body)',
                  transition: 'all var(--duration-fast) var(--ease-out)',
                }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: spotColor, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', font: '700 12px var(--font-body)', flexShrink: 0 }}>{d.n}</span>
                  {d.title}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
