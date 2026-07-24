import AdminAutoRefresh from '@/components/AdminAutoRefresh';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout min-h-screen bg-transparent">
      <AdminAutoRefresh />
      {/* Admin specific header/sidebar can go here later */}
      <main>
        {children}
      </main>
    </div>
  );
}
