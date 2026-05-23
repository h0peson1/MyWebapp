import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          padding: '72px',
          background: 'linear-gradient(135deg, #fffdf7 0%, #f6e7d8 50%, #dc6a1f 100%)',
          color: '#221812',
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, color: '#dc6a1f', marginBottom: 18 }}>StreamSaaS</div>
        <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.05, maxWidth: 900 }}>
          Secure subscription delivery with clear payment proof and account control.
        </div>
        <div style={{ marginTop: 24, fontSize: 26, color: 'rgba(34, 24, 18, 0.8)', maxWidth: 820 }}>
          Fast onboarding, verified access, and a simple admin review workflow.
        </div>
      </div>
    ),
    size,
  );
}