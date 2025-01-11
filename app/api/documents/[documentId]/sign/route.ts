import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Document from '@/lib/models/Document';

interface RouteParams {
  params: Promise<{ documentId: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { documentId } = await params;
    await dbConnect();

    const document = await Document.findOne({ id: documentId });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const body = await request.json();
    const { signatureData, date, signedFileUrl } = body;

    document.status = 'signed';
    document.signedFileUrl = signedFileUrl;
    document.signatureData = signatureData;
    document.signedAt = date;

    await document.save();

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error signing document:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
