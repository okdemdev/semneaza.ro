'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderIcon, HomeIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Foldere', href: '/dashboard/folders', icon: FolderIcon },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
          <Link
            href="/dashboard/settings"
            className={`${
              pathname === '/dashboard/settings'
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            } px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2`}
          >
            <Cog6ToothIcon className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
