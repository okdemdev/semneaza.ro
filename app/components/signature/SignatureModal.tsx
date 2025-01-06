'use client';

import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signature: string) => void;
}

export default function SignatureModal({ isOpen, onClose, onSave }: SignatureModalProps) {
  const signatureRef = useRef<SignatureCanvas>(null);

  const handleClear = () => {
    signatureRef.current?.clear();
  };

  const handleSave = () => {
    if (signatureRef.current?.isEmpty()) {
      return;
    }

    const signatureData = signatureRef.current?.toDataURL('image/png');
    if (signatureData) {
      onSave(signatureData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw]">
        <h2 className="text-xl font-semibold mb-4">Desenează semnătura</h2>

        <div className="border rounded-lg mb-4">
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              className: 'w-full h-[300px] bg-gray-50',
            }}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Șterge
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Anulează
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Salvează
          </button>
        </div>
      </div>
    </div>
  );
}
