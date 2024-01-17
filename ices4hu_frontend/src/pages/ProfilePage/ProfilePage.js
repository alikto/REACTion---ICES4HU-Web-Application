import React, { useState, useEffect, useRef } from 'react';
import NavBar from "../../components/NavBar/NavBar";
import "./ProfilePage.css"
import imageSrc from '../../images/profilePic.png';
import imageSrc2 from '../../images/huLogo.png';
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";


function ProfilePage () {

    const location = useLocation();
    const userID = location.state.userID;
    const userType = location.state.userType;
    const [user, setUser] = useState({});
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] =useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [department, setDepartment] = useState('');

    useEffect(() => {
        // Fetch user data from an API
        axios.get(`http://localhost:8081/api/users/get/${userID}`)
          .then(response => {
            const userData = response.data;
            setName(userData.name);
            setSurname(userData.surname);
            setPassword(userData.password);
            setEmail(userData.email);
            setPhoneNumber(userData.phoneNumber);
            setAddress(userData.address);
            setDepartment(userData.departmentName);
          })
          .catch(error => {
            console.log(error);
          });
      }, []);

    const handleEditProfileClick = () => {

        if (name === '' ||surname===''|| email ==='' || password==='' || phonenumber ==='' || address==='' ) {
            alert('Please enter your name');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        fetch('http://localhost:8081/api/users/update', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "userId": userID,
            "email": email,
            "password": password,
            "phoneNumber": phonenumber,
            "address": address,
            "name": name,
            "surname": surname
        })
        })
        .then(response => response.json())
        .then(data => {
        console.log('Success:', data);
        alert("Updating profile is successfull!");
        });
    

        
    };

    const handleNewPasswordClick = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8081/api/users/newPasswordRequest/${userID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            const newPassword = data.password;
            alert(`Your new password is: ${newPassword}`);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };


    return(
        <div>
            <div>
                <NavBar  userID={userID} userType={userType}/>
            </div>
            <div className="container">
                

                <div className="column">
                    <img src={imageSrc} alt="My Image" style={{ width: '200px', height: 'auto', marginLeft:'70px' }} />
                    <div className="input-wrapper" style={{marginTop: "73px"}}>
                        
                        <button className="button" 
                                onClick={handleEditProfileClick}>Update Profile</button>
                        <button className="button"
                                onClick={handleNewPasswordClick}>New Password Request</button>

                        <label htmlFor="phoneNumber" style={{marginTop:"120px"}}>Phone Number</label>
                        <input type="text" id="phoneNumber"  defaultValue={phonenumber }  onChange={(event) => setPhoneNumber(event.target.value)} />
                    </div>
                </div>


                <div className="column">
                    <div className="input-wrapper">
                        <label htmlFor="username">Name </label>
                        <input type="text" id="username" defaultValue={name}  onChange={(event) => setName(event.target.value)} />

                        <label htmlFor="department">Department</label>
                        <input type="text" id="deparment"  value={department} readOnly/>

                        <label htmlFor="address" style={{marginTop:"20px"}}>Address</label>
                        <input type="text" id="address" defaultValue={address} onChange={(event) => setAddress(event.target.value)}  />
                    </div>
                </div>


                <div className="column">
                    <div className="input-wrapper" style={{marginTop: "10px"}}>
                        <img src={imageSrc2} alt="My Image" style={{ width: '500px', height: 'auto' , marginBottom:"30px", marginRight:"20px"}} />

                        <label htmlFor="surname">Surname</label>
                        <input type="text" id= "surname" defaultValue={surname} onChange={(event) => setSurname(event.target.value)} />

                        <label htmlFor="password">Password</label>
                        <input type="password" id="password"  defaultValue={password} onChange={(event) => setPassword(event.target.value)}  />

                        <label htmlFor="email" style={{marginTop:"20px"}}>Email</label>
                        <input type="text" id="email" defaultValue={email} onChange={(event) => setEmail(event.target.value)} />
                    </div>
                </div>


            </div>
                        
        </div>
    );
}

export default ProfilePage;