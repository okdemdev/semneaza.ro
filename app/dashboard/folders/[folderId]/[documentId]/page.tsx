import { getDocument, deleteDocument } from '@/app/actions/documentActions';
import { requireUser } from '@/lib/requireUser';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DocumentPage({
  params,
}: {
  params: { folderId: string; documentId: string };
}) {
  const user = await requireUser();
  const document = await getDocument(user.id, params.documentId);

  async function handleDelete() {
    'use server';

    const user = await requireUser();
    await deleteDocument(user.id, params.documentId);
    redirect(`/dashboard/folders/${params.folderId}`);
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <Link
          href={`/dashboard/folders/${params.folderId}`}
          className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
        >
          ← Back to Folder
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold mt-2">{document.title}</h1>
          <form action={handleDelete}>
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Delete Document
            </button>
          </form>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Email</h2>
          <p className="text-gray-600">{document.email}</p>
        </div>
        <div className="text-sm text-gray-500 mt-4">
          Created {new Date(document.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
