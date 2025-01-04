import { createFolder, getFoldersByUser } from '@/app/actions/folderActions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, folderData } = await request.json();
    const folder = await createFolder(userId, folderData);
    return NextResponse.json(folder);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const userId = request.headers.get('userId'); // Example: pass userId in headers
  if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

  try {
    const folders = await getFoldersByUser(userId);
    return NextResponse.json(folders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
