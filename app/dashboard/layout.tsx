import { requireUser } from '@/lib/requireUser';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader';
import DashboardNav from '@/app/components/dashboard/DashboardNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader user={user} />
      <DashboardNav />
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
