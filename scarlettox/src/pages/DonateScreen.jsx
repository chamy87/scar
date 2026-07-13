import { Button, Card, Stat, Callout } from '../components';
import { Section, Overline, GiveLink, SourceLink } from '../site/Shell.jsx';

export function DonateScreen() {
  return (
    <main data-screen-label="Donate">
      <Section style={{ padding: '72px 0 32px' }}>
        <div style={{ maxWidth: 620, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Overline color="var(--coral-500)">Give today</Overline>
          <h1 style={{ font: 'var(--text-h1)' }}>Every gift mends a little heart</h1>
          <p style={{ font: 'var(--text-body-lg)' }}>Donations go directly to Cook Children's Health Foundation, supporting kids with congenital heart disease.</p>
        </div>
      </Section>

      <Section style={{ padding: '16px 0 0' }}>
        <div className="sx-cols" style={{ '--cols': '1.1fr 0.9fr', gap: 48, alignItems: 'start' }}>
          <Card padding={32} style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>
            <h2 style={{ font: 'var(--text-h2)' }}>Give through Cook Children's</h2>
            <p style={{ font: 'var(--text-body-md)' }}>Donations are made directly on the Cook Children's Health Foundation website — a secure form where you can choose your amount, give once or monthly, and dedicate your gift in honor or memory of someone.</p>
            <p style={{ font: 'var(--text-body-md)' }}>ScarlettOx never handles your money or your card details. Every dollar goes straight to the foundation.</p>
            <GiveLink><Button variant="primary" size="lg">Give today at Cook Children's</Button></GiveLink>
            <p style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)' }}>Opens the Cook Children's Health Foundation donation form in a new tab.</p>
          </Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Card variant="tinted" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h3 style={{ font: 'var(--text-h3)' }}>Why it matters</h3>
              <Stat value="~1 in 100" label={<>babies in the U.S. is born with a congenital heart defect — <SourceLink source="cdcData" prefix="" /></>} tone="ink" />
              <Stat value="1 in 4" label={<>of those babies has a critical defect needing surgery in their first year — <SourceLink source="cdcData" prefix="" /></>} tone="ink" />
              <Stat value="95%+" label={<>of children survive Tetralogy of Fallot repair — <SourceLink source="childrensNational" prefix="" /></>} tone="ink" />
            </Card>
            <Callout tone="info" title="Tax deductible">Cook Children's Health Foundation is a 501(c)(3) nonprofit — you'll receive a receipt from them for your records. <SourceLink source="foundation" prefix="Details:" /></Callout>
          </div>
        </div>
      </Section>
    </main>
  );
}
