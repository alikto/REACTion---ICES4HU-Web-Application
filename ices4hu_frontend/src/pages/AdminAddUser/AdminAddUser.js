import NavBar from "../../components/NavBar/NavBar";
import HUHeader from "../../components/HUHeader/HUHeader.js";
import AddUser from "../../components/AddUser/AddUser.js";
import { useLocation } from "react-router-dom";

function AdminAddUser() {
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
                    <AddUser></AddUser>
                </div>
                
            </div>
        </div>
        
    );
}

export default AdminAddUser;