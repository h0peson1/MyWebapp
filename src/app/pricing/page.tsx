"use client";

import { useState } from "react";
import FadeUp from '@/components/motion/FadeUp';
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerGroup';

export default function PricingPage() {
  const [processing, setProcessing] = useState<string | null>(null);

  const handleSubscribe = async (product_name: string, plan: string) => {
    setProcessing(`${product_name}-${plan}`);
    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_name, plan })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/login'; // Force login
          return;
        }
        throw new Error(data.error || "Failed to initialize payment");
      }
      
      if (data.authorization_url) {
        // Redirect completely to Paystack
        window.location.href = data.authorization_url;
      }
    } catch (err: any) {
      alert("Error: " + err.message);
      setProcessing(null);
    }
  };

  const isBtnDisabled = (id: string) => processing !== null;

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <FadeUp duration={0.4}>
        <div className="text-center" style={{ padding: '4rem 0 2rem' }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 1rem', lineHeight: '1' }}>Pricing Plans</h1>
          <p style={{ color: 'var(--text-muted)' }}>Choose the subscriptions that fit your lifestyle.</p>
        </div>
      </FadeUp>

      <StaggerContainer className="grid-3">
        {/* PRODUCT 1 */}
        <StaggerItem>
          <div className="card">
            <div>
              <div className="card-header"><h3 className="card-title">Netflix Premium</h3></div>
              <p className="card-desc">Unlimited movies and TV shows ad-free, in brilliant 4K.</p>
              <div className="card-price">$4.99<span>/month</span></div>
            </div>
            <button onClick={() => handleSubscribe('Netflix', 'Premium')} disabled={isBtnDisabled('Netflix-Premium')} className="btn btn-primary btn-full">
               {processing === 'Netflix-Premium' ? 'Loading...' : 'Select Plan'}
            </button>
          </div>
        </StaggerItem>

        {/* PRODUCT 2 */}
        <StaggerItem>
          <div className="card">
            <div>
              <div className="card-header"><h3 className="card-title">Amazon Prime Video</h3></div>
              <p className="card-desc">Amazon Originals and huge library of movies & shows.</p>
              <div className="card-price">$3.99<span>/month</span></div>
            </div>
            <button onClick={() => handleSubscribe('Amazon Prime Video', 'Standard')} disabled={isBtnDisabled('Amazon Prime Video-Standard')} className="btn btn-primary btn-full">
              {processing === 'Amazon Prime Video-Standard' ? 'Loading...' : 'Select Plan'}
            </button>
          </div>
        </StaggerItem>

        {/* PRODUCT 3 */}
        <StaggerItem>
          <div className="card">
            <div>
              <div className="card-header"><h3 className="card-title">Snapchat+</h3></div>
              <p className="card-desc">Exclusive, experimental, and pre-release app features.</p>
              <div className="card-price">$1.99<span>/month</span></div>
            </div>
            <button onClick={() => handleSubscribe('Snapchat+', 'Premium')} disabled={isBtnDisabled('Snapchat+-Premium')} className="btn btn-primary btn-full">
              {processing === 'Snapchat+-Premium' ? 'Loading...' : 'Select Plan'}
            </button>
          </div>
        </StaggerItem>

        {/* PRODUCT 4 */}
        <StaggerItem>
          <div className="card">
            <div>
              <div className="card-header"><h3 className="card-title">Apple Music</h3></div>
              <p className="card-desc">Lossless audio and millions of songs streaming ad-free.</p>
              <div className="card-price">$4.49<span>/month</span></div>
            </div>
            <button onClick={() => handleSubscribe('Apple Music', 'Standard')} disabled={isBtnDisabled('Apple Music-Standard')} className="btn btn-primary btn-full">
              {processing === 'Apple Music-Standard' ? 'Loading...' : 'Select Plan'}
            </button>
          </div>
        </StaggerItem>

        {/* PRODUCT 5 */}
        <StaggerItem>
          <div className="card">
            <div>
              <div className="card-header"><h3 className="card-title">DStv Premium</h3></div>
              <p className="card-desc">The ultimate television entertainment experience.</p>
              <div className="card-price">$12.99<span>/month</span></div>
            </div>
            <button onClick={() => handleSubscribe('DStv Premium', 'Premium')} disabled={isBtnDisabled('DStv Premium-Premium')} className="btn btn-primary btn-full">
              {processing === 'DStv Premium-Premium' ? 'Loading...' : 'Select Plan'}
            </button>
          </div>
        </StaggerItem>

        {/* PRODUCT 6 */}
        <StaggerItem>
          <div className="card">
            <div>
              <div className="card-header"><h3 className="card-title">Apple TV+</h3></div>
              <p className="card-desc">Award-winning Apple Original series and films.</p>
              <div className="card-price">$3.49<span>/month</span></div>
            </div>
            <button onClick={() => handleSubscribe('Apple TV+', 'Standard')} disabled={isBtnDisabled('Apple TV+-Standard')} className="btn btn-primary btn-full">
              {processing === 'Apple TV+-Standard' ? 'Loading...' : 'Select Plan'}
            </button>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* ☁️ iCloud SPECIAL SECTION */}
      <FadeUp delay={0.2} duration={0.5}>
        <section className="mt-8 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="text-center mb-8">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>☁️ iCloud Storage</h2>
            <p style={{ color: 'var(--text-muted)' }}>Securely store your photos, videos, and documents.</p>
          </div>

          <StaggerContainer className="grid-3">
            <StaggerItem>
              <div className="card" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                <div>
                  <div className="card-header"><h3 className="card-title">50 GB Storage</h3></div>
                  <p className="card-desc">Perfect for essential backups and photos.</p>
                  <div className="card-price">$0.99<span>/month</span></div>
                </div>
                <button onClick={() => handleSubscribe('iCloud', '50GB')} disabled={isBtnDisabled('iCloud-50GB')} className="btn btn-secondary btn-full">
                  {processing === 'iCloud-50GB' ? 'Loading...' : 'Select'}
                </button>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="card" style={{ border: '2px solid var(--accent)', transform: 'scale(1.02)' }}>
                <div>
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h3 className="card-title">200 GB Storage</h3>
                    <span style={{ fontSize: '0.75rem', background: 'var(--accent)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>POPULAR</span>
                  </div>
                  <p className="card-desc">Great for families and active media shooters.</p>
                  <div className="card-price">$2.99<span>/month</span></div>
                </div>
                <button onClick={() => handleSubscribe('iCloud', '200GB')} disabled={isBtnDisabled('iCloud-200GB')} className="btn btn-primary btn-full">
                  {processing === 'iCloud-200GB' ? 'Loading...' : 'Select'}
                </button>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="card" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                <div>
                  <div className="card-header"><h3 className="card-title">2 TB Storage</h3></div>
                  <p className="card-desc">Maximum capacity for heavy users and families.</p>
                  <div className="card-price">$9.99<span>/month</span></div>
                </div>
                <button onClick={() => handleSubscribe('iCloud', '2TB')} disabled={isBtnDisabled('iCloud-2TB')} className="btn btn-secondary btn-full">
                  {processing === 'iCloud-2TB' ? 'Loading...' : 'Select'}
                </button>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </section>
      </FadeUp>

    </div>
  );
}
