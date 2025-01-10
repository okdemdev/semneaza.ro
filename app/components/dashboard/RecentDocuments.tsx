'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, CheckCircle2, Clock, MoreVertical, Mail, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { deleteDocument } from '@/app/actions/documentActions';
import { useRouter } from 'next/navigation';

interface Document {
  id: string;
  title: string;
  status: 'pending' | 'signed';
  createdAt: string;
  folder: {
    id: string;
    name: string;
  } | null;
  email: string;
  fileUrl?: string;
  signedFileUrl?: string;
}

interface RecentDocumentsProps {
  documents: Document[];
  userId: string;
}

interface DocumentDetailsProps {
  document: Document;
  onClose: () => void;
  onDelete: (documentId: string) => Promise<void>;
}

function DocumentDetails({ document, onClose, onDelete }: DocumentDetailsProps) {
  const handleDownload = async () => {
    const url = document.status === 'signed' ? document.signedFileUrl : document.fileUrl;
    if (!url) return;

    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${document.title}${document.status === 'signed' ? '_signed' : ''}.pdf`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Document</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div>
          <h3 className="font-medium mb-1">Document</h3>
          <p className="text-sm text-gray-500">{document.title}.pdf</p>
        </div>
        <div>
          <h3 className="font-medium mb-1">Stare</h3>
          <p className="text-sm text-gray-500">
            {document.status === 'signed' ? 'Semnat' : 'În curs'}
          </p>
        </div>
        <div>
          <h3 className="font-medium mb-1">Semnatari</h3>
          <div className="flex items-center text-sm text-gray-500">
            <Mail className="h-4 w-4 mr-2" />
            {document.email}
            <Badge
              className={`ml-2 ${
                document.status === 'signed' ? 'bg-green-500' : 'bg-orange-500'
              } text-white`}
            >
              {document.status === 'signed' ? 'Semnat' : 'În curs'}
            </Badge>
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-1">Dată Trimitere</h3>
          <p className="text-sm text-gray-500">
            {new Date(document.createdAt).toLocaleDateString('ro-RO')}
          </p>
        </div>
        <div>
          <h3 className="font-medium mb-1">ID</h3>
          <p className="text-sm font-mono text-gray-500">{document.id}</p>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Button
          variant="destructive"
          className="flex items-center gap-2"
          onClick={async () => {
            await onDelete(document.id);
            onClose();
          }}
        >
          <Trash2 className="h-4 w-4" />
          Șterge
        </Button>
        <Button onClick={handleDownload}>Descarcă</Button>
      </div>
    </DialogContent>
  );
}

export default function RecentDocuments({ documents, userId }: RecentDocumentsProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const router = useRouter();

  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument(userId, documentId);
      router.refresh();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleCopyLink = async (documentId: string) => {
    const url = `${window.location.origin}/documents/${documentId}/sign`;
    await navigator.clipboard.writeText(url);
    alert('Link copiat în clipboard!');
  };

  const handleDownload = async (document: Document) => {
    const url = document.status === 'signed' ? document.signedFileUrl : document.fileUrl;
    if (!url) return;

    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${document.title}${document.status === 'signed' ? '_signed' : ''}.pdf`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const getStatusBadge = (status: 'pending' | 'signed') => {
    const statusConfig = {
      pending: { style: 'bg-orange-500 text-white', label: 'În curs' },
      signed: { style: 'bg-green-500 text-white', label: 'Semnat' },
    };

    return <Badge className={statusConfig[status].style}>{statusConfig[status].label}</Badge>;
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Documente recente</h3>
      {documents.length > 0 ? (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="block p-3 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">{doc.email}</span>
                      <div className="flex items-center gap-1 text-green-500">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs">Email sent</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Folder: {doc.folder ? doc.folder.name : 'Deleted folder'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(doc.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedDocument(doc)}>
                        Vezi detalii
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyLink(doc.id)}>
                        Copiază link
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(doc)}>
                        Descarcă {doc.status === 'signed' ? 'semnat' : ''}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(doc.id)}
                      >
                        Șterge
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(doc.createdAt).toLocaleDateString('ro-RO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Nu există documente recente.</p>
      )}

      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        {selectedDocument && (
          <DocumentDetails
            document={selectedDocument}
            onClose={() => setSelectedDocument(null)}
            onDelete={handleDelete}
          />
        )}
      </Dialog>
    </div>
  );
}
