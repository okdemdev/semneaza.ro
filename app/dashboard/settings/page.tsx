import { requireUser } from '@/lib/requireUser';
import { UserCircle } from 'lucide-react';

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg">
        {/* Header */}
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Setări cont</h3>
          <p className="mt-1 text-sm text-gray-500">Informații despre contul tău și preferințe.</p>
        </div>

        {/* User Info */}
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.given_name || 'Profile picture'}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <UserCircle className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">
                {user.given_name} {user.family_name}
              </h4>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Account Details */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <dl className="divide-y divide-gray-200">
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Nume complet</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {user.given_name} {user.family_name}
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user.email}</dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">ID Utilizator</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user.id}</dd>
              </div>
            </dl>
          </div>

          {/* Account Settings */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Preferințe cont</h4>
            <p className="text-sm text-gray-500">
              Opțiunile de modificare a setărilor contului vor fi disponibile în curând.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
