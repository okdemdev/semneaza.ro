import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  params: { documentId: string };
  searchParams: { title: string; url: string };
}

export default function DocumentSuccessPage({ params, searchParams }: Props) {
  const { title, url } = searchParams;

  if (!url) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-500">Link invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Documentul a fost semnat cu succes!
          </h1>

          <p className="text-gray-600 mb-8">
            Documentul a fost semnat și trimis la compania ce a cerut semnătura.
          </p>

          <div className="space-y-4">
            <a href={url} download={`${title || 'document'}_signed.pdf`} className="block w-full">
              <Button className="w-full">Descarcă documentul semnat</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
