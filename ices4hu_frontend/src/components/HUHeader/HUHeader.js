import "./HUHeader.css"
import logo from "../../images/Hacettepe_Üniversitesi_Logosu 1.png";

function HUHeader() {
    
    return(
        <div className="container">
            <div className="row">
            
              <div className="l1"><img src={logo} alt="Logo" /></div>  
                  
                <div className="parag">
                    <h1>HACETTEPE UNIVERSITY</h1>
                    <p className="p1">Instructor and Course Evaluation Platform</p>
                </div>
            </div>
        </div>
    );
}

export default HUHeader;