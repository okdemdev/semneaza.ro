import { createFolder } from '@/app/actions/folderActions';
import FolderForm from '@/app/components/FolderForm';
import { requireUser } from '@/lib/requireUser';
import { redirect } from 'next/navigation';

export default async function NewFolderPage() {
  async function handleSubmit(formData: FormData) {
    'use server';

    const user = await requireUser(); // Fetch authenticated user
    const userId = user.id; // Get user's ID from Kinde session

    const name = formData.get('name')?.toString() || '';
    const description = formData.get('description')?.toString() || '';

    await createFolder(userId, { name, description });

    redirect('/dashboard/folders');
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Creeaza un folder nou</h1>
      <FolderForm onSubmit={handleSubmit} />
    </div>
  );
}
