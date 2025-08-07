import PersonalLinks from "./PersonalLinks";
import ArcheryLinks from "./ArcheryLinks";

import { APP_NAME } from "@/app/lib/constants";

const Banner = () => {
    return (
        <div className="dashboard-image-container">
            <h1>{ APP_NAME }</h1>
            <p>
                Archery Tool is an open-source platform designed to help clubs manage memberships, track scores, and organize achievements with ease. The system supports multiple user roles, allowing administrators to oversee club operations, records officers to maintain score histories, and members to view their progress and participate in events. With a focus on security and accessibility, Archery Tool offers a modern, user-friendly alternative to paid solutions, ensuring clubs of all sizes can benefit from streamlined management and transparent record keeping.
            </p>
            <p>
                The tool is free to use and is covered by a <a href="https://github.com/corey-richardson/archery-tool/blob/main/LICENSE" target="_blank" style={{color: "white"}}>GNU General Public License v3.0</a>. This means you are free to use, modify, and share the software, even for commercial purposes, as long as any distributed versions or derivatives remain open-source and are also licensed under the GPL v3.0. You must provide attribution and include the original license when redistributing or publishing changes. Proprietary use or relicensing is not permitted.
            </p>

            <ArcheryLinks />
            <PersonalLinks />

            <p className="small">&copy; corey-richardson 2025, Photo by Jonathon Yau via Archery GB</p>
        </div>
    );
}

export default Banner;
