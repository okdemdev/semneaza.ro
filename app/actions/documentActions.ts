import dbConnect from '@/lib/db';
import Document from '@/lib/models/Document';
import Folder from '@/lib/models/Folder';
import User from '@/lib/models/User';
import mongoose from 'mongoose';

interface DocumentData {
  title: string;
  fileUrl: string;
  email: string;
  signaturePlaceholder?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export async function createDocument(userId: string, folderId: string, documentData: DocumentData) {
  await dbConnect();

  // Verify user exists
  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new Error('User not found');
  }

  // Verify folder exists and belongs to user
  const folder = await Folder.findOne({ id: folderId, user: user._id });
  if (!folder) {
    throw new Error('Folder not found');
  }

  // Create new document
  const document = await Document.create({
    id: new mongoose.Types.ObjectId().toString(),
    user: user._id,
    folder: folder._id,
    title: documentData.title,
    fileUrl: documentData.fileUrl,
    email: documentData.email,
    signaturePlaceholder: documentData.signaturePlaceholder,
    signature: null, // Will be filled when recipient signs
  });

  return document;
}

export async function getDocumentsByFolder(userId: string, folderId: string) {
  await dbConnect();

  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new Error('User not found');
  }

  const folder = await Folder.findOne({ id: folderId, user: user._id });
  if (!folder) {
    throw new Error('Folder not found or access denied');
  }

  const documents = await Document.find({ folder: folder._id }).sort({ createdAt: -1 });
  return documents;
}

export async function getDocument(userId: string, documentId: string) {
  await dbConnect();

  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new Error('User not found');
  }

  const document = await Document.findOne({
    id: documentId,
    user: user._id,
  }).populate('folder');

  if (!document) {
    throw new Error('Document not found or access denied');
  }

  return document;
}

export async function deleteDocument(userId: string, documentId: string) {
  await dbConnect();

  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new Error('User not found');
  }

  const document = await Document.findOne({ id: documentId, user: user._id });
  if (!document) {
    throw new Error('Document not found or access denied');
  }

  await Document.deleteOne({ id: documentId });
  return { success: true };
}
