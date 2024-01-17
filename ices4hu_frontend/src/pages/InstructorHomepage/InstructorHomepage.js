import "./InstructorHomepage.css"
import NavBar from "../../components/NavBar/NavBar";
import LogoForHomepage from "../../components/LogoForHomepage/LogoForHomepage.js";
import CourseSurveyCreation from "../../components/CourseSurveyCreation/CourseSurveyCreation";
import InstructorSurveyCreation from "../../components/InstructorSurveyCreation/InstructorSurveyCreation";
import EditSurveyInstructor from "../../components/EditSurveyInstructor/EditSurveyInstructor";
import CheckResultsofSurveysInst from "../../components/CheckResultsofSurveysInst/CheckResultsofSurveysInst";
import { useNavigate, useLocation } from "react-router-dom";




function InstructorHomepage() {
    
    const location = useLocation();
    const userID = location.state.userID;
    const userType = location.state.userType;

    function printID() {
        console.log(userID);
    }

    return(
        <div>
            <div>
                <NavBar  userID={userID} userType={userType}/>
                <LogoForHomepage></LogoForHomepage>
                <div className="heading_instructor_container">
                    <p className="heading_instructor"> Instructor and</p>
                    <p className="heading_instructor">Course Evaluation Survey</p>
                </div>
            </div>
            <div id="aboutsurvey">
                <div>
                    <div className="two_buttons_instructor">
                        <button className="btn instHomepageBTN" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                            Create Survey About Course
                        </button>
                        <button className="btn instHomepageBTN" data-bs-toggle="collapse" data-bs-target="#collapseEditSurvey" aria-expanded="false" aria-controls="collapseEditSurvey">
                            Edit Survey
                        </button>
                    </div>
                    <div className="two_buttons_instructor">
                        <button className="btn instHomepageBTN" data-bs-toggle="collapse" data-bs-target="#collapseInstructorSurvey" aria-expanded="false" aria-controls="collapseInstructorSurvey">
                            Create Survey About Yourself
                        </button>
                        <button className="btn instHomepageBTN" data-bs-toggle="collapse" data-bs-target="#collapseCheckResults" aria-expanded="false" aria-controls="collapseCheckResults">
                            Check Results of Survey 
                        </button>
                    </div>
                </div>
                <div className="collapse" id="collapseExample" data-bs-parent="#aboutsurvey">
                    <div>
                        <CourseSurveyCreation></CourseSurveyCreation>
                    </div>
                </div>
                <div className="collapse" id="collapseEditSurvey" data-bs-parent="#aboutsurvey">
                    <div>
                        <EditSurveyInstructor></EditSurveyInstructor>
                    </div>
                </div>
                <div className="collapse" id="collapseInstructorSurvey" data-bs-parent="#aboutsurvey">
                    <div>
                        <InstructorSurveyCreation></InstructorSurveyCreation>
                    </div>
                </div>
                <div className="collapse" id="collapseCheckResults" data-bs-parent="#aboutsurvey">
                    <div>
                        <CheckResultsofSurveysInst></CheckResultsofSurveysInst>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InstructorHomepage;