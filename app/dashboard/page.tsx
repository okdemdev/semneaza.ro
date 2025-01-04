import { requireUser } from '@/lib/requireUser';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';

export default async function Home() {
  const user = await requireUser();
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome to dashboard page {user.given_name}</h1>
        <LogoutLink className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </LogoutLink>
      </div>
    </div>
  );
}
