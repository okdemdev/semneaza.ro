import { createDocument } from '@/app/actions/documentActions';
import { requireUser } from '@/lib/requireUser';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DocumentEditor from '@/app/components/document-editor/DocumentEditor';

export default async function CreateDocumentPage({ params }: { params: { folderId: string } }) {
  async function handleSubmit(formData: FormData) {
    'use server';

    const user = await requireUser();
    const title = formData.get('title')?.toString() || '';
    const emails = JSON.parse(formData.get('emails')?.toString() || '[]');

    // For now, we'll just use the first email in the list
    const email = emails[0] || '';

    // Create the document with the title and email
    const document = await createDocument(user.id, params.folderId, {
      title,
      email,
    });

    redirect(`/dashboard/folders/${params.folderId}`);
  }

  return <DocumentEditor onSave={handleSubmit} />;
}
