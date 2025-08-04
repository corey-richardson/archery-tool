import Banner from '@/app/ui/banner/Banner';
import AuthForms from '../ui/auth-forms';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import Link from 'next/link';
import SignOutButton from '../ui/signOutButton';

export default async function Home() {

    const session = await getServerSession(authOptions);

    return (
        <div className="content">
            <Banner />

            <div className="content centred">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>

            { !session && <AuthForms /> }

            { !!session && (
                <div style={{"display": "flex", "justifyContent": "center", "gap": "1.5rem"}} className="centred">
                    <Link className="btn btn-primary" href="my-details">My Details</Link>
                    <SignOutButton />
                </div>
            )}
        </div>
    );
}
