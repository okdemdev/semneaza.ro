import { Button } from '@/components/ui/button';
import { getFolder } from '@/app/actions/folderActions';
import { getDocumentsByFolder } from '@/app/actions/documentActions';
import { requireUser } from '@/lib/requireUser';
import { AlertCircle, ArrowLeft, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import FolderDocumentsTable from '@/app/components/folder-documents-table';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ folderId: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function FolderPage({ params, searchParams }: Props) {
  const user = await requireUser();
  const { folderId } = await params;

  try {
    const folder = await getFolder(folderId, user.id);
    const documents = await getDocumentsByFolder(user.id, folderId);

    if (!folder) {
      throw new Error('Folder not found');
    }

    // Serialize the folder data
    const serializedFolder = {
      id: folder.id,
      name: folder.name,
      description: folder.description,
      userId: user.id,
    };

    // Serialize the documents data
    const serializedDocuments = documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      email: doc.email,
      fileUrl: doc.fileUrl,
      signedFileUrl: doc.signedFileUrl,
      status: doc.status || 'pending',
      createdAt: doc.createdAt.toISOString(),
    }));

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/folders" className="text-gray-400 hover:text-gray-500">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{serializedFolder.name}</h1>
              {serializedFolder.description && (
                <p className="text-sm text-gray-500">{serializedFolder.description}</p>
              )}
            </div>
          </div>
          <Link href={`/dashboard/folders/${folderId}/createDocument`}>
            <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600">
              <Plus className="h-4 w-4" />
              Document nou
            </Button>
          </Link>
        </div>

        <div className="flex-1 bg-gray-50">
          <FolderDocumentsTable
            folder={serializedFolder}
            documents={serializedDocuments}
            userId={user.id}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading folder:', error);
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-4">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Eroare la încărcarea folderului
          </h3>
          <p className="mt-1 text-sm text-gray-500">Vă rugăm să încercați din nou.</p>
          <div className="mt-6">
            <Link href="/dashboard">
              <Button variant="outline">Înapoi la dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
