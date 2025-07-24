import Link from "next/link";
import { APP_NAME } from "./lib/constants";

const Unauthenticated = () => {
    return ( 
        <div className="content">
            <h1>{ APP_NAME }</h1>
            
            <div className="content">
                <h2>You're not signed in!</h2>
                <Link href="/">Sign in here.</Link>
            </div>
        </div>
     );
}
 
export default Unauthenticated;