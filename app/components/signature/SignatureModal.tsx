'use client';

import { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signature: string) => void;
}

export default function SignatureModal({ isOpen, onClose, onSave }: SignatureModalProps) {
  const signaturePadRef = useRef<any>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleClear = () => {
    signaturePadRef.current?.clear();
    setIsEmpty(true);
  };

  const handleSave = () => {
    if (!isEmpty) {
      const signatureData = signaturePadRef.current?.getTrimmedCanvas().toDataURL('image/png');
      onSave(signatureData);
      onClose();
    }
  };

  const handleBegin = () => {
    setIsEmpty(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Draw your signature</DialogTitle>
        </DialogHeader>
        <div className="border rounded-lg p-4 bg-white">
          <SignaturePad
            ref={signaturePadRef}
            canvasProps={{
              className: 'signature-canvas w-full h-[200px] border rounded',
              style: { backgroundColor: 'white' },
            }}
            onBegin={handleBegin}
          />
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isEmpty}>
              Save Signature
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
