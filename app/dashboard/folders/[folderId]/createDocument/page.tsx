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
    const emails = JSON.parse(formData.get('emails')?.toString() || '[]');
    const fileUrl = formData.get('fileUrl')?.toString();

    if (!fileUrl) {
      throw new Error('No file URL provided');
    }

    // For now, we'll just use the first email in the list
    const email = emails[0] || '';

    // Create the document with the title, email, and file URL
    const document = await createDocument(user.id, folderId, {
      title,
      email,
      fileUrl,
    });

    redirect(`/dashboard/folders/${folderId}`);
  }

  return <DocumentEditor onSave={handleSubmit} />;
}
