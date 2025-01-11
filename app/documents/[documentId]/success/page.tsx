import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  params: Promise<{ documentId: string }>;
  searchParams: Promise<{ title?: string; url?: string }>;
}

export default async function DocumentSuccessPage({ params, searchParams }: Props) {
  const { documentId } = await params;
  const { title, url } = await searchParams;

  if (!url) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-500">Link invalid</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">Document semnat cu succes!</h1>
          <p className="mt-2 text-gray-600">{title || 'Documentul'} a fost semnat cu succes.</p>

          <div className="mt-8 space-y-4">
            <Link
              href={url}
              className="block w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Descarcă documentul semnat
            </Link>

            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                Înapoi la dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
