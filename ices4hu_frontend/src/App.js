import Login from './pages/Login/Login.js';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminHomepage from './pages/AdminHomepage/AdminHomepage.js';
import SignInPage from './pages/SignInPage/SignInPage.js';
import SignupPage from './pages/SignUpPage/SignupPage.js';
import StudentHomepage from './pages/StudentHomepage/StudentHomepage.js';
import ProfilePage from './pages/ProfilePage/ProfilePage.js';
import AdminAddUser from './pages/AdminAddUser/AdminAddUser.js';
import InstructorHomepage from './pages/InstructorHomepage/InstructorHomepage.js';
import AdminAddCourse from './pages/AdminAddCourse/AdminAddCourse.js';
import DeptManHome from './pages/DeptManHome/DeptManHome.js';
import DMAssignInstToCourse from './pages/DMAssignInstToCourse/DMAssignInstToCourse.js'
import AdminManageSurveys from './pages/AdminManageSurveys/AdminManageSurveys.js';
import DeptManAccessSurveys from './pages/DeptManAccessSurveys/DeptManAccessSurveys.js'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<SignInPage/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<SignupPage/>} />
        <Route path='/profilePage' element={<ProfilePage/>}  />

        <Route path='/adminhomepage' element={<AdminHomepage/>} />
        <Route path='/admin/manageSurveys' element={<AdminManageSurveys/>}/>
        <Route path='/admin/adduser' element={<AdminAddUser/>} />
        <Route path='/admin/adduser' element={<AdminAddUser/>} />
        <Route path='/admin/addCourse' element={<AdminAddCourse/>}  />
        
        <Route path='/deptMan/homepage' element={<DeptManHome/>} />
        <Route path='/deptMan/AssignInstToCourse' element={<DMAssignInstToCourse/>}/>
        <Route path='/deptMan/AccessSurveys' element={<DeptManAccessSurveys/>}/>

        <Route path='/admin/manageSurveys' element={<AdminManageSurveys/>}/>


        <Route path='/instructorhomepage' element={<InstructorHomepage/>} />

        <Route path='/studenthomepage' element = {<StudentHomepage/>} />

      </Routes>
    </Router>
  );
}

export default App;
