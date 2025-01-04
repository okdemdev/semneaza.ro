import { getFolder } from '@/app/actions/folderActions';
import { requireUser } from '@/lib/requireUser';
import Link from 'next/link';

export default async function FolderPage({ params }: { params: { folderId: string } }) {
  const user = await requireUser();
  const folder = await getFolder(params.folderId, user.id);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <Link
          href="/dashboard/folders"
          className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
        >
          ← Back to Folders
        </Link>
        <h1 className="text-3xl font-bold mt-2">{folder.name}</h1>
        <p className="text-gray-600 mt-2">{folder.description}</p>
        <div className="text-sm text-gray-500 mt-2">
          Created {new Date(folder.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
