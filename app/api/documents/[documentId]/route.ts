import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Document from '@/lib/models/Document';

export async function GET(request: Request, { params }: { params: { documentId: string } }) {
  try {
    await dbConnect();
    const documentId = params.documentId;

    const document = await Document.findOne({ id: documentId });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
