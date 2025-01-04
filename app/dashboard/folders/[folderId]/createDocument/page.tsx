import { createDocument } from '@/app/actions/documentActions';
import { requireUser } from '@/lib/requireUser';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DocumentEditor from '@/app/components/document-editor/DocumentEditor';

export default async function CreateDocumentPage({ params }: { params: { folderId: string } }) {
  async function handleSubmit(formData: FormData) {
    'use server';

    const user = await requireUser();
    const title = formData.get('file')?.toString() || '';
    const emails = JSON.parse(formData.get('emails')?.toString() || '[]');

    // For now, we'll just use the first email in the list
    const email = emails[0] || '';

    // TODO: Handle file upload to storage service
    // For now, we're just storing the filename

    await createDocument(user.id, params.folderId, { title, email });
    redirect(`/dashboard/folders/${params.folderId}`);
  }

  return <DocumentEditor onSave={handleSubmit} />;
}
