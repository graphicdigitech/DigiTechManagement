import React, { useEffect, useState } from "react";
import PieChart from "../components/PieChart";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';  // Correct import for jwt-decode
import { useNavigate } from "react-router-dom";

const Home = () => {

    const [employeeData, setEmployeeData] = useState([]);
    const [RoleData, setRoleData] = useState([]);

     const navigate = useNavigate();

    //Peotecting page 
    useEffect(() => {
        const userToken = Cookies.get("UserAuthToken");

        if (userToken) {
            try {
                const decodedToken = jwtDecode(userToken); // Decode the JWT token
                const userRole = decodedToken.userrole;   // Get the user role(s)

                // Redirect to login if the user is not an Admin
                if (
                    !(Array.isArray(userRole) && userRole.includes("Admin")) && // Array case
                    userRole !== "Admin"                                       // String case
                ) {
                    navigate("/login");
                }
            } catch (error) {
                // Handle token decoding failure
                console.error("Token decoding failed:", error);
                navigate("/login");
            }
        } else {
            // Redirect if no token is found
            navigate("/login");
        }
    }, [navigate]);


    // fetch Role
    useEffect(() => {
        const fetchRole = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}api/role`);
                setRoleData(res.data);
            } catch (error) {
                console.error("Error Fetching Roles Data:", error);
            }
        };
        fetchRole();
    }, []);

    // Fetching Employees Data
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}api/employee`);
                setEmployeeData(res.data)
            } catch (error) {
                console.log("Error Fetching Employees Data", error)
            }
        }
        fetchEmployees();
    }, [])

    return (
        <>
            <div className="container-fluid mt-3">

                <div className="row d-flex">
                    <div className="col-lg-6 col-sm-6 flex-fill">
                        <div className="card gradient-1 text-center">
                            <div className="card-body">
                                <h3 className="card-title text-white">Total Employees</h3>
                                <div className="d-inline-block">
                                    <h3 className="card-title text-white">{employeeData ? employeeData.length : "no Employees Found"}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                <div className="col-lg-6 col-sm-6 flex-fill">
                        <div className="card gradient-3 text-center">
                            <div className="card-body">
                                <h3 className="card-title text-white">Roles</h3>
                                <div className="d-inline-block">
                                    <h3 className="card-title text-white">{RoleData ? RoleData.length : "no Employees Role Found"}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row d-flex" style={{ visibility: "hidden" }}>
                    <div className="col-lg-6 col-sm-6 flex-fill">
                        <div className="card gradient-1 text-center">
                            <div className="card-body">
                                <h3 className="card-title text-white">Total Employees</h3>
                                <div className="d-inline-block">
                                    <h3 className="card-title text-white">{employeeData ? employeeData.length : "no Employees Found"}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                <div className="col-lg-6 col-sm-6 flex-fill">
                        <div className="card gradient-3 text-center">
                            <div className="card-body">
                                <h3 className="card-title text-white">Roles</h3>
                                <div className="d-inline-block">
                                    <h3 className="card-title text-white">{RoleData ? RoleData.length : "no Employees Role Found"}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row d-flex" style={{ visibility: "hidden" }}>
                    <div className="col-lg-6 col-sm-6 flex-fill">
                        <div className="card gradient-1 text-center">
                            <div className="card-body">
                                <h3 className="card-title text-white">Total Employees</h3>
                                <div className="d-inline-block">
                                    <h3 className="card-title text-white">{employeeData ? employeeData.length : "no Employees Found"}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                <div className="col-lg-6 col-sm-6 flex-fill">
                        <div className="card gradient-3 text-center">
                            <div className="card-body">
                                <h3 className="card-title text-white">Roles</h3>
                                <div className="d-inline-block">
                                    <h3 className="card-title text-white">{RoleData ? RoleData.length : "no Employees Role Found"}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row d-flex" style={{ visibility: "hidden" }}>
                    <div className="col-lg-6 col-sm-6 flex-fill">
                        <div className="card gradient-1 text-center">
                            <div className="card-body">
                                <h3 className="card-title text-white">Total Employees</h3>
                                <div className="d-inline-block">
                                    <h3 className="card-title text-white">{employeeData ? employeeData.length : "no Employees Found"}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                <div className="col-lg-6 col-sm-6 flex-fill">
                        <div className="card gradient-3 text-center">
                            <div className="card-body">
                                <h3 className="card-title text-white">Roles</h3>
                                <div className="d-inline-block">
                                    <h3 className="card-title text-white">{RoleData ? RoleData.length : "no Employees Role Found"}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </>
    );
};

export default Home;