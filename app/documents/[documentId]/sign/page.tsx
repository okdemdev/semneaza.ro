import { Suspense } from 'react';
import SignDocumentClient from './SignDocumentClient';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Document from '@/lib/models/Document';

async function getDocument(documentId: string) {
  await dbConnect();
  const document = await Document.findOne({ id: documentId });

  if (!document) {
    notFound();
  }

  return document;
}

export default async function SignDocumentPage({ params }: { params: { documentId: string } }) {
  await getDocument(params.documentId); // Pre-fetch to ensure document exists

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
      <SignDocumentClient documentId={params.documentId} />
    </Suspense>
  );
}
