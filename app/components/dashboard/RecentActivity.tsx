import Link from 'next/link';
import { FolderIcon } from '@heroicons/react/24/outline';
import { FileText, Clock } from 'lucide-react';

interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

interface Document {
  id: string;
  title: string;
  createdAt: string;
  folder: {
    id: string;
    name: string;
  } | null;
}

interface RecentActivityProps {
  folders: Folder[];
  documents: Document[];
}

export default function RecentActivity({ folders, documents }: RecentActivityProps) {
  // Combine folders and documents into a single timeline
  const activities = [
    ...folders.map((folder) => ({
      type: 'folder' as const,
      id: folder.id,
      title: folder.name,
      createdAt: new Date(folder.createdAt),
    })),
    ...documents.map((doc) => ({
      type: 'document' as const,
      id: doc.id,
      title: doc.title,
      createdAt: new Date(doc.createdAt),
      folderId: doc.folder?.id,
      folderName: doc.folder?.name,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5); // Show only last 5 activities

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow">
      <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Activitate recentă</h3>
      </div>
      <ul role="list" className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <li key={`${activity.type}-${activity.id}`} className="px-4 py-4 sm:px-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {activity.type === 'folder' ? (
                  <FolderIcon className="h-6 w-6 text-blue-500" />
                ) : (
                  <FileText className="h-6 w-6 text-blue-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {activity.type === 'folder' ? (
                    <Link
                      href={`/dashboard/folders/${activity.id}`}
                      className="hover:text-blue-600"
                    >
                      {activity.title}
                    </Link>
                  ) : (
                    <span>{activity.title}</span>
                  )}
                </p>
                <p className="truncate text-sm text-gray-500">
                  {activity.type === 'document' && activity.folderName && (
                    <span>în folderul {activity.folderName}</span>
                  )}
                </p>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="mr-1.5 h-4 w-4 flex-shrink-0" />
                <time dateTime={activity.createdAt.toISOString()}>
                  {activity.createdAt.toLocaleDateString('ro-RO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
