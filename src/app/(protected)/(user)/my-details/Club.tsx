import { ClubType } from "./ClubType";
import Link from "next/link";

const Club = ({ club }: { club: ClubType }) => {
    return ( 
        <div className="wider scorecard scorecard-flex">
            { /* Prettify me */ }
            <Link href={`../club/${club.id}`}><h3>{ club.name }</h3></Link> {/** If Admin, link directly to Members Tools? */}
            { club.membershipDetails.roles.includes('ADMIN') && <p>Admin</p> }
        </div>
     );
}
 
export default Club;

