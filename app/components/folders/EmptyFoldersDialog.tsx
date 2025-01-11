'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function EmptyFoldersDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bun venit în aplicație!</DialogTitle>
          <DialogDescription className="pt-4">
            Pentru a începe și pentru a rămâne organizat, primul pas este să creezi un folder.
            Folderele te ajută să îți organizezi documentele într-un mod eficient.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => router.push('/dashboard/folders/new')}
          >
            Creează primul folder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
