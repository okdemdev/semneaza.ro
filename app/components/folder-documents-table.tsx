'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle2, MoreVertical, Mail, Trash2, RefreshCw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { deleteDocument } from '@/app/actions/documentActions';
import { useRouter } from 'next/navigation';

type DocumentStatus = 'pending' | 'signed';

interface Document {
  id: string;
  title: string;
  email: string;
  createdAt: string;
  fileUrl: string;
  signedFileUrl?: string;
  status: DocumentStatus;
  signature?: {
    date: string;
  };
  emailSentAt?: string;
}

interface Folder {
  id: string;
  name: string;
  description: string;
}

interface FolderDocumentsTableProps {
  folder: Folder;
  documents: Document[];
  userId: string;
}

interface DocumentDetailsProps {
  document: Document;
  onClose: () => void;
  onDelete: (documentId: string) => Promise<void>;
  onRefresh: (documentId: string) => Promise<void>;
  isRefreshing: boolean;
}

function DocumentDetails({
  document,
  onClose,
  onDelete,
  onRefresh,
  isRefreshing,
}: DocumentDetailsProps) {
  const router = useRouter();

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
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">
              {document.status === 'signed' ? 'Semnat' : 'În curs'}
            </p>
            {document.status === 'pending' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-gray-100 transition-transform"
                onClick={() => onRefresh(document.id)}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
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
            {new Date(document.createdAt).toLocaleDateString('ro-RO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div>
          <h3 className="font-medium mb-1">Email Trimis</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>
              {new Date(document.emailSentAt || document.createdAt).toLocaleDateString('ro-RO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <div className="flex items-center gap-1 text-green-500">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs">Email trimis</span>
            </div>
          </div>
        </div>
        {document.status === 'signed' && document.signature?.date && (
          <div>
            <h3 className="font-medium mb-1">Dată Finalizare</h3>
            <p className="text-sm text-gray-500">
              {new Date(document.signature.date).toLocaleDateString('ro-RO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        )}
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
        <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
          Descarcă
        </Button>
      </div>
    </DialogContent>
  );
}

export default function FolderDocumentsTable({
  folder,
  documents,
  userId,
}: FolderDocumentsTableProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument(userId, documentId);
      router.refresh(); // Refresh the page to show updated list
    } catch (error) {
      console.error('Error deleting document:', error);
      // You might want to show an error toast here
    }
  };

  const handleCopyLink = async (documentId: string) => {
    const url = `${window.location.origin}/documents/${documentId}/sign`;
    await navigator.clipboard.writeText(url);
    // You might want to show a toast notification here
    alert('Link copiat în clipboard!');
  };

  const handleRefresh = async (documentId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setRefreshingId(documentId);
    router.refresh();
    // Add a minimum delay so the spinner is visible
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshingId(null);
  };

  const getStatusBadge = (document: Document) => {
    const statusConfig = {
      pending: { style: 'bg-orange-500 text-white', label: 'În curs' },
      signed: { style: 'bg-green-500 text-white', label: 'Semnat' },
    };

    return (
      <div className="flex items-center gap-2">
        <Badge className={statusConfig[document.status].style}>
          {statusConfig[document.status].label}
        </Badge>
        {document.status === 'pending' && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-gray-100 transition-transform"
            onClick={(e) => handleRefresh(document.id, e)}
            disabled={refreshingId === document.id}
          >
            <RefreshCw
              className={`h-3 w-3 ${refreshingId === document.id ? 'animate-spin' : ''}`}
            />
          </Button>
        )}
      </div>
    );
  };

  const handleDownload = async (document: Document) => {
    const url = document.status === 'signed' ? document.signedFileUrl : document.fileUrl;
    if (!url) return;

    // Create a temporary link to trigger the download
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${document.title}${document.status === 'signed' ? '_signed' : ''}.pdf`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Data trimitere</TableHead>
            <TableHead>Stare</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell>
                <div className="flex items-start gap-3">
                  <FileText className="mt-1 h-5 w-5 text-gray-400" />
                  <div className="font-medium">{document.title}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{document.email}</span>
                  <div className="flex items-center gap-1 text-green-500">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs">Email sent</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {new Date(document.createdAt).toLocaleDateString('ro-RO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </TableCell>
              <TableCell>{getStatusBadge(document)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelectedDocument(document)}>
                      Vezi detalii
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopyLink(document.id)}>
                      Copiază link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(document)}>
                      Descarcă {document.status === 'signed' ? 'semnat' : ''}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(document.id)}
                    >
                      Șterge
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        {selectedDocument && (
          <DocumentDetails
            document={selectedDocument}
            onClose={() => setSelectedDocument(null)}
            onDelete={handleDelete}
            onRefresh={handleRefresh}
            isRefreshing={refreshingId === selectedDocument.id}
          />
        )}
      </Dialog>
    </div>
  );
}
