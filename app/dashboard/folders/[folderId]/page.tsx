import { getFolder } from '@/app/actions/folderActions';
import { getDocumentsByFolder } from '@/app/actions/documentActions';
import { requireUser } from '@/lib/requireUser';
import FolderDocumentsTable from '@/app/components/folder-documents-table';

export default async function FolderPage({ params }: { params: { folderId: string } }) {
  const user = await requireUser();
  const folder = await getFolder(params.folderId, user.id);
  const documents = await getDocumentsByFolder(user.id, params.folderId);

  return <FolderDocumentsTable folder={folder} documents={documents} />;
}
