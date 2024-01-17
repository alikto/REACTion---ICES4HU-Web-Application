import "./Login.css";

import NavBar from "../../components/NavBar/NavBar.js";
import HUHeader from "../../components/HUHeader/HUHeader.js";
import LoginRectangle from "../../components/LoginRectangle/LoginRectangle.js"

function Login() {
    return (
        <div>
            <div>
                <NavBar></NavBar>
            </div>
            <div className="parent">
                <div className="childa">
                    <HUHeader></HUHeader>
                </div>
                <div className="childb">
                    <LoginRectangle></LoginRectangle>
                </div>
                
            </div>
        </div>
        
        
    );
}

export default Login;