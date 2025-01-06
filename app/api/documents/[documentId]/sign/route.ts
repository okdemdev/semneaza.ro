import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Document from '@/lib/models/Document';
import { PDFDocument } from 'pdf-lib';
import { useStorage } from '@/app/lib/storage';

export async function POST(request: Request, { params }: { params: { documentId: string } }) {
  try {
    await dbConnect();

    const document = await Document.findOne({ id: params.documentId });
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (document.status === 'signed') {
      return NextResponse.json({ error: 'Document already signed' }, { status: 400 });
    }

    const { signatureData, date } = await request.json();

    // Load the original PDF
    const storage = useStorage();
    const pdfBytes = await fetch(document.fileUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const page = pages[document.signaturePlaceholder.pageNumber - 1];

    // Convert signature data URL to image
    const signatureImage = await pdfDoc.embedPng(signatureData);

    // Calculate signature position (convert from preview coordinates to PDF coordinates)
    const { width, height } = page.getSize();
    const scale = width / document.previewImageWidth; // You'll need to store this when creating preview

    const signatureWidth = document.signaturePlaceholder.width * scale;
    const signatureHeight = document.signaturePlaceholder.height * scale;
    const signatureX = document.signaturePlaceholder.x * scale;
    const signatureY = height - document.signaturePlaceholder.y * scale - signatureHeight;

    // Add signature to PDF
    page.drawImage(signatureImage, {
      x: signatureX,
      y: signatureY,
      width: signatureWidth,
      height: signatureHeight,
    });

    // Save the signed PDF
    const signedPdfBytes = await pdfDoc.save();
    const signedPdfFile = new File([signedPdfBytes], `signed_${document.id}.pdf`, {
      type: 'application/pdf',
    });
    const signedFileUrl = await storage.uploadFile(signedPdfFile);

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
