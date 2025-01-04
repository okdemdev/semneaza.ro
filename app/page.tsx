import { RegisterLink, LoginLink } from '@kinde-oss/kinde-auth-nextjs/components';

export default function Home() {
  return (
    <div>
      <LoginLink>Login</LoginLink>
      <RegisterLink>Register</RegisterLink>
    </div>
  );
}
