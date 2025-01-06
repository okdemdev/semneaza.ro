import { createDocument } from '@/app/actions/documentActions';
import { requireUser } from '@/lib/requireUser';
import { redirect } from 'next/navigation';
import DocumentEditor from '@/app/components/document-editor/DocumentEditor';

interface PageProps {
  params: { folderId: string };
}

export default async function CreateDocumentPage({ params }: PageProps) {
  // Ensure we have the folderId before proceeding
  const folderId = await params.folderId;
  if (!folderId) {
    redirect('/dashboard/folders');
  }

  async function handleSubmit(formData: FormData) {
    'use server';

    const user = await requireUser();
    const title = formData.get('title')?.toString() || '';
    const fileUrl = formData.get('fileUrl')?.toString();
    const email = formData.get('email')?.toString() || '';

    if (!fileUrl) {
      throw new Error('No file URL provided');
    }

    if (!email) {
      throw new Error('Email is required');
    }

    // Create the document with the title and file URL
    const document = await createDocument(user.id, folderId, {
      title,
      fileUrl,
      email,
    });

    // Redirect to the document view page
    redirect(`/dashboard/folders/${folderId}/${document.id}`);
  }

  return <DocumentEditor onSave={handleSubmit} />;
}
