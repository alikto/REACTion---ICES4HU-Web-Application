import { useState } from "react";
import "./AddCourse.css";
import { useLocation } from "react-router-dom";


function AddCourse() {
    const location = useLocation();
    const userID = location.state.userID;
    const userType = location.state.userType;
    const [courseCode, setCode] = useState("");
    const [courseTitle, setName] = useState("");
    const [credit, setCredit] = useState(0);
    const [semestre, setSemestre] = useState("");
    const [department, setDepartment] = useState("");
    const [isMandatory, setIsMandatory] = useState(false);

    

    const handleToggleChange = () => {
        setIsMandatory(!isMandatory);
      };

    const handleSubmit = (event) => {
    event.preventDefault();

    //empty
    if (
        courseCode.trim() === "" ||
        courseTitle.trim() === "" ||
        credit === 0 ||
        semestre.trim() === "" ||
        department.trim() === ""
      ) {
        alert("Please fill in all the required fields.");
        return;
      }

      //invalid credit
      if (!Number.isInteger(credit) || credit <= 0) {
        alert("Credit must be a non-negative integer.");
        return;
      }

      //course code format
      if (!/^[A-Za-z]{3}\d{3}$/.test(courseCode)) {
        alert("Course code should be in the format of 3 letters followed by 3 integers (e.g., 'BBM101').");
        return;
      }

      //validate course title
      if (!/^[A-Za-z\s]+$/.test(courseTitle)) {
        alert("Course title should only contain letters.");
        return;
      }

      //validate department name
      if (!/^[A-Za-z\s]+$/.test(department)) {
        alert("Department name should only contain letters.");
        return;
      }

    const body = {
        courseCode: courseCode,
        courseTitle: courseTitle,
        credit: credit,
        semester: semestre,
        isMandatory: isMandatory,
        departmentName: department
    }
    console.log(body);

    fetch('http://localhost:8081/api/courses/add/',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(body),
    })
        .then((response) => {
        console.log(response);
        })
        .then((data) => {
        console.log("Success:", data);
        alert(`Adding Course: ${courseTitle}`," is successfull!");
        })
        .catch((error) => {
        console.error("Error:", error);
        });
    };



    return(
        <div className="addCourseRectangle">
            <div className="addCourseHeader"style={{borderBottom: 0, backgroundColor: "transparent"}}>
                <h2>Add Course</h2>
            </div>
            <div className="addCourseBody">
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label htmlFor="CourseCode">Course Code</label>
                        <input
                            type="text"
                            id="CourseCode"
                            value={courseCode}
                            onChange={(event) => setCode(event.target.value)}
                        />
                    </div>

                    <div className="formGroup">
                        <label htmlFor="CourseName">Course Name</label>
                        <input
                            type="text"
                            id="CourseName"
                            value={courseTitle}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>

                    <div className="formGroup">
                        <label htmlFor="CourseCredit">Course Credit</label>
                        <input
                            type="text"
                            id="CourseCredit"
                            //value={credit}
                            onChange={(event) => setCredit(parseFloat(event.target.value))}
                        />
                    </div>

                    <div className="formGroup">
                        <label htmlFor="CourseSemestre">Semestre</label>
                        <input 
                            type="text"
                            id="CourseSemestre"
                            value={semestre}
                            onChange={(event) => setSemestre(event.target.value)}
                        />
                    </div>

                    <div className="formGroup">
                        <label htmlFor="CourseDepartment">Department</label>
                        <input 
                            type="text"
                            id="CourseDepartment"
                            value={department}
                            onChange={(event) => setDepartment(event.target.value)}
                        />
                    </div>

                    <div className="checkboxContainer">
                        <label htmlFor="toggleCheckbox">Mandatory/Elective</label>
                        <input
                            type="checkbox"
                            id="toggleCheckbox"
                            checked={isMandatory}
                            onChange={handleToggleChange}
                        /><span>{isMandatory ? "Mandatory" : "Elective"}</span>
                        
                    </div>

                    <div className="buttonGroup">
                        {/* <button type="button"
                                className="addCourseButton"
                                >Back</button> */}
                        <button type="submit"
                                className="addCourseButton">Add</button>
                    </div>                        
                    
                </form>
            </div>
      
        </div>
    );
}

export default AddCourse;