import { getFoldersByUser, deleteFolder } from '@/app/actions/folderActions';
import { requireUser } from '@/lib/requireUser';
import Link from 'next/link';

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
        <p className="text-gray-500">You haven't created any folders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <Link href={`/dashboard/folders/${folder.id}`} className="block">
                <h2 className="text-xl font-semibold mb-2 hover:text-indigo-600">{folder.name}</h2>
                <p className="text-gray-600">{folder.description}</p>
              </Link>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Created {new Date(folder.createdAt).toLocaleDateString()}
                </span>
                <form action={handleDelete.bind(null, folder.id)}>
                  <button type="submit" className="text-red-600 hover:text-red-800 font-medium">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
