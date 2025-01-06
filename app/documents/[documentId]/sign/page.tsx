import { use } from 'react';
import SignDocumentClient from './SignDocumentClient';

export default function SignDocumentPage({ params }: { params: { documentId: string } }) {
  const documentId = use(Promise.resolve(params.documentId));
  return <SignDocumentClient documentId={documentId} />;
}
