import { Metadata } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/authOptions';
import CreateClub from './createClub';

export const metadata: Metadata = {
  title: 'Create a New Club',
};

async function CreateClubPage() {
    const session = await getServerSession(authOptions);

    return ( 
        <div className="content">
            <h3>Create a Club.</h3>
            <p className="centred">Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum iste delectus quod maiores quaerat ipsam soluta beatae itaque eum deserunt. Fugiat, pariatur mollitia blanditiis rem molestias corporis voluptate in. Soluta. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda repellat eaque minus, deserunt sed neque ea hic. Corporis animi, totam minima magni esse quas, adipisci doloremque earum numquam magnam ratione!</p>
                

            <div className="forms">
                <CreateClub />
            </div>
        </div>
    );
}
 
export default CreateClubPage;
