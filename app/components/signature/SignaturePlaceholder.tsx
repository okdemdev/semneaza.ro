'use client';

import React from 'react';
import { Rnd, DraggableData, RndDragEvent, RndResizeCallback } from 'react-rnd';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

interface SignaturePlaceholderProps {
  onPlaceholderClick: () => void;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  size?: { width: number; height: number };
  onSizeChange?: (size: { width: number; height: number }) => void;
}

export default function SignaturePlaceholder({
  onPlaceholderClick,
  position,
  onPositionChange,
  size = { width: 200, height: 100 },
  onSizeChange,
}: SignaturePlaceholderProps) {
  return (
    <Rnd
      position={position}
      size={size}
      onDragStop={(_e: RndDragEvent, d: DraggableData) => {
        onPositionChange({ x: d.x, y: d.y });
      }}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        onPositionChange(position);
        onSizeChange?.({
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        });
      }}
      bounds="parent"
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      minWidth={100}
      minHeight={50}
      maxWidth={400}
      maxHeight={200}
      resizeHandleStyles={{
        top: { cursor: 'n-resize' },
        right: { cursor: 'e-resize' },
        bottom: { cursor: 's-resize' },
        left: { cursor: 'w-resize' },
        topRight: { cursor: 'ne-resize' },
        bottomRight: { cursor: 'se-resize' },
        bottomLeft: { cursor: 'sw-resize' },
        topLeft: { cursor: 'nw-resize' },
      }}
      default={{
        width: size.width,
        height: size.height,
        x: position.x,
        y: position.y,
      }}
    >
      <div
        className="cursor-move border-2 border-dashed border-blue-500 bg-white/50 p-2 rounded-lg w-full h-full flex flex-col items-center justify-center gap-1 hover:bg-white/70 transition-colors"
        onClick={onPlaceholderClick}
        style={{
          fontSize: `${Math.min(size.width * 0.08, size.height * 0.16)}px`,
        }}
      >
        <PencilSquareIcon
          className="text-blue-500"
          style={{
            width: `${Math.min(size.width * 0.15, size.height * 0.3)}px`,
            height: `${Math.min(size.width * 0.15, size.height * 0.3)}px`,
          }}
        />
        <span className="text-blue-600 font-medium text-center whitespace-nowrap">
          Semnează aici
        </span>
      </div>
    </Rnd>
  );
}
