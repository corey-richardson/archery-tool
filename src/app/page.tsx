import Banner from '@/app/ui/banner/Banner';
import AuthForms from './ui/auth-forms';
import Link from 'next/link';

export default function Home() {
  const loggedIn = false;

  return (
    <div className="content">
            <Banner />

            <div className="content centred">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>

            {!loggedIn && <AuthForms /> }

            {loggedIn && (
                <div className="centred">
                    <p>Go to <Link href="/my-details">My Details</Link>?</p>
                </div>
            )}
        </div>
  );
}
