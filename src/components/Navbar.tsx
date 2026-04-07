'use client';

import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/sign-in');
  };

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-row md:flex-row items-center md:items-center">
        
        <div className="w-full md:w-1/3 flex justify-start">
          <Link href="/" className="text-xl font-bold">
            True Feedback
          </Link>
        </div>

        <div className="w-full md:w-1/3 flex justify-center my-4 md:my-0">
          {status === 'authenticated' && (
            <span className="text-center">
              Welcome, {user?.username || user?.email}
            </span>
          )}
        </div>

        <div className="w-full md:w-1/3 flex justify-end">
          {status === 'loading' ? (
            <Button
              disabled
              className="bg-slate-100 text-black"
            >
              Loading...
            </Button>
          ) : status === 'authenticated' ? (
            <Button
              onClick={handleLogout}
              className="bg-slate-100 text-black hover:text-white hover:bg-gray-600"
            >
              Logout
            </Button>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-slate-100 text-black hover:text-white hover:bg-gray-600">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
