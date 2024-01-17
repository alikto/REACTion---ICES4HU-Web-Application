/*import {FaBars, FaTimes} from "react-icons/fa";
import { useRef, useState } from "react";
import './NavBar.css'
 
function NavBar() {
    const navRef = useRef();

    const showNavBar = () => {
        navRef.current.classList.toggle("responsive_nav");
    }

    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNavBar = () => {
        setIsNavOpen(!isNavOpen);
    }

    return (
        <header className="nav-header">
            <h3>Logo</h3>
            <nav  ref={navRef}>
                <a href="/#">Home</a>
                <a href="/#">About</a>
                <a href="/#">Profile</a>
                <a href="/#">Logout</a>
                <button className="nav-btn nav-close-btn" onClick={toggleNavBar}>
                    <FaTimes/>
                </button>
            </nav>
            <button className="nav-btn " onClick={toggleNavBar}>
                <FaBars/>
            </button>
        </header>
    );
}

export default NavBar;*/

import { FaBars, FaTimes } from "react-icons/fa";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";


function NavBar({userID, userType}) {
  const [isOpen, setIsOpen] = useState(false); // State to track if the navbar is open or closed
  const navRef = useRef();

  const toggleNavBar = () => {
    setIsOpen(!isOpen); // Toggle the value of isOpen state
  };

  const navigate = useNavigate();
  const profileNavigate = (event) => {
      event.preventDefault();
      navigate('/profilePage', {state:{userID,userType}});
  }

  const homenavigate = (event) => {
    event.preventDefault();
    if(userType === "Student") {
      studentHomeNavigate();
    }
    else if (userType === "Instructor") {
      instHomeNavigate();
    }
    else if (userType === "DepartmentManager"){
      deptManHomeNavigate();
    }
    else if(userType === "Administrator") {
      adminHomeNavigate();
    }
  }

  const instHomeNavigate = () => {
    navigate('/instructorhomepage', {state:{userID,userType}});
  }

  const studentHomeNavigate = () => {
    navigate('/studenthomepage', {state:{userID,userType}});
  }
  const deptManHomeNavigate = () => {
    navigate('/deptMan/homepage', {state:{userID,userType}});
  }
  const adminHomeNavigate = () => {
    navigate('/adminhomepage', {state:{userID,userType}});
  }

  const logoutNavigate = (event) => {
    event.preventDefault();
    navigate('/', {state:{userID}});
  }

  return (
    <div className="forLinear">
      <header className="nav-header">
        <p className="HU">HU</p>
        <nav ref={navRef} className={isOpen ? "responsive_nav" : ""}>
          <button className="navbar-button" onClick={homenavigate}>Home</button>
          <button className="navbar-button" onClick={profileNavigate}>Profile</button>
          <button className="navbar-button" onClick={logoutNavigate}>Logout</button>
          <button
            className="nav-btn nav-close-btn"
            onClick={toggleNavBar}
          >
            <FaTimes />
          </button>
        </nav>
        <button className="nav-btn " onClick={toggleNavBar}>
          <FaBars />
        </button>
      </header>
    </div>
    
  );
}

export default NavBar;
