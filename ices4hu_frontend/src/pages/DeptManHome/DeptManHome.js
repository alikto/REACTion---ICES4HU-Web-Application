import NavBar from "../../components/NavBar/NavBar";
import "./DeptManHome.css"
import DeptManHead from "../../components/DeptManHead/DeptManHead.js"; 
import { useLocation } from "react-router-dom";

function DeptManHome
() {
    const location = useLocation();
    const userID = location.state.userID;
    const userType = location.state.userType;
    return (
        <div>
            <div>
                <NavBar  userID={userID} userType={userType}/>
            </div>
            <div>
                <DeptManHead></DeptManHead>
            </div>
        </div>
    );
}

export default DeptManHome;