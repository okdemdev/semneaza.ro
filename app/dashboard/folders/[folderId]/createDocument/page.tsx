import { createDocument } from '@/app/actions/documentActions';
import { requireUser } from '@/lib/requireUser';
import { redirect } from 'next/navigation';
import DocumentEditor from '@/app/components/document-editor/DocumentEditor';
import { use } from 'react';

interface PageProps {
  params: { folderId: string };
}

export default function CreateDocumentPage({ params }: PageProps) {
  // Use React.use() to unwrap the params promise
  const folderId = use(Promise.resolve(params.folderId));
  if (!folderId) {
    redirect('/dashboard/folders');
  }

  async function handleSubmit(formData: FormData) {
    'use server';

    const user = await requireUser();
    const title = formData.get('title')?.toString() || '';
    const fileUrl = formData.get('fileUrl')?.toString();
    const email = formData.get('email')?.toString() || '';
    const previewImageUrl = formData.get('previewImageUrl')?.toString();
    const signaturePlaceholderStr = formData.get('signaturePlaceholder')?.toString();

    if (!fileUrl) {
      throw new Error('No file URL provided');
    }

    if (!email) {
      throw new Error('Email is required');
    }

    if (!previewImageUrl) {
      throw new Error('Preview image is required');
    }

    if (!signaturePlaceholderStr) {
      throw new Error('Signature placeholder is required');
    }

    const signaturePlaceholder = JSON.parse(signaturePlaceholderStr);

    // Create the document with all required fields
    const document = await createDocument(user.id, folderId, {
      title,
      fileUrl,
      email,
      previewImageUrl,
      signaturePlaceholder,
    });

    // Redirect to the document view page
    redirect(`/dashboard/folders/${folderId}/${document.id}`);
  }

  return <DocumentEditor onSave={handleSubmit} />;
}
