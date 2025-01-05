import { requireUser } from '@/lib/requireUser';
import { RegisterLink, LoginLink, LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export default async function Home() {
  const user = await requireUser();

  if (user) {
    await dbConnect();
    const dbUser = await User.findOne({ id: user.id });

    if (!dbUser) {
      redirect('/api/auth/creation');
    }

    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <LoginLink>Login2</LoginLink>
      <RegisterLink>Register2</RegisterLink>
    </div>
  );
}
