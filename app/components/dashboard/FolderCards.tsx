import Link from 'next/link';
import { FolderIcon } from '@heroicons/react/24/outline';

interface Folder {
  id: string;
  name: string;
  description: string;
}

interface FolderCardsProps {
  folders: Folder[];
}

export default function FolderCards({ folders }: FolderCardsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Cu ce folder lucrezi astăzi?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {folders.map((folder) => (
          <Link
            key={folder.id}
            href={`/dashboard/folders/${folder.id}`}
            className="group relative bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-blue-500 transition-all duration-200 hover:shadow-lg"
          >
            <div className="absolute -top-3 -left-3 bg-blue-500 rounded-lg p-3 shadow-lg transform group-hover:scale-110 transition-transform duration-200">
              <FolderIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-8 mt-4">
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {folder.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">{folder.description}</p>
              <div className="mt-4 flex items-center text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Deschide folderul →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
