import { ClubType } from "./ClubType";
import Link from "next/link";

const Club = ({ club }: { club: ClubType }) => {
    return ( 
        <div className="clubcard">
            <Link href={`../club/${club.id}`}><h3 className="left">{ club.name }</h3></Link>
            { 
                club.membershipDetails.roles.includes("ADMIN") && <p className="small">ADMIN</p> || 
                club.membershipDetails.roles.includes("RECORDS") && <p className="small">RECORDS</p> || 
                club.membershipDetails.roles.includes("COACH") && <p className="small">COACH</p> || 
                club.membershipDetails.roles.includes("MEMBER") && <p className="small">MEMBER</p>
            }
        </div>
     );
}
 
export default Club;

