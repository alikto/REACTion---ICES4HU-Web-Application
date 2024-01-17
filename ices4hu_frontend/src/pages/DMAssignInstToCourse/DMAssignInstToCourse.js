import NavBar from "../../components/NavBar/NavBar";
import "./DMAssignInstToCourse.css"
import DeptManHead from "../../components/DeptManHead/DeptManHead.js";

import { useNavigate, useLocation } from 'react-router-dom'; 
import { useState, useEffect } from "react";

function DMAssignInstToCourse() {
    const location = useLocation();

    const userID = location.state.userID;
    const userType = location.state.userType;
    const navigate = useNavigate();
    const [instructors, setInstructors] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedInstID, setSelectedInstID] = useState(0);
    const [selectedCourseCode, setSelectedCourseCode] = useState('');
    const [selectedCourseSemester, setSelectedCoursSemester] = useState('');

    useEffect(() => {

        fetchInstructor();
        fetchCourse();
      }, []);

    const fetchInstructor = async () => {
    try {
        const InstResponse = await fetch(`http://localhost:8081/api/users/department-managers-instructors/${userID}`);
        const InstData = await InstResponse.json();
        setInstructors(InstData);
    } catch (error) {
        console.log('Error fetching data:', error);
    }
    };
    
    const fetchCourse = async () => {
        try {
            const CourseResponse = await fetch(`http://localhost:8081/api/courses/department-managers-courses/${userID}`);
            const CourseData = await CourseResponse.json();
            setCourses(CourseData);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
        };
        
    const handleSelectChange = (event) => {
        setSelectedInstID(event.target.value);
    };
    
    const handleCourseSelect = (event) => {
        const selectedCourseId = parseInt(event.target.value);

        const selectedCourse = courses.find((course) => course.courseId === selectedCourseId);
        setSelectedCourseCode(selectedCourse.courseCode)
        setSelectedCoursSemester(selectedCourse.semester)
    }

    const assignCourseInst = () => {
        
        const data = {
            courseCode: selectedCourseCode,
            semester: selectedCourseSemester,
            userId: parseInt(selectedInstID)
        }

        console.log(data)

        fetch('http://localhost:8081/api/courses/assign-instructor/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Post response:', data);
            
        })
        .catch((error) => {
            console.error('Post error:', error);
        });
        alert("Assigning is successfull!");

        
    }

    return (
        <div>
            <div>
                <NavBar  userID={userID} userType={userType}/>
            </div>
            <div>
                <DeptManHead></DeptManHead>
            </div>
            <div className="instructorSelect">
                <div style={{paddingLeft:'40px'}}>
                    <select className="instSelect" onChange={handleSelectChange}>
                        <option value="hide">-- Instructor --</option>
                        {instructors.length >0 && instructors.map((instructor) => (
                        <option key={instructor.userId} value={instructor.userId}>
                            {instructor.name}
                        </option>
                        ))}
                    </select>
                </div>

                <div style={{paddingLeft:'50px'}}>
                    <select className="instSelect" onChange={handleCourseSelect}>
                        <option value="hide">-- Course --</option>
                        {courses.length>0 && courses.map((course) => (
                        <option key={course.courseId} value={course.courseId}>
                            {course.courseTitle + " " + course.semester}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <button className="assignButton"
                            onClick={assignCourseInst}
                        >Assign</button>
                </div>
            </div>
        </div>
    );
}

export default DMAssignInstToCourse;