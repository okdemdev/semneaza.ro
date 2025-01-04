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
import { FileText, CheckCircle2, MoreVertical, Mail, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';

type DocumentStatus = 'in_progress' | 'signed';

interface Document {
  id: string;
  title: string;
  email: string;
  createdAt: string;
}

interface Folder {
  id: string;
  name: string;
  description: string;
}

interface FolderDocumentsTableProps {
  folder: Folder;
  documents: Document[];
}

interface DocumentDetailsProps {
  document: Document;
  onClose: () => void;
}

function DocumentDetails({ document, onClose }: DocumentDetailsProps) {
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
          <p className="text-sm text-gray-500">În curs</p>
        </div>
        <div>
          <h3 className="font-medium mb-1">Semnatari</h3>
          <div className="flex items-center text-sm text-gray-500">
            <Mail className="h-4 w-4 mr-2" />
            {document.email}
            <Badge className="ml-2 bg-green-500 text-white">Semnat</Badge>
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-1">Dată Trimitere</h3>
          <p className="text-sm text-gray-500">
            {new Date(document.createdAt).toLocaleDateString('ro-RO')}
          </p>
        </div>
        <div>
          <h3 className="font-medium mb-1">Dată Finalizare</h3>
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
        <Button variant="destructive" className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          Șterge
        </Button>
        <Button>Descarcă</Button>
      </div>
    </DialogContent>
  );
}

export default function FolderDocumentsTable({ folder, documents }: FolderDocumentsTableProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const getStatusBadge = (status: DocumentStatus) => {
    const statusConfig = {
      in_progress: { style: 'bg-orange-500 text-white', label: 'În curs' },
      signed: { style: 'bg-green-500 text-white', label: 'Semnat' },
    };

    return <Badge className={statusConfig[status].style}>{statusConfig[status].label}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <Link
          href="/dashboard/folders"
          className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
        >
          ← Back to Folders
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold mt-2">{folder.name}</h1>
          <Link href={`/dashboard/folders/${folder.id}/createDocument`}>
            <Button>Create Document</Button>
          </Link>
        </div>
        <p className="text-gray-600 mt-2">{folder.description}</p>
      </div>

      <div className="mt-8">
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
                <TableCell>{new Date(document.createdAt).toLocaleDateString('ro-RO')}</TableCell>
                <TableCell>
                  {getStatusBadge(
                    ['in_progress', 'signed'][Math.floor(Math.random() * 2)] as DocumentStatus
                  )}
                </TableCell>
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
                      <DropdownMenuItem>Descarcă</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Șterge</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        {selectedDocument && (
          <DocumentDetails document={selectedDocument} onClose={() => setSelectedDocument(null)} />
        )}
      </Dialog>
    </div>
  );
}
