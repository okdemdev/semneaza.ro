import { requireUser } from '@/lib/requireUser';

export default async function Home() {
  const user = await requireUser();
  return (
    <div>
      <h1>Welcome {user.given_name}</h1>
    </div>
  );
}
