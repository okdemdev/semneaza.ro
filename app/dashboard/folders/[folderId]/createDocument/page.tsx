import { createDocument } from '@/app/actions/documentActions';
import DocumentEditor from '@/app/components/document-editor/DocumentEditor';
import { requireUser } from '@/lib/requireUser';
import { redirect } from 'next/navigation';

interface Props {
  params: { folderId: string };
}

export default async function CreateDocumentPage({ params }: Props) {
  const user = await requireUser();
  const { folderId } = params;

  async function handleSubmit(formData: FormData) {
    'use server';

    const fileUrl = formData.get('fileUrl') as string;
    const title = formData.get('title') as string;
    const email = formData.get('email') as string;
    const signaturePlaceholder = JSON.parse(formData.get('signaturePlaceholder') as string);
    const previewImageUrl = formData.get('previewImageUrl') as string;

    await createDocument(user.id, folderId, {
      title,
      fileUrl,
      email,
      signaturePlaceholder,
      previewImageUrl,
    });

    redirect(`/dashboard/folders/${folderId}`);
  }

  return <DocumentEditor onSave={handleSubmit} />;
}
