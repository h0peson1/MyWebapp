import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, ".."),
  serverExternalPackages: ['ws'],
  turbopack: {
    root: path.join(__dirname, ".."),
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            // Allows self, inline styles/scripts, Vercel Analytics, Cloudinary images, Paystack connection endpoints, and Google Fonts
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://res.cloudinary.com https://*.cloudinary.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://va.vercel-scripts.com https://api.cloudinary.com https://api.paystack.co; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

