'use client';

import React, { useState, useEffect } from 'react';
import { PenLine, Plus } from 'lucide-react';
import { useStorage } from '@/app/lib/storage';
import * as pdfjsLib from 'pdfjs-dist';
import SignaturePlaceholder from '@/app/components/signature/SignaturePlaceholder';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/_next/static/pdf.worker.min.js';

interface DocumentEditorProps {
  documentUrl?: string;
  onSave: (formData: FormData) => Promise<void>;
}

interface SignaturePlaceholder {
  pageNumber: number;
  x: number; // percentage of document width
  y: number; // percentage of document height
  width: number; // percentage of document width
  height: number; // percentage of document height
}

export default function DocumentEditor({ documentUrl, onSave }: DocumentEditorProps) {
  const storage = useStorage();
  const previewImageRef = React.useRef<HTMLImageElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState<string>('Document nou');
  const [email, setEmail] = useState<string>('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [signaturePlaceholder, setSignaturePlaceholder] = useState<SignaturePlaceholder | null>(
    null
  );
  const [isPlacingSignature, setIsPlacingSignature] = useState(false);

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

  const handleSaveDocument = async () => {
    if (!selectedFile) {
      setError('Te rog încarcă un document PDF');
      return;
    }

    if (!email) {
      setError('Te rog introdu adresa de email');
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
      const formData = new FormData();
      const fileUrl = await storage.uploadFile(selectedFile);

      // Convert preview image from data URL to file
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
    }
  };

  if (!selectedFile && !documentUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
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
          <p className="mt-2 text-sm text-gray-500">Încarcă un fișier PDF pentru a continua</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-screen bg-gray-100 p-4">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isEditingName ? (
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
              className="text-xl font-semibold px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <h1 className="text-xl font-semibold flex items-center gap-2">
              {documentName}
              <button
                onClick={() => setIsEditingName(true)}
                className="text-gray-400 hover:text-gray-600"
              >
                <PenLine className="h-4 w-4" />
              </button>
            </h1>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddSignaturePlaceholder}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              isPlacingSignature
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            disabled={!!signaturePlaceholder}
          >
            <Plus className="h-4 w-4" />
            {isPlacingSignature ? 'Click pentru semnătură' : 'Adaugă loc pentru semnătură'}
          </button>
          <button
            onClick={handleSaveDocument}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Salvează
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email destinatar</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Introdu adresa de email"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div
          className="relative w-full"
          onClick={handleImageClick}
          style={{ cursor: isPlacingSignature ? 'crosshair' : 'default' }}
        >
          {previewImage && (
            <>
              <img
                ref={previewImageRef}
                src={previewImage}
                alt="Document Preview"
                className="w-full h-auto"
              />
              {signaturePlaceholder && previewImageRef.current && (
                <SignaturePlaceholder
                  position={{
                    x: (signaturePlaceholder.x / 100) * previewImageRef.current.offsetWidth,
                    y: (signaturePlaceholder.y / 100) * previewImageRef.current.offsetHeight,
                  }}
                  size={{
                    width: (signaturePlaceholder.width / 100) * previewImageRef.current.offsetWidth,
                    height:
                      (signaturePlaceholder.height / 100) * previewImageRef.current.offsetHeight,
                  }}
                  onPositionChange={handlePlaceholderPositionChange}
                  onSizeChange={handlePlaceholderSizeChange}
                  onPlaceholderClick={() => {}}
                />
              )}
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
