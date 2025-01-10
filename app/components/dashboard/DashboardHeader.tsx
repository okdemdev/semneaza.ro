import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { User } from '@kinde-oss/kinde-auth-nextjs/dist/types';

interface DashboardHeaderProps {
  user: User;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Bine ai venit, {user.given_name}</h1>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-4">{user.email}</span>
            <LogoutLink className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Deconectare
            </LogoutLink>
          </div>
        </div>
      </div>
    </header>
  );
}
