'use client';

import { useEdgeStore } from './edgestore';

export function useStorage() {
  const { edgestore } = useEdgeStore();

  const uploadFile = async (file: File): Promise<string> => {
    try {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          console.log('Upload progress:', progress);
        },
      });
      return res.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  };

  return { uploadFile };
}
