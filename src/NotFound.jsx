import { Link } from "react-router-dom";

const NotFound = () => {
    return (  
        <div className="content">
            <h2>Sorry.</h2>
            <p>That page cannot be found. <Link to="/">Back to the dashboard?</Link></p>
        </div>
    );
}
 
export default NotFound;
