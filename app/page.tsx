import { requireUser } from '@/lib/requireUser';
import { RegisterLink, LoginLink, LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await requireUser();

  if (user) {
    redirect('/dashboard');
  } else {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <LoginLink>Login</LoginLink>
        <RegisterLink>Register</RegisterLink>
      </div>
    );
  }
}
