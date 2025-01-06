import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Document from '@/lib/models/Document';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: Request, { params }: { params: { documentId: string } }) {
  try {
    const documentId = await Promise.resolve(params.documentId);
    await dbConnect();

    const document = await Document.findOne({ id: documentId });
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (document.status === 'signed') {
      return NextResponse.json({ error: 'Document already signed' }, { status: 400 });
    }

    const { signatureData, date, signedFileUrl } = await request.json();

    // Update document in database
    document.signature = { dataUrl: signatureData, date };
    document.status = 'signed';
    document.signedFileUrl = signedFileUrl;
    await document.save();

    return NextResponse.json({ success: true, signedFileUrl });
  } catch (error) {
    console.error('Error signing document:', error);
    return NextResponse.json({ error: 'Failed to sign document' }, { status: 500 });
  }
}
