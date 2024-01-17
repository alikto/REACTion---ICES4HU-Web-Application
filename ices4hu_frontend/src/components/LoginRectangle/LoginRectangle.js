import React, { useState } from "react";
import "./LoginRectangle.css";
import { useNavigate, useLocation } from "react-router-dom";

function LoginRectangle() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const userType = location.state.userType;



  const correctUsername = "admin@hacettepe.edu.tr";
  const correctPassword = "1234";

  function isCorrect(username, password, inputname, inputpassword) {
    return username === inputname && password === inputpassword;
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  
  const handleSubmit = async (event) => {
    console.log(userType);
    event.preventDefault();
    if (email==='' || password==='' || userType==='' ) {
      alert('Please fill in all the required fields.');
    }
    else {
      const body = {  "email" : email, "password": password, "userType": userType };
      fetch('http://localhost:8081/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
        .then(response => {
          if (response.status === 200) {
            console.log('Successful login');
            
          }
          
          //  else {
          //    alert('Incorrect password. Please try again.');
          //    console.log(`Error: ${response.json()}`);
          //    // Handle other response status codes here
          // }
          return response.json();
        })
        .then(data => {
          const userID = data.userId;
          if (userType === 'Student') {
            navigate('/studenthomepage', { state: { userID,userType} });
          } else if (userType === 'Instructor') {
            navigate('/instructorhomepage', { state: { userID,userType} });
          } else if (userType === 'DepartmentManager') {
            navigate('/deptMan/homepage', { state: { userID,userType} });
          } else if (userType === 'Administrator') {
            navigate('/adminhomepage', { state: { userID,userType} });
          }
          // Handle the response data here
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Error:', error.message);
        });
    }
    
    /* const body = {  "email" : email, "password": password };
      
   const config = {
      method: '/get',
      maxBodyLength: Infinity,
      url: 'http://localhost:8081/api/users/login',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : JSON.stringify(body)
    }; 
    console.log(body); 
    fetch(config)
    .then(data => console.log(data.text))
    .then(navigate('/adminhomepage'))
    .catch(error => console.error(error)); */
    /* await axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    }); */
    //await axios.get("localhost:8081/api/users/test");
    
    /* const correct = isCorrect(correctUsername, correctPassword, email, password);
    const body = { 'password': password, 'email': email };
    console.log(`body json object that will be POSTed is :${JSON.stringify(body)}`)
    if (!correct) {
      alert( "Incorrect!");
    }
    else {
      
      (async () => {
        await fetch('localhost:8081/api/users/login', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(body)
        });
      })();
      navigate('/adminhomepage');
    } */

  
    // Reset the form inputs
    /* setEmail('');
    setPassword(''); */
  };

 
  return(
    
    <div className="container">
      <div className="row">
        <div>
          <div className="card logrectcard">
            <div className="card-header" style={{color:'white'}}>Login</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="input-group mb-3">
                  
                  <input 
                  type="email" 
                  name="email"
                  className="form-control-login" 
                  placeholder="Email" 
                  value={email}
                  onChange={handleInputChange}/>
                </div>
                <div className="input-group mb-3">
                  
                  <input 
                  type="password" 
                  name="password"
                  className="form-control-login" 
                  placeholder="Password"
                  value={password}
                  onChange={handleInputChange}/>
                </div>
                <button type="submit" className="btn btn-secondary btn-block">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    
  );



 
}


export default LoginRectangle;