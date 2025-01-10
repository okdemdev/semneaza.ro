import { requireUser } from '@/lib/requireUser';
import { getFoldersByUser } from '@/app/actions/folderActions';
import { getDocumentsByUser } from '@/app/actions/documentActions';
import RecentDocuments from '@/app/components/dashboard/RecentDocuments';
import DashboardStats from '@/app/components/dashboard/DashboardStats';
import RecentActivity from '@/app/components/dashboard/RecentActivity';
import FolderCards from '@/app/components/dashboard/FolderCards';

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

  // Calculate statistics
  const totalDocuments = documents.length;
  const signedDocuments = documents.filter((doc) => doc.status === 'signed').length;
  const totalFolders = folders.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Welcome Message */}
          <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Bine ai revenit, {user.given_name}!
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Aici poți vedea toate documentele și activitățile tale recente.
              </p>
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>

          {/* Stats Section */}
          <DashboardStats
            totalDocuments={totalDocuments}
            signedDocuments={signedDocuments}
            totalFolders={totalFolders}
          />

          {/* Folders Section */}
          <FolderCards folders={folders} />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Recent Activity */}
            <RecentActivity
              folders={folders.slice(0, 5).map((folder) => ({
                id: folder.id,
                name: folder.name,
                createdAt: folder.createdAt.toISOString(),
              }))}
              documents={recentDocuments}
            />

            {/* Recent Documents */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Documente recente</h2>
              <RecentDocuments documents={recentDocuments} userId={user.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
