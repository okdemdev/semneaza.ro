import FolderDocumentsTable from '@/app/components/folder-documents-table';
import { getFolder } from '@/app/actions/folderActions';
import { getDocumentsByFolder } from '@/app/actions/documentActions';
import { requireUser } from '@/lib/requireUser';

export const dynamic = 'force-dynamic';

type Props = {
  params: { folderId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

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
    };

    // Serialize the documents data
    const serializedDocuments = documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      email: doc.email,
      createdAt: doc.createdAt.toISOString(),
    }));

    return (
      <FolderDocumentsTable
        folder={serializedFolder}
        documents={serializedDocuments}
        userId={user.id}
      />
    );
  } catch (error) {
    console.error('Error loading folder:', error);
    return (
      <div className="p-4">
        <p className="text-red-500">Error loading folder. Please try again.</p>
      </div>
    );
  }
}
