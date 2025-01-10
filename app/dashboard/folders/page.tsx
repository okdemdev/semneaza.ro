import { getFoldersByUser, deleteFolder } from '@/app/actions/folderActions';
import { requireUser } from '@/lib/requireUser';
import Link from 'next/link';
import { FolderIcon } from '@heroicons/react/24/outline';
import EmptyFoldersDialog from '@/app/components/folders/EmptyFoldersDialog';

export default async function FoldersPage() {
  const user = await requireUser();
  const folders = await getFoldersByUser(user.id);

  async function handleDelete(folderId: string) {
    'use server';

    const user = await requireUser();
    await deleteFolder(folderId, user.id);
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Folders</h1>
        <Link
          href="/dashboard/folders/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Create New Folder
        </Link>
      </div>

      {folders.length === 0 ? (
        <EmptyFoldersDialog />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map((folder) => (
            <div key={folder.id} className="relative">
              <Link
                href={`/dashboard/folders/${folder.id}`}
                className="group relative block bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-blue-500 transition-all duration-200 hover:shadow-lg"
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
              <form action={handleDelete.bind(null, folder.id)} className="absolute top-4 right-4">
                <button type="submit" className="text-red-600 hover:text-red-800 font-medium">
                  Delete
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
