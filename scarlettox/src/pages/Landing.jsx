import { Button, Card, Stat, Accordion, Callout } from '../components';
import { Section, Overline, GiveLink, SourceLink } from '../site/Shell.jsx';
import { HeartMap } from '../site/HeartMap.jsx';
import { SOURCES } from '../site/links.js';

const STORY_STEPS = [
  {
    when: 'Week 20 of pregnancy',
    title: 'A routine scan finds something',
    body: "At the anatomy scan, doctors noticed something different about Twin B's heart. A fetal echocardiogram confirmed it: Tetralogy of Fallot — four differences in how her heart had formed. Twin B had a name soon after. Scarlett.",
  },
  {
    when: 'Weeks 20–35',
    title: 'Two doctors, twice the appointments',
    body: "From that day on, Scarlett's mom saw a high-risk OB and a pediatric cardiologist alongside her regular OB — extra ultrasounds and fetal echocardiograms to watch both babies as the weeks crawled by. The cardiologist mapped out exactly what Scarlett's heart was doing and what it would need. Knowing before birth meant the care team was ready the moment the twins arrived.",
  },
  {
    when: 'March 2026',
    title: 'The twins are born',
    body: 'Two babies, minutes apart. Twin A was born with a healthy heart. Scarlett was born with TOF, just as the scans had shown — and her care team was waiting for her.',
  },
  {
    when: 'The first 10 weeks',
    title: 'Watching, waiting, growing',
    body: "Scarlett spent her first weeks under constant oxygen monitoring, with medication to help keep her heart rhythm steady while she grew big and strong enough for surgery. Every feed, every ounce, every saturation reading counted.",
  },
  {
    when: 'At about 10 weeks old',
    title: 'Open-heart surgery',
    body: <>Surgeons repaired everything in one operation — a patch closed the hole between her ventricles, and the narrowed path to her lungs was widened. The repair most babies with TOF receive before their first birthday, and one that more than 95% come through. <SourceLink source="hopkins" prefix="Sources:" /> · <SourceLink source="childrensNational" prefix="" /></>,
  },
  {
    when: 'Today',
    title: 'Better than ever',
    body: "After recovery, Scarlett came home — pink, loud, and thriving next to her twin. She'll see a cardiologist for checkups as she grows, but her heart now sends oxygen-rich blood everywhere it needs to go. That's what \"ox\" stands for.",
  },
];

export function Landing() {
  return (
    <main id="top" data-screen-label="ScarlettOx">
      <Section style={{ padding: '88px 0 56px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '50%', right: '-140px', transform: 'translateY(-50%)', width: 560, height: 560, pointerEvents: 'none', zIndex: 0 }}>
          <svg viewBox="0 0 24 24" width="100%" height="100%" style={{ animation: 'sx-lubdub 2.4s var(--ease-out) infinite', transformOrigin: '50% 50%', opacity: 0.55 }}>
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="var(--brand-soft)" />
          </svg>
        </div>
        <div className="sx-cols" style={{ '--cols': '1fr 0.85fr', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>
            <Overline color="var(--coral-500)">Scarlett's story</Overline>
            <h1 style={{ font: 'var(--text-hero)' }}>Twin B had a secret.</h1>
            <p style={{ font: 'var(--text-body-lg)', maxWidth: 500 }}>Before she had a name, Scarlett had a diagnosis. This is the story of how a 20-week ultrasound, months of watching and waiting, and one open-heart surgery gave her a heart that works better than ever.</p>
          </div>
          <img src="/scar.jpeg" alt="Scarlett" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
        </div>
      </Section>

      <Section tint style={{ padding: '56px 0' }}>
        <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stat value="1 in 2,518" label={<>babies in the U.S. is born with Tetralogy of Fallot — <SourceLink source="hopkins" prefix="" /></>} tone="ink" />
          <Stat value="4" label={<>heart defects make up the condition — <SourceLink source="cdcTof" prefix="" /></>} />
          <Stat value="95%+" label={<>of children survive repair surgery — <SourceLink source="childrensNational" prefix="" /></>} tone="accent" />
          <Stat value="100%" label={<>of your gift goes to <SourceLink source="foundation" prefix="" style={{ color: 'var(--text-body)' }} /> — giving happens on their secure form</>} />
        </div>
      </Section>

      <Section id="story">
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
          {STORY_STEPS.map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: i === STORY_STEPS.length - 1 ? 'var(--coral-500)' : 'var(--surface-card)', border: '3px solid var(--coral-500)', flexShrink: 0, marginTop: 4 }}></span>
                {i < STORY_STEPS.length - 1 && <span style={{ width: 3, flex: 1, background: 'var(--coral-200, var(--brand-soft))', borderRadius: 2 }}></span>}
              </div>
              <div style={{ paddingBottom: i < STORY_STEPS.length - 1 ? 40 : 0 }}>
                <span style={{ font: 'var(--text-overline)', letterSpacing: 'var(--tracking-overline)', textTransform: 'uppercase', color: 'var(--teal-500)' }}>{s.when}</span>
                <h3 style={{ font: 'var(--text-h3)', margin: '6px 0 8px' }}>{s.title}</h3>
                <p style={{ font: 'var(--text-body-md)' }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section tint id="heart" style={{ padding: '56px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start', maxWidth: 640, marginBottom: 32 }}>
          <Overline>About the condition</Overline>
          <h2 style={{ font: 'var(--text-h2)' }}>How her heart was fixed</h2>
          <p style={{ font: 'var(--text-body-md)' }}>"Tetralogy" just means a set of four. TOF is four differences in how a baby's heart formed — usually repaired with one surgery in the first year of life. <SourceLink source="hopkins" /></p>
        </div>
        <HeartMap />
        <Callout tone="info" title="Not medical advice" style={{ marginTop: 32, maxWidth: 640 }}>
          This diagram is simplified for learning. Always talk with your child's cardiologist about their specific heart. The facts on this page come from the sources listed below.
        </Callout>
      </Section>

      <Section id="faq">
        <div className="sx-cols" style={{ '--cols': '0.9fr 1.1fr', gap: 64 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
            <Overline>Common questions</Overline>
            <h2 style={{ font: 'var(--text-h2)' }}>What families ask most</h2>
            <p style={{ font: 'var(--text-body-md)' }}>A new diagnosis brings a lot of questions. Here are honest, plain answers to the most common ones — each linked to the medical source it comes from.</p>
          </div>
          <Card variant="outline" padding="8px 24px">
            <Accordion items={[
              { title: 'Is TOF treatable?', body: <>Yes. Open-heart surgery, usually in the first year of life — often around six months old — repairs all four differences at once. Survival is over 95%, and most kids go on to live full, active lives. <SourceLink source="hopkins" /> · <SourceLink source="childrensNational" prefix="" /></> },
              { title: 'What causes it?', body: <>Most of the time, no single cause is found. It is nothing a parent did or didn’t do. Some cases are linked to genetic conditions, which your care team can screen for. <SourceLink source="mayo" /></> },
              { title: 'What are the signs?', body: <>A bluish tint to skin or lips (cyanosis), especially when crying or feeding, a heart murmur, or tiring quickly. Many babies are diagnosed before birth or in the first days of life. <SourceLink source="mayo" /></> },
              { title: 'Will my child need more surgeries?', body: <>Some kids need a follow-up procedure later — often a pulmonary valve replacement in the teen or adult years. Lifelong check-ups with a cardiologist trained in congenital heart defects are part of the plan. <SourceLink source="aha" /></> },
              { title: 'Can kids with repaired TOF play sports?', body: <>Most can, with their cardiologist’s guidance. When the repair is working well, many kids with repaired TOF take part in normal activities — running, swimming, and playing just like their friends. <SourceLink source="aha" /></> },
            ]} />
          </Card>
        </div>
      </Section>

      <Section tint id="give">
        <div className="sx-cols" style={{ '--cols': '1fr 1fr', gap: 48, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
            <Overline color="var(--coral-500)">Why we give</Overline>
            <h2 style={{ font: 'var(--text-h2)' }}>Scarlett got the care every child deserves</h2>
            <p style={{ font: 'var(--text-body-md)', maxWidth: 460 }}>The monitoring, the medication, the surgeons, the recovery — none of it happens without children's heart centers and the people who fund them. Every dollar given through this site goes to Cook Children's Health Foundation, so the next Scarlett gets the same chance.</p>
            <p style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)', maxWidth: 460 }}>Nearly 1 in 100 babies in the U.S. is born with a congenital heart defect — about 40,000 each year. <SourceLink source="cdcData" /></p>
            <GiveLink><Button variant="primary" size="lg">Give in Scarlett's honor</Button></GiveLink>
            <p style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)' }}>Opens the Cook Children's Health Foundation secure donation form in a new tab — ScarlettOx never handles your money or card details.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Card variant="tinted" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h3 style={{ font: 'var(--text-h3)' }}>What your gift does</h3>
              <Stat value="$12" label="provides a PrayerBear for a patient" tone="ink" />
              <Stat value="$45" label="provides food for a facility dog for one month" tone="ink" />
              <Stat value="$75" label="provides a meal card for a family at the medical center" tone="ink" />
              <SourceLink source="giftImpact" />
            </Card>
            <Callout tone="info" title="Tax deductible">Cook Children's Health Foundation is a 501(c)(3) nonprofit — you'll receive a receipt from them for your records. <SourceLink source="foundation" prefix="Details:" /></Callout>
          </div>
        </div>
      </Section>

      <Section>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
          <Overline>Sources</Overline>
          <h2 style={{ font: 'var(--text-h2)' }}>Check the facts yourself</h2>
          <p style={{ font: 'var(--text-body-md)' }}>Every medical and statistical claim on this site comes from one of these sources.</p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['hopkins', 'cdcTof', 'cdcData', 'childrensNational', 'aha', 'mayo', 'giftImpact'].map(key => (
              <li key={key} style={{ font: 'var(--text-body-md)' }}>
                <a href={SOURCES[key].url} target="_blank" rel="noopener noreferrer" style={{ font: 'var(--text-label)' }}>{SOURCES[key].label}</a>
                <span style={{ display: 'block', font: 'var(--text-body-sm)', color: 'var(--text-muted)' }}>{SOURCES[key].note}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </main>
  );
}
