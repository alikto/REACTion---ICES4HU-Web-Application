import React from 'react';
import NavBar from "../../components/NavBar/NavBar.js";
import SignupRectangle from '../../components/SignupRectangle/SignupRectangle.js';

function SignupPage() {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    
  };

  const flexContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    padding: '20px',
  };


  return (
    <div style={containerStyle}>
      <NavBar />
      <div style={flexContainerStyle}>
          <h1 style={{"text-align":" center"}}>
            <img style={{width: "50px",
                        height: "50px",
                        marginLeft: "10px"}} src='ices4hu_frontend/src/images/Hacettepe_Üniversitesi_Logosu 1.png' alt=''></img>
            <span style={{color:"black",
                      fontSize:"64px",
                      fontWeight: '800',
                      lineHeight: '78px',
                      textShadow: '0px 4px 5px rgba(91, 91, 91, 0.45)'}}><br/>HACETTEPE<br />UNIVERSITY<br />
            </span>

            <span style={{color: '#3A3A3A',
                      fontWeight:'300',
                      fontSize:"64px",
                      lineHeight: "78px",
                      textShadow: '0px 4px 5px rgba(91, 91, 91, 0.45)'
                      }}>Instructor and <br />Course Evaluation<br /> Platform

            </span>
          </h1>
        <SignupRectangle />
      </div>
    </div>
  );
}



export default SignupPage;
