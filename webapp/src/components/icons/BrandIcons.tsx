import React from 'react';

export const NetflixIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#E50914" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.648 0H10l.006 17.525L18.352 0H24v24h-4.352v-17.525L11.296 24H5.648V0z"/>
  </svg>
);

export const AppleIcon = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.05 20.28c-.96.95-1.95 1.72-3.08 1.72-1.11 0-1.4-.68-2.67-.68s-1.61.66-2.67.68c-1.11 0-2.2-.82-3.13-1.77-1.91-1.94-3.32-5.46-3.32-8.08 0-4.04 2.53-6.17 4.96-6.17a3.84 3.84 0 0 1 2.92 1.35c.42.34.8.74 1.15 1.15.35-.41.73-.81 1.15-1.15a3.84 3.84 0 0 1 2.92-1.35c1.47 0 2.76.78 3.5 1.95a5.53 5.53 0 0 0-.66.04c-1.85.34-2.85 1.96-2.85 3.75 0 2 1.25 3.51 3.01 4.14-.3.94-.74 1.83-1.3 2.62v.45M12.03 5.07c0-2.31 1.9-4.23 4.26-4.23.03 0 .07 0 .1.01-.22 2.31-2.12 4.21-4.26 4.21-.03 0-.07 0-.1-.01v.02Z"/>
  </svg>
);

export const AppleMusicIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="url(#appleMusicGrad)" />
    <path d="M16.5 6.2v8.1c0 1.6-1.3 2.7-2.9 2.7-1.5 0-2.6-1.1-2.6-2.6 0-1.5 1.2-2.6 2.7-2.6.5 0 1 .1 1.4.4V8.4l-5 1.2v6.3c0 1.6-1.3 2.7-2.9 2.7-1.5 0-2.6-1.1-2.6-2.6 0-1.5 1.2-2.6 2.7-2.6.5 0 1 .1 1.4.4v-6c0-.8.6-1.4 1.4-1.6l5.7-1.4c.9-.2 1.8.4 1.8 1.4z" fill="#FFFFFF"/>
    <defs>
      <linearGradient id="appleMusicGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FA233B"/>
        <stop offset="1" stopColor="#FB5C74"/>
      </linearGradient>
    </defs>
  </svg>
);

export const AppleTvIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#1A1A1A" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
    <path d="M7.7 13.5c-.5.5-1 .9-1.6.9-.6 0-.8-.4-1.4-.4s-.8.3-1.4.4c-.6 0-1.1-.4-1.6-.9-1-1-1.7-2.8-1.7-4.2 0-2.1 1.3-3.2 2.5-3.2a2 2 0 0 1 1.5.7c.2.2.4.4.6.6.2-.2.4-.4.6-.6a2 2 0 0 1 1.5-.7c.8 0 1.4.4 1.8 1-.3.2-1.5 1-1.5 2.1 0 1.1.7 1.8 1.6 2.2-.2.5-.4 1-.7 1.4zM5.1 5.7c0-1.2 1-2.2 2.2-2.2.02 0 .04 0 .05 0-.1 1.2-1.1 2.2-2.2 2.2h-.05z" fill="#FFFFFF"/>
    <text x="11.2" y="14" fill="#FFFFFF" fontSize="8.5" fontWeight="800" fontFamily="sans-serif" letterSpacing="-0.5">tv+</text>
  </svg>
);

export const PrimeVideoIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#00A8E1"/>
    <path d="M6 10.5h1.8c1.3 0 2.2.7 2.2 1.8 0 1.2-.9 1.9-2.2 1.9H7.3v2.3H6v-6zm1.3 2.6h.4c.6 0 1-.3 1-.8 0-.6-.4-.8-1-.8h-.4v1.6zM11.5 11.8h1.2v.7c.3-.5.8-.8 1.4-.8.3 0 .5.1.7.2l-.4 1.2c-.3-.1-.5-.2-.7-.2-.6 0-1 .4-1 1.1v2.5h-1.2v-4.7zM16 11.8h1.2v4.7H16v-4.7zm0-1.7h1.2v1.2H16v-1.2z" fill="#FFFFFF"/>
    <path d="M5.5 18.2c2.8 1.3 7.8 1.4 11.8-.4.3-.1.6.2.3.5-3.6 2.2-8.6 2-12.4.4-.3-.1-.2-.5.3-.5z" fill="#FFFFFF"/>
    <path d="M17.6 17.5c.3.4.8.8 1.4.9.1 0 .2-.1.1-.2-.4-.4-.7-.9-.8-1.5-.1-.2-.3-.1-.4.1-.1.2-.2.5-.3.7z" fill="#FFFFFF"/>
  </svg>
);

export const DstvIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#0084CA"/>
    <path d="M4.5 7h4.8c2.8 0 4.7 1.9 4.7 5s-1.9 5-4.7 5H4.5V7zm3 7.4h1.7c1.4 0 2.3-.9 2.3-2.4s-.9-2.4-2.3-2.4H7.5v4.8z" fill="#FFFFFF"/>
    <path d="M14.5 13.8l1.5-1.5c1.1 1.1 2.3 1.6 3.5 1.6.8 0 1.2-.3 1.2-.7 0-.5-.5-.7-1.8-1.1-2-.6-3.2-1.3-3.2-2.8 0-1.6 1.4-2.8 3.5-2.8 1.4 0 2.6.5 3.5 1.3l-1.3 1.6c-.8-.7-1.7-1.1-2.4-1.1-.7 0-1.1.3-1.1.7 0 .5.4.7 1.8 1.1 2.1.6 3.2 1.4 3.2 2.8 0 1.8-1.4 2.9-3.7 2.9-1.8 0-3.3-.6-4.7-2z" fill="#FFFFFF" fillOpacity="0.9"/>
  </svg>
);

export const SnapchatIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width={size} height={size} rx="6" fill="#FFFC00"/>
    <path d="M12 4.5c-2.3 0-3.9 1.6-3.9 3.6 0 .3.1.7.2 1-1.9.7-3.2 2.4-3.2 4.4 0 .4.1.7.1 1.1-.6.3-.9.7-.9 1.2 0 .4.2.8.6 1.1.2.2.4.3.7.4 0 .1-.1.3-.1.4 0 .7.6 1.3 1.3 1.3 1 0 1.9-.6 2.6-1.9.4.1.8.2 1.2.2s.8-.1 1.2-.2c.7 1.3 1.6 1.9 2.6 1.9.7 0 1.3-.6 1.3-1.3 0-.1 0-.3-.1-.4.3-.1.5-.2.7-.4.4-.3.6-.7.6-1.1 0-.5-.3-.9-.9-1.2.1-.4.1-.7.1-1.1 0-2-1.4-3.8-3.2-4.4.1-.3.2-.7.2-1 0-2-1.6-3.6-3.9-3.6z" fill="#FFFFFF" stroke="#000000" strokeWidth="0.8"/>
  </svg>
);

export const ICloudIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="url(#icloudBg)" />
    <path d="M17.5 15.8h-10c-1.9 0-3.5-1.5-3.5-3.4 0-1.7 1.2-3.1 2.9-3.4.4-1.9 2.1-3.3 4.1-3.3 2 0 3.7 1.3 4.2 3.1.4-.2.9-.3 1.3-.3 1.9 0 3.5 1.6 3.5 3.5 0 2.1-1.1 3.8-2.5 3.8z" fill="#FFFFFF"/>
    <defs>
      <linearGradient id="icloudBg" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B99FC"/>
        <stop offset="1" stopColor="#0B63D6"/>
      </linearGradient>
    </defs>
  </svg>
);

export const MoMoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/><path d="M8 6h8"/><path d="M8 10h8"/><path d="M8 14h4"/>
  </svg>
);

export function getServiceIcon(product: string, size = 32) {
  const norm = product.toLowerCase();
  if (norm.includes('netflix')) return <NetflixIcon size={size} />;
  if (norm.includes('prime')) return <PrimeVideoIcon size={size} />;
  if (norm.includes('apple music')) return <AppleMusicIcon size={size} />;
  if (norm.includes('apple tv') || norm.includes('tv+')) return <AppleTvIcon size={size} />;
  if (norm.includes('dstv')) return <DstvIcon size={size} />;
  if (norm.includes('snapchat')) return <SnapchatIcon size={size} />;
  if (norm.includes('icloud')) return <ICloudIcon size={size} />;
  if (norm.includes('apple')) return <AppleIcon size={size} />;
  return null;
}
