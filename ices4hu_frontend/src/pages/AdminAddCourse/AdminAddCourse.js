import NavBar from "../../components/NavBar/NavBar";
import HUHeader from "../../components/HUHeader/HUHeader.js";
import AddCourse from "../../components/AddCourse/AddCourse.js";
import { useLocation } from "react-router-dom";

function AdminAddCourse() {
    const location = useLocation();
    const userID = location.state.userID;
    const userType = location.state.userType;
    console.log(userID);
    return (
        <div>
            <div>
                <NavBar  userID={userID} userType={userType}/>
            </div>
            <div className="parent">
                <div className="childa">
                    <HUHeader></HUHeader>
                </div>
                <div className="childb">
                    <AddCourse></AddCourse>
                </div>
                
            </div>
        </div>
        
    );
}

export default AdminAddCourse;