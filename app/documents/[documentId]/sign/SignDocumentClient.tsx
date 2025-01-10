'use client';

import { useEffect, useState, useRef } from 'react';
import SignatureModal from '@/app/components/signature/SignatureModal';
import { useRouter } from 'next/navigation';
import { PDFDocument } from 'pdf-lib';
import { useEdgeStore } from '@/app/lib/edgestore';

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
  const { edgestore } = useEdgeStore();
  const previewImageRef = useRef<HTMLImageElement>(null);
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
    if (!document) return;

    setIsSignatureModalOpen(false);
    setIsSigning(true);
    setError(null);

    try {
      // Load the original PDF
      const pdfBytes = await fetch(document.fileUrl).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const page = pages[document.signaturePlaceholder.pageNumber - 1];

      // Convert signature data URL to image
      const signatureImage = await pdfDoc.embedPng(signatureData);

      // Calculate signature position
      const { width: pageWidth, height: pageHeight } = page.getSize();

      // Convert percentage positions to actual PDF coordinates
      const signatureWidth = (document.signaturePlaceholder.width / 100) * pageWidth;
      const signatureHeight = (document.signaturePlaceholder.height / 100) * pageHeight;
      const signatureX = (document.signaturePlaceholder.x / 100) * pageWidth;
      const signatureY =
        pageHeight - (document.signaturePlaceholder.y / 100) * pageHeight - signatureHeight;

      // Add signature to PDF
      page.drawImage(signatureImage, {
        x: signatureX,
        y: signatureY,
        width: signatureWidth,
        height: signatureHeight,
      });

      // Save the signed PDF
      const signedPdfBytes = await pdfDoc.save();
      const signedPdfBlob = new Blob([signedPdfBytes], { type: 'application/pdf' });
      const signedPdfFile = new File([signedPdfBlob], `signed_${document.id}.pdf`, {
        type: 'application/pdf',
      });

      // Upload the signed PDF
      const uploadResult = await edgestore.publicFiles.upload({
        file: signedPdfFile,
        options: {
          replaceTargetUrl: document.fileUrl,
        },
      });

      // Update the document status
      const response = await fetch(`/api/documents/${documentId}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signatureData,
          date: new Date().toISOString(),
          signedFileUrl: uploadResult.url,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sign document');
      }

      // Redirect with the signed document info
      router.push(
        `/documents/${documentId}/success?title=${encodeURIComponent(
          document.title
        )}&url=${encodeURIComponent(uploadResult.url)}`
      );
    } catch (err) {
      console.error('Error signing document:', err);
      setError('A apărut o eroare la semnarea documentului. Te rog încearcă din nou.');
    } finally {
      setIsSigning(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="text-center max-w-md w-full">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="text-center max-w-md w-full">
          <p className="text-gray-500">Se încarcă documentul...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold">{document.title}</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Te rugăm să semnezi documentul în locul indicat
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative w-full">
            <img
              ref={previewImageRef}
              src={document.previewImageUrl}
              alt="Document Preview"
              className="w-full h-auto"
            />
            {previewImageRef.current && (
              <div
                className={`absolute border-2 ${
                  document.status === 'signed'
                    ? 'border-green-500 bg-green-50'
                    : 'border-dashed border-blue-500 bg-blue-50'
                } bg-opacity-30 rounded cursor-pointer transition-colors duration-200 hover:bg-opacity-40`}
                style={{
                  left: `${document.signaturePlaceholder.x}%`,
                  top: `${document.signaturePlaceholder.y}%`,
                  width: `${document.signaturePlaceholder.width}%`,
                  height: `${document.signaturePlaceholder.height}%`,
                }}
                onClick={handleSignatureClick}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center p-1"
                  style={{
                    fontSize: previewImageRef.current
                      ? `${Math.min(
                          (previewImageRef.current.offsetWidth *
                            document.signaturePlaceholder.width *
                            0.08) /
                            100,
                          (previewImageRef.current.offsetHeight *
                            document.signaturePlaceholder.height *
                            0.16) /
                            100
                        )}px`
                      : 'inherit',
                  }}
                >
                  <p
                    className={`font-medium text-center whitespace-nowrap ${
                      document.status === 'signed' ? 'text-green-500' : 'text-blue-500'
                    }`}
                  >
                    {document.status === 'signed' ? 'Document semnat' : 'Click pentru a semna'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={handleSignatureSave}
      />

      {isSigning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-gray-700 text-center">Se procesează semnătura...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
