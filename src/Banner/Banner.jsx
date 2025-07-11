import PersonalLinks from "./PersonalLinks";
import ArcheryLinks from "./ArcheryLinks";

import { APP_NAME } from "../Constants";

const Banner = () => {
    return ( 
        <div className="dashboard-image-container">
            <h1>{ APP_NAME }</h1>
            <p>This app is a tool for managing archery club membership and records. It allows club administrators to register members and maintain detailed records of scores and achievements. The interface is designed to be user-friendly and easy to use, and provides an Open-Source alternative to existing paid-products.</p>

            <PersonalLinks />
            <ArcheryLinks />
            
            <p className="small">&copy; corey-richardson 2025, Photo by Jonathon Yau via Archery GB</p>
        </div>
     );
}
 
export default Banner;
