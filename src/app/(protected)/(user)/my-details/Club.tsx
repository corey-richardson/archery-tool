import { ClubType } from "./ClubType";

const Club = ({ club }: { club: ClubType }) => {
    return ( 
        <>
            { /* Prettify me */ }
            <p>{ club.name }</p>
            { club.membershipDetails.roles.includes('ADMIN') && <p>Admin</p> }
        </>
     );
}
 
export default Club;

