import { createDocument } from '@/app/actions/documentActions';
import DocumentEditor from '@/app/components/document-editor/DocumentEditor';
import { requireUser } from '@/lib/requireUser';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ folderId: string }>;
}

export default async function CreateDocumentPage({ params }: Props) {
  const user = await requireUser();
  const { folderId } = await params;

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

  return (
    <div className="h-full flex flex-col">
      {/* Top Navigation */}
      <div className="flex-none bg-white border-b border-gray-200">
        <div className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href={`/dashboard/folders/${folderId}`}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Înapoi la folder
          </Link>
          <div id="send-button-container"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <DocumentEditor onSave={handleSubmit} sendButtonContainerId="send-button-container" />
      </div>
    </div>
  );
}
