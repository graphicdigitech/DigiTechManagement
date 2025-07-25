import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    useEffect(()=>{
        const savedTheme = 'light'; // Default to light
        // const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light
        const body = document.querySelector('body');
        body.setAttribute('data-theme-version', savedTheme); // Apply theme to body
},[])

  return (
    <>
      
    {/* <div class="login-form-bg h-100">
        <div class="container h-100">
            <div class="row justify-content-center h-100">
                <div class="col-xl-6"> */}
                           {/* <div className="login-form-bg vh-100 "  style={{ backgroundImage:`url('https://img.freepik.com/premium-photo/nightfall-workplace-dark-office-interior-photo_960396-69711.jpg?w=996')` ,backgroundRepeat:"no-repeat" ,backgroundSize:"cover", display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}> */}
                           <div 
    className="login-form-bg vh-100" 
    style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh", 
        width: "100vw" 
    }}
>

                <style>
                    {`
                       input::placeholder {
    color: #000 !important; /* Change this to the color you want */
}

                    `}
                </style>
                <div className="container h-100">
                    <div className="row justify-content-center h-100">
                        <div className="col-xl-6">
                    <div class="error-content">
                        <div class="card mb-0" style={{backgroundColor:"rgb(255 255 255 / 35%)"}}>
                            <div class="card-body text-center pt-5">
                                <h1 class="error-text " style={{color:"rgb(89 156 255)"}}>404</h1>
                                <h4 class="mt-4" style={{fontWeight:"900" ,color:"black"}}>Not Found</h4>
                                <p style={{color:"black"}}>The page you're looking for doesn't exist or has been removed.</p>
                                <form class="mt-5 mb-5">
                                    
                                    <div class="text-center mb-4 mt-4"><Link to="/" class="btn btn-primary">Go to Homepage</Link>
                                    </div>
                                </form>
                                <div class="text-center">
                                    <p style={{color:"black"}}>Copyright © Designed by <a style={{color:"white"}} href="https://www.instagram.com/shaloom._.james/" target='_blank'>Shaloom James</a></p>
                                    <ul class="list-inline">
                                        <li class="list-inline-item"><a href="" target='_blank' class="btn btn-facebook"><i class="fa fa-facebook"></i></a>
                                        </li>
                                        <li class="list-inline-item"><a href=""  target='_blank' class="btn btn-instagram"><i class="fa-brands fa-instagram"></i></a>
                                        </li>
                                        <li class="list-inline-item"><a href="" target='_blank' class="btn btn-linkedin"><i class="fa fa-linkedin"></i></a>
                                        </li>
                                        <li class="list-inline-item"><a href="" target='_blank' class="btn btn-twitter"><i class="fa-brands fa-behance"></i></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default NotFound
