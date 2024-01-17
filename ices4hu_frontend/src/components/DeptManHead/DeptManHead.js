import "./DeptManHead.css"
import imgSource from '../../images/huICES4HU.png'
import { useNavigate, useLocation } from "react-router-dom";



function DeptManHome() {
    const navigate = useNavigate();
    const location = useLocation();

    const userID = location.state.userID;
    const userType = location.state.userType;

    const handleAssignInstToCourse=(event) =>{
        console.log('handleAssignInstToCourse is clicked')
        event.preventDefault();

        navigate('/deptMan/AssignInstToCourse', {state:{userID, userType}});
    }

    const handleAccessSurveys=(event) =>{
        console.log('handleAccessSurveys is clicked')

        navigate('/deptMan/AccessSurveys', { state: { userID, userType} });
    }

    const handleShareAllResults=(event) =>{
        console.log('handleShareAllResults is clicked')
          fetch('http://localhost:8081/api/surveys/shareResultsAll/'+userID, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
          })
            .then(response => {
              if (response.status === 200) {
                console.log('Successful created');
                alert('Surveys were successfully published');
              } else {
                alert('Invalid request. Please try again.');
                console.log(`Error: ${response.status}`);
                // Handle other response status codes here
              }
              return response.json();
            })
            
            .catch(error => {
              console.error('Error:', error);
            });
    }

    return(
        <div className="head">
            <div className="dmButtonCont" style={{width: '70%', float:'left', marginTop:'60px'}}>
                <div style={{display:'flex', justifyContent:'center', }}>
                    <button className="dmButton"
                            onClick={handleAssignInstToCourse}>
                        Assign Instructor to Course</button>
                    <button className="dmButton"
                            onClick={handleAccessSurveys}>                            
                        Access Surveys</button>
                </div>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <button className="dmButton"
                            onClick={handleShareAllResults}>
                        Share Results All</button>
                </div>
                
                
            </div>
            <div className="dmHU" style={{width: '30%', float:'right'}}>
                <img src={imgSource} style={{width:'100%', height:'auto'}} />
            </div>
            

        </div>
    )
}

export default DeptManHome;