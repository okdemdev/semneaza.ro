'use client';

import React, { useState, useEffect } from 'react';
import { PenLine, Plus, X, Loader2 } from 'lucide-react';
import { useStorage } from '@/app/lib/storage';
import * as pdfjsLib from 'pdfjs-dist';
import SignaturePlaceholder from '@/app/components/signature/SignaturePlaceholder';
import ReactDOM from 'react-dom/client';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/_next/static/pdf.worker.min.js';

interface DocumentEditorProps {
  documentUrl?: string;
  onSave: (formData: FormData) => Promise<void>;
  sendButtonContainerId?: string;
}

interface SignaturePlaceholder {
  pageNumber: number;
  x: number; // percentage of document width
  y: number; // percentage of document height
  width: number; // percentage of document width
  height: number; // percentage of document height
}

export default function DocumentEditor({
  documentUrl,
  onSave,
  sendButtonContainerId,
}: DocumentEditorProps) {
  const storage = useStorage();
  const previewImageRef = React.useRef<HTMLImageElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState<string>('Document nou');
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [signaturePlaceholder, setSignaturePlaceholder] = useState<SignaturePlaceholder | null>(
    null
  );
  const [isPlacingSignature, setIsPlacingSignature] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [isEmailLocked, setIsEmailLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const convertPdfToImage = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const page = await pdf.getPage(1); // Get first page

      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context!,
        viewport: viewport,
      }).promise;

      return canvas.toDataURL();
    } catch (error) {
      console.error('Error converting PDF to image:', error);
      throw new Error('Failed to convert PDF');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);

    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Te rog selectează un fișier PDF');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Fișierul trebuie să fie mai mic de 10MB');
      return;
    }

    try {
      const imageUrl = await convertPdfToImage(file);
      setPreviewImage(imageUrl);
      setSelectedFile(file);
      setDocumentName(file.name.replace(/\.pdf$/i, ''));
    } catch (err) {
      setError('Nu am putut procesa documentul PDF. Te rog încearcă din nou.');
    }
  };

  const handleAddSignaturePlaceholder = () => {
    setIsPlacingSignature(true);
  };

  const getPreviewImageRect = () => {
    if (!previewImageRef.current) return null;
    return previewImageRef.current.getBoundingClientRect();
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlacingSignature) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setSignaturePlaceholder({
      pageNumber: 1,
      x,
      y,
      width: 25, // 25% of document width
      height: 15, // 15% of document height
    });
    setIsPlacingSignature(false);
  };

  const handlePlaceholderPositionChange = (position: { x: number; y: number }) => {
    if (signaturePlaceholder && previewImage) {
      const rect = getPreviewImageRect();
      if (rect) {
        const xPercent = (position.x / rect.width) * 100;
        const yPercent = (position.y / rect.height) * 100;

        setSignaturePlaceholder({
          ...signaturePlaceholder,
          x: xPercent,
          y: yPercent,
        });
      }
    }
  };

  const handlePlaceholderSizeChange = (size: { width: number; height: number }) => {
    if (signaturePlaceholder && previewImage) {
      const rect = getPreviewImageRect();
      if (rect) {
        const widthPercent = (size.width / rect.width) * 100;
        const heightPercent = (size.height / rect.height) * 100;

        setSignaturePlaceholder({
          ...signaturePlaceholder,
          width: widthPercent,
          height: heightPercent,
        });
      }
    }
  };

  const handleAddEmail = () => {
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setIsEmailLocked(true);
      setError(null);
    } else {
      setError('Te rog introdu o adresă de email validă');
    }
  };

  const handleRemoveEmail = () => {
    setEmail('');
    setIsEmailLocked(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleSaveDocument = async () => {
    if (!selectedFile) {
      setError('Te rog încarcă un document PDF');
      return;
    }

    if (!email || !isEmailLocked) {
      setError('Te rog adaugă o adresă de email');
      return;
    }

    if (!signaturePlaceholder) {
      setError('Te rog adaugă un loc pentru semnătură');
      return;
    }

    if (!previewImage) {
      setError('Nu am putut genera previzualizarea documentului');
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      const fileUrl = await storage.uploadFile(selectedFile);

      const previewImageFile = await fetch(previewImage)
        .then((res) => res.blob())
        .then((blob) => new File([blob], 'preview.png', { type: 'image/png' }));

      const previewImageUrl = await storage.uploadFile(previewImageFile);

      formData.append('fileUrl', fileUrl);
      formData.append('title', documentName);
      formData.append('email', email);
      formData.append('signaturePlaceholder', JSON.stringify(signaturePlaceholder));
      formData.append('previewImageUrl', previewImageUrl);

      await onSave(formData);
    } catch (err) {
      setError('A apărut o eroare la salvarea documentului. Te rog încearcă din nou.');
      console.error('Error saving document:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render the send button
  const renderSendButton = () => {
    const isValid = selectedFile && email && isEmailLocked && signaturePlaceholder;
    const button = (
      <button
        type="button"
        onClick={handleSaveDocument}
        disabled={!isValid || isLoading}
        className={`flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isValid && !isLoading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Se trimite...
          </>
        ) : (
          'Trimite documentul la semnat'
        )}
      </button>
    );

    if (sendButtonContainerId && typeof document !== 'undefined') {
      const container = document.getElementById(sendButtonContainerId);
      if (container) {
        const root = ReactDOM.createRoot(container);
        root.render(button);
      }
    }
  };

  // Effect to handle send button rendering
  useEffect(() => {
    if (selectedFile) {
      renderSendButton();
    }
  }, [selectedFile, email, isEmailLocked, signaturePlaceholder, sendButtonContainerId, isLoading]);

  if (!selectedFile && !documentUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Creează document nou</h2>
          <label className="block">
            <span className="sr-only">Alege fișier PDF</span>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </label>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <p className="mt-4 text-sm text-gray-500">
            Încarcă un fișier PDF pentru a începe procesul de semnare
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Scrollable Content Area */}
        <div className="flex-1 min-h-0">
          <div className="h-full overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Document Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nume document
                </label>
                {isEditingName ? (
                  <input
                    type="text"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    onBlur={() => setIsEditingName(false)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                ) : (
                  <div
                    onClick={() => setIsEditingName(true)}
                    className="flex items-center justify-between group cursor-pointer p-2 hover:bg-gray-50 rounded-md"
                  >
                    <span className="text-sm text-gray-900">{documentName}</span>
                    <PenLine className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                  </div>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email semnatar
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isEmailLocked}
                    placeholder="email@example.com"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                  {isEmailLocked ? (
                    <button
                      onClick={handleRemoveEmail}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleAddEmail}
                      className="p-2 text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Signature Placeholder Controls */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loc semnătură
                </label>
                <button
                  onClick={handleAddSignaturePlaceholder}
                  disabled={!!signaturePlaceholder}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PenLine className="h-4 w-4 mr-2" />
                  {signaturePlaceholder ? 'Loc semnătură adăugat' : 'Adaugă loc semnătură'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="p-4 border-t border-gray-200 bg-red-50">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}
      </div>

      {/* Document Preview */}
      <div className="flex-1 bg-gray-100 overflow-hidden">
        <div className="h-full overflow-y-auto p-8">
          <div
            className="relative bg-white rounded-lg shadow-sm mx-auto"
            style={{ maxWidth: '800px' }}
            onClick={handleImageClick}
          >
            {previewImage && (
              <>
                <img
                  ref={previewImageRef}
                  src={previewImage}
                  alt="Document preview"
                  className="w-full h-auto"
                />
                {signaturePlaceholder && (
                  <SignaturePlaceholder
                    position={{
                      x: (signaturePlaceholder.x / 100) * previewImageRef.current!.offsetWidth,
                      y: (signaturePlaceholder.y / 100) * previewImageRef.current!.offsetHeight,
                    }}
                    size={{
                      width:
                        (signaturePlaceholder.width / 100) * previewImageRef.current!.offsetWidth,
                      height:
                        (signaturePlaceholder.height / 100) * previewImageRef.current!.offsetHeight,
                    }}
                    onPositionChange={handlePlaceholderPositionChange}
                    onSizeChange={handlePlaceholderSizeChange}
                    onPlaceholderClick={() => {}}
                  />
                )}
              </>
            )}
            {isPlacingSignature && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-10 cursor-crosshair">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-blue-600 font-medium bg-white px-4 py-2 rounded-md shadow-sm">
                    Click pentru a plasa semnătura
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
