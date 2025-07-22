import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';     // Corrected to js-cookie
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);

  const navigate = useNavigate();
  const notify = (error) => toast.error(error);
  const successNotify = (success) => toast.success(success);

  // Function to toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = isDark ? 'dark' : 'dark'; // Toggle between light and dark themes
    setIsDark(!isDark); // Update the state
    const body = document.querySelector('body');
    body.setAttribute('data-theme-version', newTheme); // Set the body theme attribute

    // Store the selected theme in localStorage
    localStorage.setItem('theme', newTheme);
  };

  // Check for saved theme preference in localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to light if not found
    setIsDark(savedTheme === 'dark'); // Set the theme state based on saved value

    // Set the body attribute for the theme
    const body = document.querySelector('body');
    body.setAttribute('data-theme-version', savedTheme); // Apply theme to body
  }, []);

  //   const handleLogout = () => {
  //     Cookies.remove("UserAuthToken");
  //     navigate("/login");
  // };


  return (
    <>
      {/* Navbar Header */}
      {/* <div className="nav-header" style={{ backgroundColor: isDark ? 'rgb(29 44 66)' : 'rgb(252 252 252)',opacity:"70%" }}> */}
      <div className="nav-header" style={{ backgroundColor: isDark ? 'rgb(29 44 66)' : 'rgb(29 44 66)',opacity:"70%" }}>
        <div className="brand-logo" >
          <Link to="/">
            <b className="logo-abbr">
              <img src="/images/logo-mini.png" style={{ position: "relative", right: "7px", width: "auto", height: "120%" }} alt="" className='img-fluid' />
            </b>
            {/* <span className="logo-compact">
              <img src="/images/Primevertex--Logo-light.png" alt="" />
               <img src="/images//images/Primevertex-Logo-01-dark.png" alt="" />
             </span>  */}
            <span className="brand-title" >
              {/* <img src={`${isDark ? "/images/Primevertex-Logo-01-dark.png" : "/images/Primevertex--Logo-light.png"}`} className='img-fluid' alt="" style={{ height: "auto", width: "100%", position: "relative", bottom: "20px", top: "-13px" }} /> */}
              <img src={`${isDark ? "/images/logo-big.png" : "/images/Primevertex-Logo-01-dark.png"}`} className='img-fluid' alt="" style={{ height: "auto", width: "100%", position: "relative", bottom: "20px", top: "-13px" }} />
            </span>
          </Link>
        </div>
      </div>

      {/* Header Content */}
      <div className="header" style={{opacity:"70%"}}>
        <div className="header-content clearfix">
          <div className="nav-control">
            <div
              className="hamburger"
              onClick={() => {
                const body = document.querySelector('body');
                const currentSidebarStyle = body.getAttribute('data-sidebar-style');

                if (currentSidebarStyle === 'vertical') {
                  body.setAttribute('data-sidebar-style', 'mini');
                } else {
                  body.setAttribute('data-sidebar-style', 'vertical');
                }
              }}
            >
              <span className="toggle-icon">
                <i
                  className="icon-menu"
                  // style={{ color: isDark ? 'white' : 'black' }} // Change color based on isDark
                  style={{ color:  'white' }} // Change color based on isDark
                ></i>
              </span>
            </div>
          </div>
          <div className="header-right">
            <ul className="clearfix">
              {/* <li className="icons">
                <i
                  className={`fa-solid ${isDark ? 'fa-moon' : 'fa-sun'}`}
                  style={{ fontSize: '25px', margin: '3px 3px 6px 3px', cursor: 'pointer' }}
                  onClick={toggleTheme} // Call toggle theme on click
                ></i>
              </li> */}
              <li class="icons dropdown" >
                <div class="user-img c-pointer position-relative" data-toggle="dropdown">
                  <img src="/images/logo-mini.png" style={{backgroundColor:"#2d3b4c",padding:'2px'}} height="40" width="40" alt="" />
                </div>
                <div class="drop-down dropdown-profile animated fadeIn dropdown-menu">
                  <div class="dropdown-content-body">
                    <ul>
                      <li style={{ backgroundColor: "transparent" }}>
                        <Link to={'/employee/showprofile'} ><i class="fa-solid fa-user"></i> <span style={{ color: "black" }} className="menu-text">Profile</span></Link>
                      </li>
                      <hr class="my-2" />
                      <li style={{ backgroundColor: "transparent" }}>
                        <Link to="/logout">
                          <i className="fa-solid fa-lock"></i>
                          <span className="menu-text logout-text" style={{ color: "black" }} >Logout</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Navbar;
