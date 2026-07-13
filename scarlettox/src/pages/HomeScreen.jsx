import { Button, Card, Stat, Badge } from '../components';
import { Section, Overline, GiveLink, SourceLink } from '../site/Shell.jsx';

export function HomeScreen({ onNav }) {
  return (
    <main data-screen-label="Home">
      <Section style={{ padding: '88px 0 64px' }}>
        <div className="sx-cols" style={{ '--cols': '1.1fr 0.9fr', gap: 64, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
            <Overline color="var(--coral-500)">Tetralogy of Fallot</Overline>
            <h1 style={{ font: 'var(--text-hero)' }}>Four little differences. One big heart.</h1>
            <p style={{ font: 'var(--text-body-lg)', maxWidth: 480 }}>Learn what Tetralogy of Fallot means — and help kids at Cook Children's get the care they need.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <GiveLink><Button variant="primary" size="lg">Give today</Button></GiveLink>
              <Button variant="secondary" size="lg" onClick={() => onNav('learn')}>Learn about TOF</Button>
            </div>
          </div>
          <img src="/scar.jpeg" alt="Scarlett" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
        </div>
      </Section>

      <Section tint>
        <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stat value="1 in 2,518" label={<>babies in the U.S. is born with Tetralogy of Fallot — <SourceLink source="hopkins" prefix="" /></>} tone="ink" />
          <Stat value="4" label={<>heart differences make up the condition — <SourceLink source="cdcTof" prefix="" /></>} />
          <Stat value="95%+" label={<>of children survive repair surgery — <SourceLink source="childrensNational" prefix="" /></>} tone="accent" />
          <Stat value="100%" label={<>of your gift goes to <SourceLink source="foundation" prefix="" style={{ color: 'var(--text-body)' }} /> — giving happens on their secure form</>} />
        </div>
      </Section>

      <Section>
        <div className="sx-cols" style={{ '--cols': '1fr 1fr', gap: 32, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
            <Overline>About the condition</Overline>
            <h2 style={{ font: 'var(--text-h2)' }}>What is Tetralogy of Fallot?</h2>
            <p style={{ font: 'var(--text-body-md)', maxWidth: 460 }}>TOF is a heart condition some babies are born with — four small differences in how the heart formed. It sounds scary, but it's well understood and very treatable. Most kids with repaired TOF grow up to run, play, and thrive.</p>
            <p style={{ font: 'var(--text-body-sm)' }}><SourceLink source="hopkins" prefix="Sources:" /> · <SourceLink source="aha" prefix="" /></p>
            <Button variant="ghost" onClick={() => onNav('learn')}>Explore the interactive heart →</Button>
          </div>
          <Card variant="lifted" onClick={() => onNav('learn')} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Badge tone="accent">Interactive</Badge>
            <h3 style={{ font: 'var(--text-h3)' }}>See the four differences</h3>
            <p style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)' }}>Watch the blood flow through a TOF heart, tap each of the four differences, then see how surgeons fix it.</p>
          </Card>
        </div>
      </Section>

      <Section tint>
        <div className="sx-cols" style={{ '--cols': '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
            <Overline color="var(--coral-500)">Ways to give</Overline>
            <h2 style={{ font: 'var(--text-h2)' }}>Your gift funds heart care at Cook Children's</h2>
            <p style={{ font: 'var(--text-body-md)', maxWidth: 440 }}>Giving happens directly on the Cook Children's Health Foundation website — ScarlettOx never handles your money, so 100% of your donation reaches the foundation.</p>
            <GiveLink><Button variant="primary">Give today</Button></GiveLink>
          </div>
          <Card style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ font: 'var(--text-h3)' }}>Why it matters</h3>
            <Stat value="~1 in 100" label={<>babies in the U.S. is born with a congenital heart defect — <SourceLink source="cdcData" prefix="" /></>} tone="ink" />
            <Stat value="40,000" label={<>babies are born with a heart defect in the U.S. each year — <SourceLink source="cdcData" prefix="" /></>} tone="ink" />
            <Stat value="1 in 4" label={<>of those babies has a critical defect needing surgery in their first year — <SourceLink source="cdcData" prefix="" /></>} tone="ink" />
          </Card>
        </div>
      </Section>
    </main>
  );
}
