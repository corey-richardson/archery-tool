import Banner from '@/app/ui/banner/Banner';
import LoginForm from "@/app/ui/login-form";
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
                <b>Welcome to the Archery Club Management Tool!</b> <br /><br />
                <span>
                    This website is designed to help archery clubs manage their members, records, and events efficiently and securely. Whether you are a club administrator, records officer, or a regular member, you will find tools tailored to your role:
                </span>
                <div style={{marginTop: '1rem', marginBottom: '1rem'}}>
                    <b>Administrators:</b> can manage club details, invite new members, assign roles, and oversee all club activities.<br />
                    <b>Records Officers:</b> have access to member scores, can update records, and help maintain the club's competitive history.<br />
                    <b>Members:</b> can view their personal details, submit scores, track their progress, and participate in club events.<br />
                </div>
                <span>
                    <br />
                    The platform uses secure Single Sign-On (SSO) authentication to protect your data and ensure only authorised users can access sensitive information. If you are new, please log in below and contact your Club's administrator for an invite. For more information about your permissions, contact your Club's Admin or Records Officer.
                </span>
            </div>

            { !session && <div className="forms">
                <LoginForm />
            </div> }

            { !!session && (
                <div style={{"display": "flex", "justifyContent": "center", "gap": "1.5rem"}} className="centred">
                    <Link className="btn btn-primary" href="my-details">My Details</Link>
                    <SignOutButton />
                </div>
            )}
        </div>
    );
}
