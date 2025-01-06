import dbConnect from '@/lib/db';
import Document from '@/lib/models/Document';
import Folder from '@/lib/models/Folder';
import User from '@/lib/models/User';
import mongoose from 'mongoose';

export async function createDocument(
  userId: string,
  folderId: string,
  documentData: { title: string; email: string; fileUrl: string }
) {
  await dbConnect();

  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new Error('User not found');
  }

  const folder = await Folder.findOne({ id: folderId, user: user._id });
  if (!folder) {
    throw new Error('Folder not found or access denied');
  }

  const document = new Document({
    ...documentData,
    id: new mongoose.Types.ObjectId().toString(),
    folder: folder._id,
    user: user._id,
  });

  await document.save();
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
