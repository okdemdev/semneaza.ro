import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Document from '@/lib/models/Document';

export async function GET(request: Request, { params }: { params: { documentId: string } }) {
  try {
    await dbConnect();

    const document = await Document.findOne({ id: params.documentId });
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: document.id,
      title: document.title,
      email: document.email,
      fileUrl: document.fileUrl,
      previewImageUrl: document.previewImageUrl,
      signaturePlaceholder: document.signaturePlaceholder,
      status: document.status,
      createdAt: document.createdAt,
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json({ error: 'Error fetching document' }, { status: 500 });
  }
}
