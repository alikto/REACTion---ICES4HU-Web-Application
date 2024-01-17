import React, { useState } from 'react';
import './SignupRectangle.css'


function SignupRectangle() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Email: ${email}, Password: ${password}`);
    // Send email and password to server for signup process
  };

  
  const inputStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: '#d9d9d9',
    marginBottom: '40px',
    fontSize: '30px',
    width: '400px',
    height: '70px',
    boxSizing: 'border-box',
    background: '#d9d9d9'
  };


  

  return (
    <div className='containerStyle'>
        <h1  style={{"color":"white", "margin":"40px"}}>SignUp</h1>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <label style={{display: 'flex', flexDirection: 'column'}}>
            <span className='iconStyle'>
              <i className="fa fa-envelope-o"></i>
            </span>
            <input type="email" value={email} placeholder='Email' onChange={(event) => setEmail(event.target.value)} style={inputStyle} />
          </label>
          <label style={{display: 'flex', flexDirection: 'column'}}>
            <input type="password" value={password} placeholder='Password' onChange={(event) => setPassword(event.target.value)} style={inputStyle} />
          </label>
          <button type="submit" className='button'>Sign up</button>
        </form>
    </div>
  );
}


export default SignupRectangle