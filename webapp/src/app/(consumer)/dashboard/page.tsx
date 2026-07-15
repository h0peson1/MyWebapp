import { headers } from "next/headers";
import Link from "next/link";
import prisma from "@/lib/db";
import GoogleIcon from "@/components/icons/GoogleIcon";
import FadeUp from "@/components/motion/FadeUp";
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerGroup";
import AutoRefresh from "@/components/AutoRefresh";

export const metadata = {
  title: 'Dashboard',
  description: 'View active subscriptions, recent payments, and delivery status in your StreamSaaS dashboard.',
  robots: {
    index: false,
    follow: false,
  },
};

type DashboardSubscription = {
  id: string;
  status: string;
  expiryDate: string | Date;
  productName: string;
  plan: string;
  accessDetails: string | null;
};

type DashboardPayment = {
  id: string;
  productId: string;
  status: string;
  rejectionReason: string | null;
  createdAt: Date;
};

function hasPaymentDelegate(client: typeof prisma): client is typeof prisma & {
  payment: {
    findMany: (args: {
      where: { userId: string };
      select: {
        id: true;
        productId: true;
        status: true;
        rejectionReason: true;
        createdAt: true;
      };
      orderBy: { createdAt: 'desc' };
      take: number;
    }) => Promise<DashboardPayment[]>;
  };
} {
  return Boolean((client as { payment?: unknown }).payment);
}

export default async function DashboardPage() {
  const headersList = await headers();
  const userId = headersList.get("x-user-id");
  let subscriptions: DashboardSubscription[] = [];
  let recentPayments: DashboardPayment[] = [];
  let userName = "User";
  
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true }
    });
    if (user) userName = user.name;

    // 1. AUTO EXPIRY PRUNING (CRITICAL SECURITY)
    // Purges any theoretically active subscriptions that naturally surpassed their expiry.
    await prisma.subscription.updateMany({
      where: {
        userId: userId,
        status: 'active',
        expiryDate: { lt: new Date() }
      },
      data: { status: 'inactive' }
    });

    // 2. FETCH ALL HISTORICAL SUBSCRIPTIONS
    // We intentionally load the active AND inactive history so users can visualize past invoices and renew them.
    subscriptions = await prisma.subscription.findMany({
      where: { userId },
      orderBy: { expiryDate: 'desc' }
    });

    recentPayments = hasPaymentDelegate(prisma)
      ? await prisma.payment.findMany({
        where: { userId },
        select: {
          id: true,
          productId: true,
          status: true,
          rejectionReason: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      })
      : await prisma.$queryRaw<DashboardPayment[]>`
          SELECT
            "id",
            "productId",
            "status",
            "rejectionReason",
            "createdAt"
          FROM "Payment"
          WHERE "userId" = ${userId}
          ORDER BY "createdAt" DESC
          LIMIT 5
        `;
  }

  const activeCount = subscriptions.filter(s => s.status === 'active').length;
  const expiredCount = subscriptions.filter(s => s.status !== 'active').length;

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <AutoRefresh intervalMs={5000} />
      <FadeUp duration={0.6}>
        <section className="premium-panel" style={{ padding: '1.5rem' }}>
          <span className="section-kicker"><GoogleIcon name="shield" size={14} /> Account Command Center</span>
          <h1 style={{ fontSize: '2.25rem', margin: '0.8rem 0 0.45rem' }}>Welcome back, {userName}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track every active plan, renewal, and delivery detail from one place.</p>
        </section>
      </FadeUp>

      <StaggerContainer className="grid-3">
        <StaggerItem>
          <article className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--accent-soft)', color: 'var(--accent)', borderRadius: '10px', display: 'grid', placeItems: 'center' }}>
                <GoogleIcon name="bolt" size={24} />
              </div>
              <h3 style={{ fontSize: '1rem' }}>Active Plans</h3>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 700 }}>{activeCount}</p>
          </article>
        </StaggerItem>
        <StaggerItem>
          <article className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', borderRadius: '10px', display: 'grid', placeItems: 'center' }}>
                <GoogleIcon name="schedule" size={24} />
              </div>
              <h3 style={{ fontSize: '1rem' }}>Expired</h3>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 700 }}>{expiredCount}</p>
          </article>
        </StaggerItem>
        <StaggerItem>
          <article className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', borderRadius: '10px', display: 'grid', placeItems: 'center' }}>
                <GoogleIcon name="shield" size={24} />
              </div>
              <h3 style={{ fontSize: '1rem' }}>Account Status</h3>
            </div>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>Verified User</p>
          </article>
        </StaggerItem>
      </StaggerContainer>

      <FadeUp delay={0.15}>
        <section className="card" style={{ gap: '0.8rem' }}>
          <h2 className="card-title">Recent Payment Submissions</h2>
          {recentPayments.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No payment submissions yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {recentPayments.map((payment) => {
                const orderShortId = payment.id.slice(0, 6).toUpperCase();
                
                let displayStatus = payment.status;
                let statusColor = '#d97706'; // default orange/gold

                if (payment.status === 'Payment Submitted') {
                  displayStatus = 'Submitted (Pending)';
                  statusColor = '#eab308';
                } else if (payment.status === 'Payment Verified') {
                  displayStatus = 'Payment Verified';
                  statusColor = '#10b981';
                } else if (payment.status === 'Processing') {
                  displayStatus = 'Processing Activation';
                  statusColor = '#3b82f6';
                } else if (payment.status === 'Delivered') {
                  displayStatus = 'Delivered & Active';
                  statusColor = '#22c55e';
                } else if (payment.status === 'Verification Required') {
                  displayStatus = 'Action Required';
                  statusColor = '#ef4444';
                } else if (payment.status === 'rejected') {
                  displayStatus = 'Rejected';
                  statusColor = '#ef4444';
                } else if (payment.status === 'pending') {
                  displayStatus = 'Pending Verification';
                  statusColor = '#d97706';
                }

                return (
                  <div key={payment.id} style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '0.75rem 0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.8rem' }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span>{payment.productId}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 500 }}>(Order: SS-{orderShortId})</span>
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        Submitted {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                      {['Verification Required', 'rejected'].includes(payment.status) && payment.rejectionReason && (
                        <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.25rem', fontWeight: 600 }}>
                          Details: {payment.rejectionReason}
                        </p>
                      )}
                    </div>
                    <span style={{ color: statusColor, fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      {displayStatus}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </FadeUp>
      
      {subscriptions.length === 0 ? (
        <FadeUp delay={0.3}>
          <div className="premium-panel" style={{ maxWidth: '560px', margin: '1rem auto', textAlign: 'center', padding: '2rem 1.5rem' }}>
            <GoogleIcon name="error" size={48} style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', margin: '0 auto' }} />
            <p className="card-desc" style={{ fontSize: '1.2rem', marginBottom: '2.5rem', marginTop: '1.5rem' }}>You have no active subscriptions yet.</p>
            <Link href="/pricing" className="btn btn-primary" style={{ display: 'inline-flex', padding: '1rem 2rem' }}>Go to Pricing</Link>
          </div>
        </FadeUp>
      ) : (
        <div>
          <h2 style={{ color: 'var(--text-muted)', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.9rem' }}>
            <GoogleIcon name="credit_card" size={24} /> Your Subscriptions
          </h2>
          <StaggerContainer className="grid-2">
            {subscriptions.map(sub => {
              const isActive = sub.status === 'active';
              const daysLeft = Math.ceil((new Date(sub.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                 <StaggerItem key={sub.id}>
                   <div className="card" style={{ borderColor: isActive ? 'rgba(16, 185, 129, 0.45)' : 'rgba(239, 68, 68, 0.35)' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                        <div>
                          <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>{sub.productName}</h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Tier: <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{sub.plan}</span></p>
                        </div>
                        <span style={{ 
                           background: isActive ? 'rgba(16, 185, 129, 0.16)' : 'rgba(239, 68, 68, 0.16)', 
                           color: isActive ? '#10b981' : '#ef4444', 
                           padding: '0.3rem 0.8rem', 
                           borderRadius: '999px', 
                           fontSize: '0.72rem', 
                           fontWeight: 700,
                           alignSelf: 'start',
                           textTransform: 'uppercase',
                           letterSpacing: '0.05em'
                        }}>
                           {isActive ? 'Active' : 'Expired'}
                        </span>
                     </div>
                     
                     <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '0.8rem' }}>
                       <div>
                         <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Expiry Date</p>
                         <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>
                           <GoogleIcon name="calendar_today" size={16} /> {new Date(sub.expiryDate).toLocaleDateString()}
                         </p>
                       </div>
                       {isActive && (
                         <div>
                           <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Time Left</p>
                           <p style={{ fontWeight: '600', color: daysLeft <= 3 ? '#ef4444' : 'var(--text-main)' }}>
                             {daysLeft} Days
                           </p>
                         </div>
                       )}
                     </div>
                     
                     <div style={{ marginTop: 'auto', padding: '1rem', background: 'var(--bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                       {isActive ? (
                         <details style={{ cursor: 'pointer' }}>
                           <summary className="btn btn-primary" style={{ display: 'flex', width: '100%', outline: 'none', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', listStyle: 'none' }}>
                             <GoogleIcon name="shield" size={18} /> Access Details
                           </summary>
                           
                           <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '0.9rem' }}>
                             <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                               <GoogleIcon name="lock" size={16} /> <strong>Private Access Provided:</strong>
                             </p>
                             
                             <div style={{ 
                                fontFamily: 'monospace', 
                                background: '#1a1917', 
                                padding: '1rem', 
                                borderRadius: '8px', 
                                border: '1px solid #413730',
                                wordBreak: 'break-word', 
                                fontSize: '0.84rem', 
                                whiteSpace: 'pre-wrap',
                                color: '#f4eee8'
                             }}>
                               {sub.accessDetails || 'Awaiting Account Delivery: An admin is assigning your slot shortly.'}
                             </div>
                             
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.85rem' }}>
                               <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Receipt: {sub.id.substring(0, 12)}</span>
                               {sub.productName.toLowerCase().includes('apple') || sub.productName.toLowerCase().includes('icloud') ? (
                                 <a 
                                   href={`https://wa.me/233203728932?text=${encodeURIComponent(`Hello StreamSaaS,\n\nI need help with my active ${sub.productName} (${sub.plan}) subscription.\n\nReceipt: ${sub.id.substring(0, 12)}`)}`}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   style={{ color: '#25D366', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', fontWeight: 700 }}
                                 >
                                   <GoogleIcon name="open_in_new" size={12} /> WhatsApp Help
                                 </a>
                               ) : (
                                 <button style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                   <GoogleIcon name="open_in_new" size={12} /> Help
                                 </button>
                               )}
                             </div>
                           </div>
                         </details>
                       ) : (
                         <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>Subscription expired — renew to continue</p>
                            <Link href="/pricing" className="btn btn-secondary btn-full" style={{ fontSize: '0.85rem' }}>Renew Plan</Link>
                         </div>
                       )}
                     </div>
                     
                   </div>
                 </StaggerItem>
              );
            })}
          </StaggerContainer>
          <FadeUp delay={0.5}>
            <div className="text-center" style={{ marginTop: '1.2rem' }}>
               <Link href="/pricing" className="btn btn-secondary" style={{ padding: '0.9rem 1.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>Browse More Plans <GoogleIcon name="arrow_forward" size={14} /></Link>
            </div>
          </FadeUp>
        </div>
      )}
    </div>
  );
}
