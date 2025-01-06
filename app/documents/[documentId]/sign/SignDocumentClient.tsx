'use client';

import { useEffect, useState } from 'react';
import SignatureModal from '@/app/components/signature/SignatureModal';
import { useRouter } from 'next/navigation';

interface DocumentData {
  id: string;
  title: string;
  fileUrl: string;
  previewImageUrl: string;
  signaturePlaceholder: {
    pageNumber: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  status: 'pending' | 'signed';
  email: string;
  createdAt: string;
}

interface SignDocumentClientProps {
  documentId: string;
}

export default function SignDocumentClient({ documentId }: SignDocumentClientProps) {
  const router = useRouter();
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${documentId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Document not found');
        }
        const data = await response.json();
        setDocument(data);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Nu am putut găsi documentul. Te rog verifică link-ul.');
      }
    };

    fetchDocument();
  }, [documentId]);

  const handleSignatureClick = () => {
    if (document?.status === 'signed') {
      setError('Acest document a fost deja semnat.');
      return;
    }
    setIsSignatureModalOpen(true);
  };

  const handleSignatureSave = async (signatureData: string) => {
    setIsSignatureModalOpen(false);
    setIsSigning(true);
    setError(null);

    try {
      const response = await fetch(`/api/documents/${documentId}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signatureData,
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sign document');
      }

      const data = await response.json();
      router.push(`/documents/${documentId}/success`);
    } catch (err) {
      setError('A apărut o eroare la semnarea documentului. Te rog încearcă din nou.');
    } finally {
      setIsSigning(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Se încarcă documentul...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-screen bg-gray-100 p-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">{document.title}</h1>
        <p className="text-sm text-gray-500">Te rugăm să semnezi documentul în locul indicat</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative w-full">
          <img src={document.previewImageUrl} alt="Document Preview" className="w-full h-auto" />
          <div
            className={`absolute border-2 ${
              document.status === 'signed'
                ? 'border-green-500 bg-green-50'
                : 'border-dashed border-blue-500 bg-blue-50'
            } bg-opacity-30 rounded cursor-pointer`}
            style={{
              left: `${document.signaturePlaceholder.x}px`,
              top: `${document.signaturePlaceholder.y}px`,
              width: `${document.signaturePlaceholder.width}px`,
              height: `${document.signaturePlaceholder.height}px`,
            }}
            onClick={handleSignatureClick}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <p
                className={`text-sm font-medium ${
                  document.status === 'signed' ? 'text-green-500' : 'text-blue-500'
                }`}
              >
                {document.status === 'signed' ? 'Document semnat' : 'Click pentru a semna'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={handleSignatureSave}
      />

      {isSigning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-gray-700">Se procesează semnătura...</p>
          </div>
        </div>
      )}
    </div>
  );
}
