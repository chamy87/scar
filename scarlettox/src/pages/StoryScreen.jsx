import { Button, Card, Badge } from '../components';
import { Section, Overline, PhotoPlaceholder, GiveLink, SourceLink } from '../site/Shell.jsx';

const STORY_STEPS = [
  {
    when: 'Week 20 of pregnancy',
    title: 'A routine scan finds something',
    body: "At the anatomy scan, doctors noticed something different about Twin B's heart. A fetal echocardiogram confirmed it: Tetralogy of Fallot — four differences in how her heart had formed. Twin B had a name soon after. Scarlett.",
  },
  {
    when: 'Weeks 20–38',
    title: 'Two doctors, twice the appointments',
    body: "From that day on, Scarlett's mom saw a high-risk OB alongside her regular OB — extra ultrasounds and echocardiograms to watch both babies as the weeks crawled by. Knowing before birth meant the care team was ready the moment the twins arrived.",
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

export function StoryScreen({ onNav }) {
  return (
    <main data-screen-label="Scarlett's Story">
      <Section style={{ padding: '88px 0 56px' }}>
        <div className="sx-cols" style={{ '--cols': '1fr 0.85fr', gap: 64, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>
            <Overline color="var(--coral-500)">Scarlett's story</Overline>
            <h1 style={{ font: 'var(--text-hero)' }}>Twin B had a secret.</h1>
            <p style={{ font: 'var(--text-body-lg)', maxWidth: 500 }}>Before she had a name, Scarlett had a diagnosis. This is the story of how a 20-week ultrasound, months of watching and waiting, and one open-heart surgery gave her a heart that works better than ever.</p>
          </div>
          <PhotoPlaceholder label="Photo: Scarlett and her twin (add your own photo)" ratio="4 / 4.2" />
        </div>
      </Section>

      <Section tint>
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

      <Section>
        <div className="sx-cols" style={{ '--cols': '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
            <Overline color="var(--coral-500)">Why we give</Overline>
            <h2 style={{ font: 'var(--text-h2)' }}>Scarlett got the care every child deserves</h2>
            <p style={{ font: 'var(--text-body-md)', maxWidth: 460 }}>The monitoring, the medication, the surgeons, the recovery — none of it happens without children's heart centers and the people who fund them. Every dollar given through this site goes to Cook Children's Health Foundation, so the next Scarlett gets the same chance.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <GiveLink><Button variant="primary" size="lg">Give in Scarlett's honor</Button></GiveLink>
              <Button variant="secondary" size="lg" onClick={() => onNav('learn')}>See how her heart was fixed</Button>
            </div>
          </div>
          <Card variant="lifted" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Badge tone="accent">A note from our family</Badge>
            <p style={{ font: 'var(--text-body-md)', fontStyle: 'italic' }}>"We spent 18 weeks waiting to meet a baby we already knew needed help. If this site spares one family a night of frantic searching — or funds one hour of the care Scarlett received — it's done its job."</p>
          </Card>
        </div>
      </Section>
    </main>
  );
}
