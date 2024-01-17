import NavBar from "../../components/NavBar/NavBar";
import HUHeader from "../../components/HUHeader/HUHeader.js";
import SignInRectangle from "../../components/SignInRectangle/SignInRectangle.js"

function SignInPage() {
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
                    <SignInRectangle></SignInRectangle>
                </div>
                
            </div>
        </div>
        
    );
}

export default SignInPage;