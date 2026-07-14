import React from 'react';

// Interactive TOF heart — schematic diagram (for illustration, not medical art).
// Focus: animated blood flow and the mixing that TOF causes. Two modes: 'tof' / 'fixed'.
const MIX = '#7d4a86'; // purple = oxygen-poor + oxygen-rich blood mixing

const TOF_DEFECTS = [
  { id: 'stenosis', n: 1, x: 157, y: 235,
    title: 'Pulmonary stenosis', gloss: 'a narrowed path from the heart to the lungs',
    body: 'The valve and artery leading from the right ventricle up to the lungs are narrower than usual, so less blood gets there to pick up oxygen.' },
  { id: 'aorta', n: 2, x: 201, y: 254,
    title: 'Overriding aorta', gloss: 'the body’s main artery sits over the hole',
    body: 'The aorta — the vessel carrying blood to the body — is shifted so its opening sits directly above the hole, receiving blood from BOTH ventricles instead of just the left.' },
  { id: 'vsd', n: 3, x: 190, y: 284,
    title: 'Ventricular septal defect', gloss: 'a hole in the wall between the two pumping chambers',
    body: 'The wall (septum) between the right and left ventricles has an opening. Oxygen-poor (blue) and oxygen-rich (red) blood mix here — watch the purple.' },
  { id: 'hypertrophy', n: 4, x: 92, y: 332,
    title: 'Right ventricular hypertrophy', gloss: 'a thickened right pumping chamber',
    body: 'Because the right ventricle works harder to push blood through the narrowed path, its muscle wall grows thicker over time.' },
];

const TOF_REPAIRS = [
  { id: 'patch', n: 1, x: 190, y: 284,
    title: 'A patch closes the hole',
    body: 'Surgeons sew a patch over the opening between the ventricles. Blue and red blood stop mixing, and the aorta again receives only oxygen-rich blood from the left ventricle.' },
  { id: 'widen', n: 2, x: 157, y: 235,
    title: 'The path to the lungs is widened',
    body: 'The narrowed valve and artery are opened up — sometimes with a patch, sometimes a new valve — so blood flows freely to the lungs to pick up oxygen. The thickened muscle relaxes over time.' },
];

// Blood-flow motion paths (SMIL animateMotion)
const F_VC_RA   = 'M32 182 C58 190 86 198 110 202';
const F_RA_RV   = 'M110 236 C110 264 108 296 104 330';
const F_RV_PA   = 'M120 330 C132 288 152 252 159 216 C160 170 160 132 160 100 C160 84 144 72 118 64';
const F_LUNG_LA = 'M250 66 C258 112 262 160 262 202';
const F_LA_LV   = 'M262 236 C262 266 260 296 256 330';
const F_LV_AO   = 'M250 328 C216 306 202 276 196 252 L196 150 Q196 116 231 114 L285 114 Q311 114 311 152 L311 260';
const F_LV_ROOT = 'M250 328 C216 306 202 276 197 254';
const F_SHUNT   = 'M118 326 C140 308 168 296 188 282 L196 252';
const F_AO_OUT  = 'M196 250 V150 Q196 116 231 114 L285 114 Q311 114 311 152 L311 260';

function FlowDots({ d, color, n = 3, dur = 4, r = 4.5 }) {
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => (
        <circle key={i} r={r} fill={color} opacity="0.9">
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

  const pulmNeckW = isTof ? (hl('stenosis') ? 5 : 7) : (hl('widen') ? 24 : 22);
  const pulmNeckColor = isTof ? (hl('stenosis') ? 'var(--teal-700)' : 'var(--teal-500)') : (hl('widen') ? 'var(--gold-600)' : 'var(--teal-500)');
  const rvWall = isTof ? (hl('hypertrophy') ? 13 : 9) : 5.5;
  // Ventricles keep their own color; blood only turns purple once mixed and sent into the aorta
  const rvFill = 'var(--teal-100)';
  const lvFill = 'var(--coral-100)';

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

      <div style={{ display: 'flex', gap: 36, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <svg width="360" height="400" viewBox="0 0 380 420" role="img" preserveAspectRatio="xMidYMid meet" aria-label={isTof ? 'Diagram of a heart with Tetralogy of Fallot showing blood flow and mixing' : 'Diagram of a repaired heart with separated blood flow'} style={{ animation: 'fh-heartbeat 2.4s var(--ease-out) infinite', transformOrigin: '50% 55%', overflow: 'visible', width: '100%', maxWidth: 360, height: 'auto' }}>
            {/* ---- GREAT VESSELS (behind chambers) ---- */}
            <path d="M120 232 V96" fill="none" stroke="var(--teal-500)" strokeWidth="20" strokeLinecap="round" />
            <path d="M120 104 Q104 74 78 62" fill="none" stroke="var(--teal-500)" strokeWidth="13" strokeLinecap="round" />
            <path d="M120 104 Q138 78 166 66" fill="none" stroke="var(--teal-500)" strokeWidth="13" strokeLinecap="round" />
            {/* unifying heart silhouette behind the chambers */}
            <path d="M56 200 C56 160 82 140 120 140 C151 140 168 150 190 150 C212 150 229 140 260 140 C298 140 330 160 330 200 C330 254 318 306 296 338 C266 384 216 410 190 414 C160 410 108 384 80 340 C62 308 56 252 56 200 Z" fill="var(--cream-50)" stroke="var(--border-soft)" strokeWidth="2" />

            {/* pulmonary artery — rises from the RV outflow through the center, branches to the lungs */}
            <path d="M160 232 V100" fill="none" stroke="var(--teal-500)" strokeWidth="20" strokeLinecap="round" />
            <path d="M160 110 Q142 76 112 62" fill="none" stroke="var(--teal-500)" strokeWidth="13" strokeLinecap="round" />
            <path d="M160 110 Q180 82 206 76" fill="none" stroke="var(--teal-500)" strokeWidth="13" strokeLinecap="round" />
            {/* pulmonary valve neck — narrow with TOF (stenosis), wide after repair */}
            <path d="M160 268 V226" fill="none" stroke={pulmNeckColor} strokeWidth={pulmNeckW} strokeLinecap="round" strokeDasharray={(!isTof && hl('widen')) ? '5 5' : 'none'} style={{ transition: 'stroke-width .3s, stroke .3s' }} />
            {isTof && (
              <g style={{ pointerEvents: 'none' }}>
                <path d="M144 244 L154 249 L144 254 Z" fill={hl('stenosis') ? 'var(--teal-700)' : 'var(--teal-500)'} />
                <path d="M176 244 L166 249 L176 254 Z" fill={hl('stenosis') ? 'var(--teal-700)' : 'var(--teal-500)'} />
              </g>
            )}
            {/* aorta (to body) — overriding: root over the septum. Purple tint in TOF = it carries mixed blood */}
            <path d="M196 250 V150 Q196 114 231 114 L285 114 Q313 114 313 152 V262" fill="none" stroke={isTof ? '#b58ab8' : 'var(--coral-500)'} strokeWidth="22" strokeLinecap="round" style={{ transition: 'stroke .3s' }} />

            {/* ---- CHAMBERS (curved, forming the heart) ---- */}
            {/* right atrium — top-left lobe */}
            <path d="M120 152 C90 152 68 170 68 197 C68 222 88 238 120 238 L152 238 L152 162 C152 156 142 152 120 152 Z" fill="var(--teal-100)" stroke="var(--teal-300)" strokeWidth="3" strokeLinejoin="round" />
            {/* left atrium — top-right lobe */}
            <path d="M260 152 C300 152 322 170 322 197 C322 222 302 238 260 238 L228 238 L228 162 C228 156 240 152 260 152 Z" fill="var(--coral-100)" stroke="var(--coral-300)" strokeWidth="3" strokeLinejoin="round" />
            {/* right ventricle — bottom-left, tapering toward the apex */}
            <path d="M70 246 C52 258 54 306 68 342 C86 386 138 404 186 400 L186 260 C186 250 172 246 132 246 C106 246 82 244 70 246 Z"
              fill={hl('hypertrophy') ? 'var(--teal-100)' : rvFill} stroke={hl('hypertrophy') ? 'var(--teal-700)' : 'var(--teal-500)'} strokeWidth={rvWall} strokeLinejoin="round" style={{ transition: 'stroke-width .3s, stroke .3s, fill .3s' }} />
            {/* left ventricle — bottom-right, tapering toward the apex */}
            <path d="M310 250 C330 264 326 312 308 344 C286 384 236 404 194 400 L194 260 C194 250 208 246 248 246 C280 246 298 246 310 250 Z"
              fill={lvFill} stroke="var(--coral-500)" strokeWidth="6" strokeLinejoin="round" style={{ transition: 'fill .3s' }} />

            {/* septum + VSD gap */}
            <line x1="190" y1="300" x2="190" y2="392" stroke={hl('vsd') ? 'var(--coral-600)' : 'var(--ink-300)'} strokeWidth="8" strokeLinecap="round" style={{ transition: 'stroke .3s' }} />
            <line x1="190" y1="252" x2="190" y2="270" stroke={hl('vsd') ? 'var(--coral-600)' : 'var(--ink-300)'} strokeWidth="8" strokeLinecap="round" style={{ transition: 'stroke .3s' }} />
            {!isTof && <rect x="184" y="268" width="12" height="34" rx="6" fill="var(--gold-400)" stroke={hl('patch') ? 'var(--gold-600)' : '#fff'} strokeWidth="2.5" style={{ transition: 'stroke .3s' }} />}
            {isTof && (
              <circle cx="190" cy="284" r={hl('vsd') ? 15 : 11} fill="none" stroke={MIX} strokeWidth="3" strokeDasharray="4 5" style={{ transition: 'r .3s' }}>
                <animateTransform attributeName="transform" type="rotate" from="0 190 284" to="360 190 284" dur="9s" repeatCount="indefinite" />
              </circle>
            )}

            {/* aortic root over the septum (the override) */}
            <ellipse cx="196" cy="250" rx="22" ry="12" fill={isTof ? '#c9a4cc' : 'var(--coral-300)'} stroke={hl('aorta') ? 'var(--coral-600)' : 'var(--coral-500)'} strokeWidth={hl('aorta') ? 4 : 2} style={{ transition: 'stroke .3s, stroke-width .3s, fill .3s' }} />

            {/* labels */}
            <g style={{ pointerEvents: 'none', fill: 'var(--text-muted)', font: '600 13px var(--font-body)' }}>
              <text x="108" y="200" textAnchor="middle">RA</text>
              <text x="272" y="200" textAnchor="middle">LA</text>
              <text x="122" y="356" textAnchor="middle">RV</text>
              <text x="272" y="340" textAnchor="middle">LV</text>
            </g>
            <g style={{ pointerEvents: 'none', fill: 'var(--ink-500)', font: '600 11px var(--font-body)' }}>
              <text x="96" y="50" textAnchor="middle">to lungs</text>
              <text x="320" y="288" textAnchor="start">to body</text>
            </g>

            {/* ---- BLOOD FLOW ---- */}
            {isTof ? (
              <g>
                <FlowDots d={F_VC_RA} color="var(--teal-500)" n={2} dur={4.5} />
                <FlowDots d={F_RA_RV} color="var(--teal-500)" n={2} dur={4} />
                <FlowDots d={F_RV_PA} color="var(--teal-500)" n={1} dur={5.5} />
                <FlowDots d={F_SHUNT} color="var(--teal-500)" n={2} dur={4} />
                <FlowDots d={F_LUNG_LA} color="var(--coral-500)" n={2} dur={4.5} />
                <FlowDots d={F_LA_LV} color="var(--coral-500)" n={2} dur={4} />
                <FlowDots d={F_LV_ROOT} color="var(--coral-500)" n={2} dur={4} />
                <FlowDots d={F_AO_OUT} color={MIX} n={3} dur={3.6} />
              </g>
            ) : (
              <g>
                <FlowDots d={F_VC_RA} color="var(--teal-500)" n={2} dur={4} />
                <FlowDots d={F_RA_RV} color="var(--teal-500)" n={2} dur={3.6} />
                <FlowDots d={F_RV_PA} color="var(--teal-500)" n={3} dur={3.6} />
                <FlowDots d={F_LUNG_LA} color="var(--coral-500)" n={2} dur={4} />
                <FlowDots d={F_LA_LV} color="var(--coral-500)" n={2} dur={3.6} />
                <FlowDots d={F_LV_AO} color="var(--coral-500)" n={3} dur={3.6} />
              </g>
            )}

            {/* ---- HOTSPOTS ---- */}
            {items.map(d => (
              <g key={d.id} onClick={() => setSelected(selected === d.id ? null : d.id)} style={{ cursor: 'pointer' }}>
                <circle cx={d.x} cy={d.y} r="14" fill={hl(d.id) ? spotColorHl : spotColor} stroke="#fff" strokeWidth="3" style={{ transition: 'all .15s' }} />
                <text x={d.x} y={d.y + 5} textAnchor="middle" fill="#fff" style={{ font: '700 13px var(--font-body)', userSelect: 'none', pointerEvents: 'none' }}>{d.n}</text>
              </g>
            ))}
          </svg>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', font: 'var(--text-body-sm)', color: 'var(--text-muted)', alignItems: 'center', maxWidth: 340 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--teal-500)' }}></span>oxygen-poor</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--coral-500)' }}></span>oxygen-rich</span>
            {isTof && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 11, height: 11, borderRadius: '50%', background: MIX }}></span>mixed (the problem)</span>}
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
              <h3 style={{ font: 'var(--text-h3)', marginBottom: 8 }}>Watch the blood mix</h3>
              <p style={{ font: 'var(--text-body-md)' }}>Blue is oxygen-poor blood, red is oxygen-rich. Through the hole in the wall they blend into purple — and some heads out the aorta to the body without stopping at the lungs first. That's why some babies look bluish. Tap a numbered spot to see each difference.</p>
            </div>
          ) : (
            <div key="intro-fixed" style={{ animation: 'fh-fade-up .3s var(--ease-out)' }}>
              <h3 style={{ font: 'var(--text-h3)', marginBottom: 8 }}>One surgery fixes it</h3>
              <p style={{ font: 'var(--text-body-md)' }}>Usually within the first months of life, surgeons repair everything at once. The hole is patched and the path to the lungs is widened — now blue goes to the lungs, red goes to the body, no mixing. Tap a gold spot to see each step.</p>
            </div>
          )}
          <ol style={{ margin: '20px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map(d => (
              <li key={d.id}>
                <button onClick={() => setSelected(selected === d.id ? null : d.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, background: hl(d.id) ? (isTof ? 'var(--brand-soft)' : 'var(--gold-100)') : 'transparent',
                  border: 'none', borderRadius: 'var(--radius-pill)', padding: '6px 14px 6px 6px', cursor: 'pointer', textAlign: 'left', width: '100%',
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
