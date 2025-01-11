'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface DeleteFolderButtonProps {
  folderId: string;
  deleteAction: (folderId: string) => Promise<void>;
}

export default function DeleteFolderButton({ folderId, deleteAction }: DeleteFolderButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    try {
      setIsDeleting(true);
      await deleteAction(folderId);
      router.refresh();
    } catch (error) {
      console.error('Error deleting folder:', error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50 flex items-center gap-2"
    >
      {isDeleting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Se șterge...
        </>
      ) : (
        'Șterge'
      )}
    </button>
  );
}
