import { headers } from "next/headers";
import prisma from "@/lib/db";
import SettingsClient from "./SettingsClient";
import FadeUp from "@/components/motion/FadeUp";

export const metadata = {
  title: 'Account Settings',
  description: 'Manage your StreamSaaS profile, password, and account preferences.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SettingsPage() {
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  if (!userId) {
    return <div>Unauthorized</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true }
  });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <FadeUp duration={0.6}>
        <div className="mb-12">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Account Settings</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your profile and account preferences.</p>
        </div>
      </FadeUp>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <SettingsClient initialUser={user} />
        
        {/* Support/Security Info */}
        <FadeUp delay={0.2}>
          <div className="card" style={{ background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)' }}>
            <h3 className="mb-4" style={{ fontSize: '1.25rem' }}>Security & Privacy</h3>
            <p className="mb-4" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Your account is protected with industry-standard encryption. We never share your personal data with third parties.
            </p>
            <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent)' }}>Pro Tip</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Use a strong, unique password for your account to ensure maximum security.</p>
            </div>
            
            <div className="mt-8 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
              <h4 className="mb-2" style={{ fontSize: '1rem' }}>Need Help?</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                If you have questions about your account or subscriptions, contact our support team.
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
