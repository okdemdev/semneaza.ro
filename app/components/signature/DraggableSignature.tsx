'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableSignatureProps {
  id: string;
  signatureData: string;
}

export default function DraggableSignature({ id, signatureData }: DraggableSignatureProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    position: 'absolute' as const,
    cursor: 'move',
    userSelect: 'none' as const,
    // Add a subtle shadow to make it stand out against the PDF
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <img src={signatureData} alt="Signature" className="max-w-[200px] h-auto" draggable={false} />
    </div>
  );
}
