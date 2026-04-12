import { headers } from "next/headers";
import Link from "next/link";
import prisma from "@/lib/db";

export default async function DashboardPage() {
  const headersList = await headers();
  const userId = headersList.get("x-user-id");
  const userEmail = headersList.get("x-user-email") || "User";

  let subscriptions: any[] = [];
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
  }

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <h1 className="mb-8" style={{ fontSize: '2.5rem' }}>HELLO {userName.toUpperCase()}</h1>
      
      {subscriptions.length === 0 ? (
        <div className="card" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '3rem 2rem' }}>
          <p className="card-desc" style={{ fontSize: '1.2rem', marginBottom: '2.5rem' }}>You have no active subscriptions yet.</p>
          <Link href="/pricing" className="btn btn-primary" style={{ display: 'inline-flex', padding: '1rem 2rem' }}>Go to Pricing</Link>
        </div>
      ) : (
        <div>
          <h2 className="mb-4" style={{ color: 'var(--text-muted)', fontSize: '1.5rem' }}>Your Subscriptions</h2>
          <div className="grid-2">
            {subscriptions.map(sub => {
              const isActive = sub.status === 'active';
              
              return (
                 <div key={sub.id} className="card" style={{ 
                    borderLeft: isActive ? '4px solid #10b981' : '4px solid #ef4444', 
                    opacity: isActive ? 1 : 0.85 
                 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h3 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{sub.productName}</h3>
                      <span style={{ 
                         background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', 
                         color: isActive ? '#10b981' : '#ef4444', 
                         padding: '0.25rem 0.75rem', 
                         borderRadius: '1rem', 
                         fontSize: '0.8rem', 
                         fontWeight: 'bold',
                         alignSelf: 'start'
                      }}>
                        {isActive ? 'Active' : 'Expired'}
                      </span>
                   </div>
                   
                   <p className="card-desc" style={{ color: 'var(--text-main)', marginTop: '0.25rem', marginBottom: '0.25rem'}}>Tier: <strong>{sub.plan}</strong></p>
                   
                   <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                     Expires: {new Date(sub.expiryDate).toLocaleDateString()}
                   </div>
                   
                   {/* PREMIUM CONTENT GATE */}
                   <div style={{ 
                      marginTop: 'auto', 
                      padding: '1.25rem', 
                      background: 'var(--bg)', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border)' 
                   }}>
                     {isActive ? (
                       <details style={{ cursor: 'pointer' }}>
                         <summary className="btn btn-primary" style={{ display: 'block', width: '100%', outline: 'none', textAlign: 'center' }}>👉 Access Details</summary>
                         
                         <div style={{ marginTop: '1.25rem', borderTop: '1px dashed var(--border)', paddingTop: '1rem' }}>
                           <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>🔒 <strong>Private Access Provided:</strong></p>
                           
                           <div style={{ 
                              fontFamily: 'monospace', 
                              background: '#040405', 
                              padding: '1rem', 
                              borderRadius: '6px', 
                              border: '1px solid #333',
                              wordBreak: 'break-word', 
                              fontSize: '0.9rem', 
                              whiteSpace: 'pre-wrap',
                              color: '#4ade80' 
                            }}>
                             {sub.accessDetails || 'Awaiting Account Delivery: An admin is assigning your slot shortly.'}
                           </div>
                           
                           <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'right' }}>Receipt: {sub.id.substring(0, 12)}</p>
                         </div>
                       </details>
                     ) : (
                       <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Subscription expired — renew to continue</p>
                          <Link href="/pricing" className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}>Renew Plan</Link>
                       </div>
                     )}
                   </div>
                   
                 </div>
              );
            })}
          </div>
          <div className="mt-8">
             <Link href="/pricing" className="btn btn-secondary">Browse More Plans &rarr;</Link>
          </div>
        </div>
      )}
    </div>
  );
}
