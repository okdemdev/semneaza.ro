import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  console.log('Kinde user data:', user);

  if (!user || user === null || !user.id) {
    throw new Error('Something went wrong');
  }

  await dbConnect();

  // Check for existing user by either ID or email
  let dbUser = await User.findOne({
    $or: [{ id: user.id }, { email: user.email }],
  });

  console.log('Existing user in DB:', dbUser);

  if (!dbUser) {
    console.log('Creating new user with data:', {
      id: user.id,
      firstName: user.given_name,
      lastName: user.family_name,
      email: user.email,
    });

    try {
      dbUser = await User.create({
        id: user.id,
        firstName: user.given_name ?? '',
        lastName: user.family_name ?? '',
        email: user.email ?? '',
        profileImage: user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
      });
      console.log('New user created:', dbUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  return NextResponse.redirect('http://localhost:3000/dashboard');
}
