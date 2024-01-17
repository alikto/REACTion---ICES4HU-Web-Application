import "./AdminHomepage.css"
import LogoForHomePage from "../../components/LogoForHomepage/LogoForHomepage";
import NavBar from "../../components/NavBar/NavBar";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";


function AdminHomepage() {
    const location = useLocation();
    const userID = location.state.userID;
    const userType = location.state.userType;

    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchCourses();
      }, []);


    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/users/getAll');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
        };
    
    const fetchCourses = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/courses/getAll');
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
        };
    
      

      const User = ({ userId, name, email }) => {
        const handleUserDelete = () =>{
            fetch(`http://localhost:8081/api/users/delete/${userId}`, {
                method: 'DELETE',
            })
                .then(response => {
                if (response.ok) {
                    console.log('User deleted');
                } else {
                    console.error('Error deleting user');
                }
                })
            .catch(error => {
            console.error('Fetch error:', error);
            });
        }
        return (
          <div className="user-row">
            <span>{userId}</span>
            <span>{name}</span>
            <span>{email}</span>
            <button className="adminHP-button" style={{background:'linear-gradient(180deg, #3A3A3A 0%, #1E1E1E 100%)'}} >Update</button>
            <button className="adminHP-button"
                    onClick={handleUserDelete}>Delete</button>
          </div>
        );
      };

      const Course = ({ courseId, courseTitle, credit, semester, courseCode }) => {
        const handleCourseDelete = () => {
            fetch('http://localhost:8081/api/courses/delete/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                courseCode: courseCode,
                semester: semester
            })
            })
            .then(response => {
                if (response.ok) {
                    console.log('Course deleted successfully');
                    window.location.reload();
                  } else {
                    console.log('Failed to delete course');
                  }
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle error here
            });

        }
        return (
          <div className="course-row">
            <span>{courseId}</span>
            <span>{courseTitle}</span>
            <span style={{marginLeft:'5rem'}}>{credit}</span>
            <button className="adminHP-button" style={{background:'linear-gradient(180deg, #3A3A3A 0%, #1E1E1E 100%)'}} >Update</button>
            <button className="adminHP-button"
                    onClick={handleCourseDelete}>Delete</button> 
          </div>
        );
      };


    const navigate = useNavigate();
    const addUser = (event) => {
        console.log(event)
        event.preventDefault();
        navigate('/admin/adduser', {state:{userID, userType}});
    }
    const addCourse = (event) => {
        console.log(event);
        event.preventDefault();
        navigate('/admin/addCourse', {state:{userID, userType}})
    }
    const manageSurveys = (event) => {
        console.log(event);
        event.preventDefault();
        navigate('/admin/manageSurveys', {state:{userID, userType}})
    }
    return(
        <div>
            <div>
                <NavBar  userID={userID} userType={userType}/>
                <LogoForHomePage/>
            </div>
            <div class="button-container">
                <button onClick={addUser} class="b1" style={{
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    color: '#FFFFFF'
                }}>Add User</button>
                <button onClick={addCourse} class="b1" style={{
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    color: '#FFFFFF'
                }}>Add Course</button>
                <button class="b1" style={{
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    color: '#FFFFFF'
                }}>Start Semester</button>
                <button onClick={manageSurveys} class="b1" style={{
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    color: '#FFFFFF'
                }}>Manage Surveys</button>
                
            </div>
            <div className="list-container">
                <div className="list-column">
                    <h2 className="head-list">Users</h2>
                    <div className="user-header">
                        <span>ID</span>
                        <span>Name</span>
                        <span>Email</span>
                        <span></span>
                    </div>
                    {users.map((user) => (
                    <User key={user.id} {...user} />
                    ))}
                </div>
                <div className="list-column">
                    <h2 className="head-list">Courses</h2>
                    <div className="course-header">
                        <span>ID</span>
                        <span>Title</span>
                        <span >Credit</span>
                        <span></span>
                    </div>
                    {courses.map((course) => (
                    <Course key={course.courseId} {...course} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminHomepage;
