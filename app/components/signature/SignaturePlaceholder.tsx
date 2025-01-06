'use client';

import React from 'react';
import { Rnd, DraggableData, RndDragEvent } from 'react-rnd';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

interface SignaturePlaceholderProps {
  onPlaceholderClick: () => void;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
}

export default function SignaturePlaceholder({
  onPlaceholderClick,
  position,
  onPositionChange,
}: SignaturePlaceholderProps) {
  return (
    <Rnd
      position={position}
      onDragStop={(_e: RndDragEvent, d: DraggableData) => {
        onPositionChange({ x: d.x, y: d.y });
      }}
      bounds="parent"
      enableResizing={false}
      default={{
        width: 200,
        height: 100,
        x: position.x,
        y: position.y,
      }}
    >
      <div
        className="cursor-move border-2 border-dashed border-blue-500 bg-white/50 p-4 rounded-lg w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-white/70 transition-colors"
        onClick={onPlaceholderClick}
      >
        <PencilSquareIcon className="w-6 h-6 text-blue-500" />
        <span className="text-sm text-blue-600 font-medium">Semnează aici</span>
      </div>
    </Rnd>
  );
}
