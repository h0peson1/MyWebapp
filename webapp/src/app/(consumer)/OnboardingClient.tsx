'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Circle, Rocket } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { trackEvent } from '@/lib/analytics';

type Step = {
  id: string;
  label: string;
  href?: string;
};

const STEPS: Step[] = [
  { id: 'profile', label: 'Update your profile in settings', href: '/settings' },
  { id: 'pricing', label: 'Choose a plan from pricing', href: '/pricing' },
  { id: 'dashboard', label: 'Visit your dashboard', href: '/dashboard' },
];

export default function OnboardingClient() {
  const { user } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const progress = useMemo(() => {
    const complete = STEPS.filter((s) => checked[s.id]).length;
    return {
      complete,
      total: STEPS.length,
      percent: Math.round((complete / STEPS.length) * 100),
    };
  }, [checked]);

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completeOnboarding = async () => {
    if (!user) {
      return;
    }

    if (progress.complete < STEPS.length) {
      return;
    }

    localStorage.setItem(`onboarding-complete:v1:${user.id}`, 'true');
    await trackEvent('onboarding_completed', { userId: user.id });
    router.push('/dashboard');
  };

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', maxWidth: '860px' }}>
      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <Rocket size={28} /> Welcome Setup
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Complete these steps to unlock the full experience.
        </p>

        <div style={{ width: '100%', height: '10px', borderRadius: '99px', background: 'var(--border)', overflow: 'hidden', marginBottom: '0.75rem' }}>
          <div
            style={{
              width: `${progress.percent}%`,
              height: '100%',
              background: 'var(--accent)',
              transition: 'width 0.2s ease',
            }}
          />
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{progress.complete}/{progress.total} complete</p>
      </div>

      <div className="card" style={{ padding: '1.25rem' }}>
        {STEPS.map((step) => {
          const href = step.href;
          return (
            <div
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: '0.85rem 0.5rem',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <button
                onClick={() => toggle(step.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  textAlign: 'left',
                }}
              >
                {checked[step.id] ? <CheckCircle2 size={18} color="#10b981" /> : <Circle size={18} />}
                {step.label}
              </button>
              {href && (
                <button className="btn btn-secondary" onClick={() => router.push(href)} style={{ padding: '0.4rem 0.7rem', fontSize: '0.8rem' }}>
                  Go
                </button>
              )}
            </div>
          );
        })}

        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={completeOnboarding}
            className="btn btn-primary"
            disabled={progress.complete < STEPS.length}
            style={{ opacity: progress.complete < STEPS.length ? 0.5 : 1 }}
          >
            Finish Setup
          </button>
        </div>
      </div>
    </div>
  );
}
