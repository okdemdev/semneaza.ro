import { getFolder } from '@/app/actions/folderActions';
import { getDocumentsByFolder, deleteDocument } from '@/app/actions/documentActions';
import { requireUser } from '@/lib/requireUser';
import Link from 'next/link';

export default async function FolderPage({ params }: { params: { folderId: string } }) {
  const user = await requireUser();
  const folder = await getFolder(params.folderId, user.id);
  const documents = await getDocumentsByFolder(user.id, params.folderId);

  async function handleDeleteDocument(documentId: string) {
    'use server';
    const user = await requireUser();
    await deleteDocument(user.id, documentId);
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <Link
          href="/dashboard/folders"
          className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
        >
          ← Back to Folders
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold mt-2">{folder.name}</h1>
          <Link
            href={`/dashboard/folders/${folder.id}/createDocument`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Create Document
          </Link>
        </div>
        <p className="text-gray-600 mt-2">{folder.description}</p>
        <div className="text-sm text-gray-500 mt-2">
          Created {new Date(folder.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Documents</h2>
        {documents.length === 0 ? (
          <p className="text-gray-500">No documents yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {documents.map((document) => (
              <div
                key={document.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <Link href={`/dashboard/folders/${folder.id}/${document.id}`} className="block">
                  <h3 className="text-lg font-semibold hover:text-indigo-600">{document.title}</h3>
                  <p className="text-gray-600">Email: {document.email}</p>
                </Link>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Created {new Date(document.createdAt).toLocaleDateString()}
                  </span>
                  <form action={handleDeleteDocument.bind(null, document.id)}>
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
    </div>
  );
}
