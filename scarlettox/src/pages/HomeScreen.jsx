import { Button, Card, Stat, ProgressBar, Badge } from '../components';
import { Section, Overline, PhotoPlaceholder } from '../site/Shell.jsx';

export function HomeScreen({ onNav }) {
  return (
    <main data-screen-label="Home">
      <Section style={{ padding: '88px 0 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 64, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
            <Overline color="var(--coral-500)">Tetralogy of Fallot</Overline>
            <h1 style={{ font: 'var(--text-hero)' }}>Four little differences. One big heart.</h1>
            <p style={{ font: 'var(--text-body-lg)', maxWidth: 480 }}>Learn what Tetralogy of Fallot means — and help kids at Cook Children's get the care they need.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button variant="primary" size="lg" onClick={() => onNav('donate')}>Give today</Button>
              <Button variant="secondary" size="lg" onClick={() => onNav('learn')}>Learn about TOF</Button>
            </div>
          </div>
          <PhotoPlaceholder label="Photo: a child playing, warm natural light (no imagery was provided)" ratio="4 / 4.4" />
        </div>
      </Section>

      <Section tint>
        <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stat value="1 in 2,518" label="babies in the U.S. is born with Tetralogy of Fallot" tone="ink" />
          <Stat value="4" label="heart differences make up the condition" />
          <Stat value="95%+" label="of children survive repair surgery" tone="accent" />
          <Stat value="100%" label="of your gift goes to Cook Children's Hospital Foundation" />
        </div>
      </Section>

      <Section>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
            <Overline>About the condition</Overline>
            <h2 style={{ font: 'var(--text-h2)' }}>What is Tetralogy of Fallot?</h2>
            <p style={{ font: 'var(--text-body-md)', maxWidth: 460 }}>TOF is a heart condition some babies are born with — four small differences in how the heart formed. It sounds scary, but it's well understood and very treatable. Most kids with repaired TOF grow up to run, play, and thrive.</p>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
            <Overline color="var(--coral-500)">Ways to give</Overline>
            <h2 style={{ font: 'var(--text-h2)' }}>Your gift funds heart care at Cook Children's</h2>
            <p style={{ font: 'var(--text-body-md)', maxWidth: 440 }}>Every dollar donated through ScarlettOx goes to Cook Children's Hospital Foundation — supporting surgeries, family lodging, and research for kids with congenital heart disease.</p>
            <Button variant="primary" onClick={() => onNav('donate')}>Give today</Button>
          </div>
          <Card>
            <ProgressBar value={48200} max={75000} label="Heart Center fund" valueLabel="$48,200 of $75,000" />
            <p style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)', marginTop: 16 }}>312 donors so far this year. Join them — no gift is too small.</p>
          </Card>
        </div>
      </Section>
    </main>
  );
}
