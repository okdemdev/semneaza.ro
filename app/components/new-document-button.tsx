'use client';

import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface NewDocumentButtonProps {
  folderId: string;
}

export default function NewDocumentButton({ folderId }: NewDocumentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setIsLoading(true);
    router.push(`/dashboard/folders/${folderId}/createDocument`);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      Document nou
    </Button>
  );
}
