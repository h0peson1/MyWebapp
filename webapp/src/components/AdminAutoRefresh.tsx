'use client';

import { usePathname } from 'next/navigation';
import AutoRefresh from '@/components/AutoRefresh';

export default function AdminAutoRefresh() {
  const pathname = usePathname();

  // Avoid refreshing on the admin login page to prevent resetting typed credentials
  if (pathname === '/admin') {
    return null;
  }

  return <AutoRefresh intervalMs={30000} />;
}
