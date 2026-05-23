import type { Metadata } from 'next';
import AdminLoginClient from './AdminLoginClient';

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Secure login for the StreamSaaS admin panel.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}
