import React, { useState } from "react";
import "./AddUser.css";
import { useLocation, useNavigate } from "react-router-dom";


function SignInRectangle() {
  const location = useLocation();
  const userID = location.state.userID;
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [userType, setUserType] = useState("Student");
  const [studentId, setStudentId] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // if any part is empty
    if (
      name.trim() === "" ||
      surname.trim() === "" ||
      email.trim() === "" ||
      department.trim() === ""
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    //invalid email
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    //validate name
    if (!/^[A-Za-z\s]+$/.test(name)) {
      alert("Name should only contain letters and spaces.");
      return;
    }

    //validate surname
    if (!/^[A-Za-z\s]+$/.test(surname)) {
      alert("Surname should only contain letters and spaces.");
      return;
    }
  
    //validate department name
    if (!/^[A-Za-z\s]+$/.test(department)) {
      alert("Department should only contain letters and spaces.");
      return;
    }


    // Add user to the database or perform other relevant actions
    const body = {
      name: name,
      surname: surname,
      password: "123",
      email: email,
      departmentName: department,
      studentId: studentId
    };
    console.log(body);
    console.log(userType);
    fetch(`http://localhost:8081/api/users/add/${userType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body), // replaced `data` with `body`
    })
      .then((response) => {
        console.log(response);
      })
      .then((data) => {
        console.log("Success:", data);
        alert(`Adding user: ${name} ${surname} is successfull!`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  
  const navigate = useNavigate();
  
  const goBack = (event) => {
    console.log(event)
    event.preventDefault();
    navigate('/adminhomepage', {state:{userID}});
  }
  return(
    <div className="addusercard">
      <div className="addusercard-header"style={{borderBottom: 0, backgroundColor: "transparent"}}>
        <h2>Add User</h2>
      </div>
      <div className="addusercard-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="surname">Surname:</label>
            <input
              type="text"
              id="surname"
              value={surname}
              onChange={(event) => setSurname(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department:</label>
            <input
              type="text"
              id="department"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="userType">User Type:</label>
            <select
              id="userType"
              value={userType}
              onChange={(event) => setUserType(event.target.value)}
            >
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
              <option value="DepartmentManager">Department Manager</option>
            </select>
          </div>
          {userType === "Student" && (
            <div className="form-group">
              <label htmlFor="studentId">Student ID:</label>
              <input
                type="text"
                id="studentId"
                value={studentId}
                onChange={(event) => setStudentId(event.target.value)}
              />
            </div>
          )}
          <div className="button-group">
            <button onClick={goBack} type="button">Back</button>
            <button type="submit">Add</button>
          </div>
        </form>
      </div>
    </div>



    
  );



 
}
export default SignInRectangle;
