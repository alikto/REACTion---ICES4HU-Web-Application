import "./LogoForHomepage.css"
import logo from "../../images/Hacettepe_Üniversitesi_Logosu 1.png";

import React from 'react';

const LogoForHomepage = () => {
  return (
    <div className="logo-container">
        <div className="text-container">
        <h2 style={{
          fontFamily: 'Montserrat',
          fontStyle: 'normal',
          fontWeight: 800,
          color: '#000000',
          textShadow: '0px 4px 5px rgba(91, 91, 91, 0.45)'
        }}>
          HACETTEPE <br /> UNIVERSITY
        </h2>
      </div>
      <img src={logo} alt="My Logo" className="logo-image" />
    </div>
  );
};

export default LogoForHomepage;
