'use client';

import { useState, useEffect } from 'react';
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import type { RenderError, LoadError } from '@react-pdf-viewer/core';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface PDFViewerProps {
  file: File;
}

export default function PDFViewer({ file }: PDFViewerProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    // Cleanup
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const renderError: RenderError = (error: LoadError) => {
    console.error('PDF Error:', error);
    return (
      <div className="text-center p-5 text-red-500">Failed to load PDF. Please try again.</div>
    );
  };

  if (!url) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 bg-gray-100 p-4 overflow-auto">
      <div className="h-full">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            fileUrl={url}
            plugins={[defaultLayoutPluginInstance]}
            defaultScale={SpecialZoomLevel.PageFit}
            renderError={renderError}
          />
        </Worker>
      </div>
    </div>
  );
}
