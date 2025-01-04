import { createDocument } from '@/app/actions/documentActions';
import { requireUser } from '@/lib/requireUser';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function CreateDocumentPage({ params }: { params: { folderId: string } }) {
  async function handleSubmit(formData: FormData) {
    'use server';

    const user = await requireUser();
    const title = formData.get('title')?.toString() || '';
    const email = formData.get('email')?.toString() || '';

    await createDocument(user.id, params.folderId, { title, email });
    redirect(`/dashboard/folders/${params.folderId}`);
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link
        href={`/dashboard/folders/${params.folderId}`}
        className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
      >
        ← Back to Folder
      </Link>
      <h1 className="text-2xl font-bold mb-4">Create New Document</h1>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Document Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Document
        </button>
      </form>
    </div>
  );
}
