import { requireUser } from '@/lib/requireUser';
import { getFoldersByUser } from '@/app/actions/folderActions';
import { getDocumentsByUser } from '@/app/actions/documentActions';
import Link from 'next/link';
import { FolderIcon } from '@heroicons/react/24/outline';
import RecentDocuments from '@/app/components/dashboard/RecentDocuments';

interface Document {
  id: string;
  title: string;
  status: 'pending' | 'signed';
  createdAt: Date;
  email: string;
  folder: {
    id: string;
    name: string;
  } | null;
}

export default async function DashboardPage() {
  const user = await requireUser();
  const folders = await getFoldersByUser(user.id);
  const documents = await getDocumentsByUser(user.id);

  // Get the last 5 documents with their folder information
  const recentDocuments = documents.slice(0, 5).map((doc: Document) => ({
    id: doc.id,
    title: doc.title,
    status: doc.status,
    email: doc.email,
    createdAt: doc.createdAt.toISOString(),
    folder: doc.folder
      ? {
          id: doc.folder.id,
          name: doc.folder.name,
        }
      : null,
  }));

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Activitate recentă</h2>

        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Foldere recente</h3>
            {folders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {folders.slice(0, 3).map((folder) => (
                  <Link
                    key={folder.id}
                    href={`/dashboard/folders/${folder.id}`}
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
                  >
                    <FolderIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{folder.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Creat la {new Date(folder.createdAt).toLocaleDateString('ro-RO')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nu ai creat încă niciun folder.</p>
            )}

            <div className="mt-4">
              <Link
                href="/dashboard/folders"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Vezi toate folderele →
              </Link>
            </div>
          </div>

          <RecentDocuments documents={recentDocuments} userId={user.id} />
        </div>
      </div>
    </div>
  );
}
