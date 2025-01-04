import dbConnect from '@/lib/db';
import Folder from '@/lib/models/Folder';
import User from '@/lib/models/User';
import mongoose from 'mongoose';

export async function createFolder(
  userId: string,
  folderData: { name: string; description: string }
) {
  await dbConnect();

  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new Error('User not found');
  }

  const folder = new Folder({
    ...folderData,
    user: user._id,
    id: new mongoose.Types.ObjectId().toString(),
  });
  await folder.save();
  return folder;
}

export async function getFoldersByUser(userId: string) {
  await dbConnect();

  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new Error('User not found');
  }

  const folders = await Folder.find({ user: user._id }).sort({ createdAt: -1 });
  return folders;
}

export async function deleteFolder(folderId: string, userId: string) {
  await dbConnect();

  // Find the user first
  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new Error('User not found');
  }

  // Find the folder and verify it belongs to the user
  const folder = await Folder.findOne({ id: folderId, user: user._id });
  if (!folder) {
    throw new Error('Folder not found or access denied');
  }

  // Delete the folder
  await Folder.deleteOne({ id: folderId });
  return { success: true };
}

export async function getFolder(folderId: string, userId: string) {
  await dbConnect();

  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new Error('User not found');
  }

  const folder = await Folder.findOne({ id: folderId, user: user._id });
  if (!folder) {
    throw new Error('Folder not found or access denied');
  }

  return folder;
}
