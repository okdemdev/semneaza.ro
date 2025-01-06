import { getDocument } from '@/app/actions/documentActions';
import { requireUser } from '@/lib/requireUser';
import { redirect } from 'next/navigation';
import DocumentEditor from '@/app/components/document-editor/DocumentEditor';

interface PageProps {
  params: { folderId: string; documentId: string };
}

export default async function DocumentPage({ params }: PageProps) {
  const { folderId, documentId } = params;
  if (!folderId || !documentId) {
    redirect('/dashboard/folders');
  }

  const user = await requireUser();
  const document = await getDocument(user.id, documentId);

  if (!document) {
    redirect('/dashboard/folders/' + folderId);
  }

  async function handleSave(formData: FormData) {
    'use server';
    // Handle document updates here
  }

  return <DocumentEditor documentUrl={document.fileUrl} onSave={handleSave} />;
}
