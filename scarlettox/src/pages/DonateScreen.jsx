import React from 'react';
import { Button, Card, Input, Select, Checkbox, Radio, Stat, Callout, ProgressBar } from '../components';
import { Section, Overline } from '../site/Shell.jsx';

export function DonateScreen() {
  const [freq, setFreq] = React.useState('once');
  const [amount, setAmount] = React.useState(50);
  const [custom, setCustom] = React.useState('');
  const [dedicate, setDedicate] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const amounts = [25, 50, 100, 250];
  const finalAmount = custom || amount;
  return (
    <main data-screen-label="Donate">
      <Section style={{ padding: '72px 0 32px' }}>
        <div style={{ maxWidth: 620, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Overline color="var(--coral-500)">Give today</Overline>
          <h1 style={{ font: 'var(--text-h1)' }}>Every gift mends a little heart</h1>
          <p style={{ font: 'var(--text-body-lg)' }}>100% of your donation goes to Cook Children's Hospital Foundation, supporting kids with congenital heart disease.</p>
        </div>
      </Section>

      <Section style={{ padding: '16px 0 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48, alignItems: 'start' }}>
          <Card padding={32}>
            {done ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
                <h2 style={{ font: 'var(--text-h2)', color: 'var(--success)' }}>Thank you.</h2>
                <p style={{ font: 'var(--text-body-md)' }}>Your ${finalAmount} {freq === 'monthly' ? 'monthly ' : ''}gift is on its way to Cook Children's Hospital Foundation. A receipt is headed to your inbox.</p>
                <Button variant="secondary" onClick={() => setDone(false)}>Make another gift</Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'flex', gap: 24 }}>
                  <Radio name="freq" value="once" label="One time" checked={freq === 'once'} onChange={() => setFreq('once')} />
                  <Radio name="freq" value="monthly" label="Monthly" checked={freq === 'monthly'} onChange={() => setFreq('monthly')} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ font: 'var(--text-label)', color: 'var(--text-heading)' }}>Amount</span>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {amounts.map(a => (
                      <Button key={a} variant={!custom && amount === a ? 'primary' : 'secondary'} onClick={() => { setAmount(a); setCustom(''); }}>{'$' + a}</Button>
                    ))}
                    <Input placeholder="Other" value={custom} onChange={e => setCustom(e.target.value.replace(/[^0-9]/g, ''))} inputStyle={{ width: 90, padding: '9px 14px' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Input label="Full name" placeholder="Jordan Avery" />
                  <Input label="Email" type="email" placeholder="you@example.com" hint="For your receipt" />
                </div>
                <Select label="Designation" options={["Where it's needed most", 'Heart Center fund', 'Family support & lodging', 'Congenital heart research']} />
                <Checkbox label="Dedicate this gift in honor or memory of someone" checked={dedicate} onChange={e => setDedicate(e.target.checked)} />
                {dedicate && <Input label="Their name" placeholder="In honor of…" />}
                <Button variant="primary" size="lg" full onClick={() => setDone(true)}>{'Give $' + finalAmount + (freq === 'monthly' ? ' monthly' : '')}</Button>
                <p style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)', textAlign: 'center' }}>Secure giving. This is a design prototype — no card is charged.</p>
              </div>
            )}
          </Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Card variant="tinted" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h3 style={{ font: 'var(--text-h3)' }}>What your gift does</h3>
              <Stat value="$25" label="a comfort kit for a family on surgery day" tone="ink" />
              <Stat value="$100" label="a night of lodging so parents can stay close" tone="ink" />
              <Stat value="$250" label="helps fund echo screenings for newborns" tone="ink" />
            </Card>
            <Card>
              <ProgressBar value={48200} max={75000} label="Heart Center fund" valueLabel="$48,200 of $75,000" />
            </Card>
            <Callout tone="info" title="Tax deductible">Cook Children's Hospital Foundation is a 501(c)(3) nonprofit. You'll receive a receipt for your records.</Callout>
          </div>
        </div>
      </Section>
    </main>
  );
}
