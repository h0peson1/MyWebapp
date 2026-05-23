import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: '64px',
          background: 'linear-gradient(135deg, #161413 0%, #2b2521 56%, #dc6a1f 100%)',
          color: '#fffaf4',
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em' }}>StreamSaaS</div>
          <div style={{ fontSize: 18, opacity: 0.9 }}>Premium subscription delivery</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 820 }}>
          <div style={{ fontSize: 70, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.05em' }}>
            Buy, verify, and manage subscriptions in one secure place.
          </div>
          <div style={{ marginTop: 28, fontSize: 28, lineHeight: 1.4, maxWidth: 720, color: 'rgba(255, 250, 244, 0.88)' }}>
            Fast access delivery, manual proof review, and a clean dashboard experience.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 18, fontSize: 20, opacity: 0.95 }}>
          <span>Secure checkout</span>
          <span>•</span>
          <span>Proof upload</span>
          <span>•</span>
          <span>Admin review</span>
        </div>
      </div>
    ),
    size,
  );
}