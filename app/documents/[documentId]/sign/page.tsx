import { Suspense } from 'react';
import SignDocumentClient from './SignDocumentClient';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Document from '@/lib/models/Document';

interface PageProps {
  params: Promise<{ documentId: string }>;
}

async function getDocument(documentId: string) {
  await dbConnect();
  const document = await Document.findOne({ id: documentId });

  if (!document) {
    notFound();
  }

  return document;
}

export default async function SignDocumentPage({ params }: PageProps) {
  const { documentId } = await params;
  await getDocument(documentId);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500">Se încarcă documentul...</p>
          </div>
        </div>
      }
    >
      <SignDocumentClient documentId={documentId} />
    </Suspense>
  );
}
