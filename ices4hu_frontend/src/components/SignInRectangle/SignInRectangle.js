import React, { useState, createContext } from "react";
import "./SignInRectangle.css";
import { useNavigate } from "react-router-dom";


export let Context;
function SignInRectangle() {
  const navigate = useNavigate();
  
  const handleAdmin = (event) => {
    event.preventDefault(); 
    
    navigate('/login', { state: { userType: 'Administrator' } });
  };
  const handleStudent = (event) => {
    console.log(event)
    event.preventDefault();
    navigate('/login', { state: { userType: 'Student' } });
  };
  const handleInstructor = (event) => {
    console.log(event)
    event.preventDefault();
    navigate('/login', { state: { userType: 'Instructor' } });
  };
  const handleDepartmentmanager = (event) => {
    console.log(event)
    event.preventDefault();
    navigate('/login', { state: { userType: 'DepartmentManager' } });
  }; 
  const handleClick = (event) => {
    console.log(event)
    event.preventDefault();
    navigate('/signup');
  }
  return(
    <div className="container">
      <div className="row">
        <div>
        <form>
          <div className="card sigrectcard">
            <div className="h">Sign in as</div>
            <div className="card-body">

                <button type="submit" value={"Administrator"} className="adm" onClick={handleAdmin}>Admin</button>
                <button type="submit" value={"Student"} className="stu" onClick={handleStudent}>Student</button>
                <button type="submit" value={"Instructor"} className="inst" onClick={handleInstructor}>Instructor</button>
                <button type="submit" value={"DepartmentManager"} className="depmng" onClick={handleDepartmentmanager}>Department Manager</button>
              <div className="clk">for sign up</div>
              <div className="clk2"
              onClick={handleClick}
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                
              }}>Click here</div>
            </div>
          </div>
          </form>
        </div>
      </div>
    </div>
    
  );



 
}


export default SignInRectangle;