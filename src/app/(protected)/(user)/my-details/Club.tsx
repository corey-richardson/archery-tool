import { ClubType } from "./ClubType";
import Link from "next/link";

const Club = ({ club }: { club: ClubType }) => {

    const rolePriority = ["ADMIN", "RECORDS", "COACH", "MEMBER"];
    const userRole = rolePriority.find(role => club.membershipDetails.roles.includes(role));
    const isLink = ["ADMIN", "RECORDS"].some(role => club.membershipDetails.roles.includes(role));

    return (
        <div className="clubcard">

            {isLink ? (
                <Link href={`../admin/members/${club.id}`}><h3 className="left">{club.name}</h3></Link>
            ) : (
                <h3 className="left">{club.name}</h3>
            )}

            {userRole && <p className="small">{userRole}</p>}
        </div>
    );
}

export default Club;
