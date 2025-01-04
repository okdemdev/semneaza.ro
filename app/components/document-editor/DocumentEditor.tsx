'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Signature, Type, Stamp, PenLine } from 'lucide-react';
import SignatureModal from '@/app/components/signature/SignatureModal';
import DraggableSignature from '@/app/components/signature/DraggableSignature';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

interface DocumentEditorProps {
  onSave: (formData: FormData) => Promise<void>;
}

interface SignatureField {
  id: string;
  signatureData: string;
  position: { x: number; y: number };
}

export default function DocumentEditor({ onSave }: DocumentEditorProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [documentName, setDocumentName] = useState<string>('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signatures, setSignatures] = useState<SignatureField[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      // Set initial document name from file name, removing .pdf extension
      setDocumentName(file.name.replace(/\.pdf$/i, ''));
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleAddEmail = () => {
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setNewEmail('');
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('emails', JSON.stringify(emails));
    formData.append('title', documentName);
    formData.append('signatures', JSON.stringify(signatures));

    await onSave(formData);
  };

  const handleNameChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingName(false);
    }
  };

  const handleSignatureSave = (signatureData: string) => {
    const newSignature: SignatureField = {
      id: `signature-${signatures.length + 1}`,
      signatureData,
      position: { x: 0, y: 0 },
    };
    setSignatures([...signatures, newSignature]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;

    setSignatures(
      signatures.map((sig) => {
        if (sig.id === active.id) {
          return {
            ...sig,
            position: {
              x: sig.position.x + delta.x,
              y: sig.position.y + delta.y,
            },
          };
        }
        return sig;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!pdfUrl ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <label className="block">
              <span className="sr-only">Choose PDF file</span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">Upload a PDF file to continue</p>
          </div>
        </div>
      ) : (
        <div className="flex h-screen">
          {/* Left Sidebar */}
          <div className="w-[15%] bg-white p-4 border-r border-gray-200">
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setIsSignatureModalOpen(true)}
              >
                <Signature className="mr-2 h-4 w-4" />
                Semnătură
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Type className="mr-2 h-4 w-4" />
                Text
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Stamp className="mr-2 h-4 w-4" />
                Ștampilă
              </Button>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Recipients</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Add email"
                      className="flex-1 px-2 py-1 text-sm border rounded"
                    />
                    <Button size="sm" onClick={handleAddEmail}>
                      Add
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {emails.map((email) => (
                      <div
                        key={email}
                        className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded text-sm"
                      >
                        <span>{email}</span>
                        <button
                          onClick={() => handleRemoveEmail(email)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Top Bar */}
            <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <input
                    type="text"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    onBlur={() => setIsEditingName(false)}
                    onKeyDown={handleNameChange}
                    className="text-xl font-semibold px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              <Button onClick={handleSubmit}>Send and Save</Button>
            </div>

            {/* PDF Viewer with Signatures */}
            <div className="flex-1 bg-gray-100 p-4 relative">
              <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-0 rounded shadow-lg"
                  title="PDF Viewer"
                />
                {signatures.map((signature) => (
                  <div
                    key={signature.id}
                    style={{
                      transform: `translate(${signature.position.x}px, ${signature.position.y}px)`,
                    }}
                  >
                    <DraggableSignature id={signature.id} signatureData={signature.signatureData} />
                  </div>
                ))}
              </DndContext>
            </div>
          </div>
        </div>
      )}

      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={handleSignatureSave}
      />
    </div>
  );
}
