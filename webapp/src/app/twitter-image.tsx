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
          background: 'linear-gradient(135deg, #F9F7F0 0%, #FFFFFF 55%, #18B7BE 100%)',
          color: '#0B252C',
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, color: '#178CA4', marginBottom: 18 }}>StreamSaaS</div>
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