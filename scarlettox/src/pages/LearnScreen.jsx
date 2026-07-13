import { Card, Accordion, Callout, Button, Badge } from '../components';
import { Section, Overline, GiveLink, SourceLink } from '../site/Shell.jsx';
import { HeartMap } from '../site/HeartMap.jsx';
import { SOURCES } from '../site/links.js';

export function LearnScreen() {
  return (
    <main data-screen-label="About TOF">
      <Section style={{ padding: '72px 0 40px' }}>
        <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Overline>About the condition</Overline>
          <h1 style={{ font: 'var(--text-h1)' }}>Tetralogy of Fallot, explained simply</h1>
          <p style={{ font: 'var(--text-body-lg)' }}>"Tetralogy" just means a set of four. TOF is four differences in how a baby's heart formed — usually repaired with one surgery in the first year of life. <SourceLink source="hopkins" /></p>
        </div>
      </Section>

      <Section tint style={{ padding: '56px 0' }}>
        <Badge tone="accent" style={{ marginBottom: 20 }}>Interactive heart</Badge>
        <HeartMap />
        <Callout tone="info" title="Not medical advice" style={{ marginTop: 32, maxWidth: 640 }}>
          This diagram is simplified for learning. Always talk with your child's cardiologist about their specific heart. The facts on this page come from the sources listed below.
        </Callout>
      </Section>

      <Section>
        <div className="sx-cols" style={{ '--cols': '0.9fr 1.1fr', gap: 64 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
            <Overline>Common questions</Overline>
            <h2 style={{ font: 'var(--text-h2)' }}>What families ask most</h2>
            <p style={{ font: 'var(--text-body-md)' }}>A new diagnosis brings a lot of questions. Here are honest, plain answers to the most common ones — each linked to the medical source it comes from.</p>
            <GiveLink><Button variant="primary">Help fund answers — give today</Button></GiveLink>
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

      <Section tint>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
          <Overline>Sources</Overline>
          <h2 style={{ font: 'var(--text-h2)' }}>Check the facts yourself</h2>
          <p style={{ font: 'var(--text-body-md)' }}>Every medical and statistical claim on this site comes from one of these sources.</p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['hopkins', 'cdcTof', 'cdcData', 'childrensNational', 'aha', 'mayo'].map(key => (
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
