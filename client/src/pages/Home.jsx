import React, { useEffect, useState } from "react";
import PieChart from "../components/PieChart";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';  // Correct import for jwt-decode
import { useNavigate } from "react-router-dom";

const Home = () => {
    // for charts
    const [ExpanceData, setExpanceData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [categoryTotals, setCategoryTotals] = useState({});

    // for table 1
    const [Tb1ExpanceData, setTb1ExpanceData] = useState([]);
    const [Tb1totalAmount, setTb1TotalAmount] = useState(0);
    const [Tb1categoryTotals, setTb1CategoryTotals] = useState({});

    // for table 2
    const [Tb2ExpanceData, setTb2ExpanceData] = useState([]);
    const [Tb2totalAmount, setTb2TotalAmount] = useState(0);
    const [Tb2categoryTotals, setTb2CategoryTotals] = useState({});

    const [employeeData, setEmployeeData] = useState([]);
    const [RoleData, setRoleData] = useState([]);
    const [ExpanceCategoryData, setExpanceCategoryData] = useState([]);
    const [GExpanceData, setGExpanceData] = useState([]);
    const [GExpanceTotal, setGExpanceTotal] = useState(0);

    // Separate date states for two tables and one chart
    const [table1StartDate, setTable1StartDate] = useState("");
    const [table1EndDate, setTable1EndDate] = useState("");
    const [table2StartDate, setTable2StartDate] = useState("");
    const [table2EndDate, setTable2EndDate] = useState("");
    const [chartStartDate, setChartStartDate] = useState("");
    const [chartEndDate, setChartEndDate] = useState("");

    // Pagination states Table 1
    const [pageTable1, setPageTable1] = useState(1);
    const [pageSizeTable1, setPageSizeTable1] = useState(5);
    const [totalPagesTable1, setTotalPagesTable1] = useState(0);


    // Pagination states Table 2
    const [pageTable2, setPageTable2] = useState(1);
    const [pageSizeTable2, setPageSizeTable2] = useState(10);
    const [totalPagesTable2, setTotalPagesTable2] = useState(0);

    //initializing Expance chart 
    const [ChartExpenseData, setChartExpenseData] = useState({
        labels: [],
        datasets: [{
            label: "Expense Distribution",
            data: [],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
            borderColor: "black",
            borderWidth: 1,
        }]
    });

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

    //fetch Expance Category 
    useEffect(() => {
        const fetchExpanceCategory = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}api/expance/category/`);
                setExpanceCategoryData(res.data);
            } catch (error) {
                console.log("Error Fetching Expance Category Data", error);
            }
        };
        fetchExpanceCategory();
    }, []);

    //fetch Expances for Great Grand Total 
    useEffect(() => {
        const fetchExpance = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}api/expance/`);
                setGExpanceData(res.data);
            } catch (error) {
                console.log("Error Fetching Expance Category Data", error);
            }
        };
        fetchExpance();
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


    // Fetching Expance Data with Date Filters for Table 1
    useEffect(() => {
        const fetchExpanceForTable1 = async () => {
            try {
                const params = {};
                if (table1StartDate) params.startingDate = table1StartDate;
                if (table1EndDate) params.endingDate = table1EndDate;
    
                const res = await axios.get(`${process.env.REACT_APP_API_URL}api/expance/tb1/t`, { params });
                setTb1ExpanceData(res.data);
            } catch (error) {
                console.error("Error Fetching Table 1 Data", error);
            }
        };
    
        fetchExpanceForTable1();
    }, [table1StartDate, table1EndDate]);
    

    // Fetching Expance Data with Date Filters for Table 2
    useEffect(() => {
        const fetchExpanceForTable2 = async () => {
            try {
                const params = {};
                if (table2StartDate) params.startingDate = table2StartDate;
                if (table2EndDate) params.endingDate = table2EndDate;
    
                const res = await axios.get(`${process.env.REACT_APP_API_URL}api/expance/tb2/t`, {
                    // params: { startingDate: table2StartDate, endingDate: table2EndDate },
                    params,
                });
                setTb2ExpanceData(res.data);
            } catch (error) {
                console.error("Error Fetching Table 2 Data", error);
            }
        };
        fetchExpanceForTable2();
    }, [table2StartDate, table2EndDate]);


    // Handle pagination logic on changes table 2
    useEffect(() => {
        setTotalPagesTable2(Math.ceil((Tb2ExpanceData).length / pageSizeTable2));
    }, [Tb2ExpanceData, pageSizeTable2]);

    const handlePageChangeTable2 = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesTable2) {
            setPageTable2(newPage);
        }
    };

    // Pagination slice table 2
    const startIndexTb2 = (pageTable2 - 1) * pageSizeTable2;
    const endIndexTb2 = pageTable2 * pageSizeTable2;
    const currentDataTb2 = Tb2ExpanceData.slice(startIndexTb2, endIndexTb2);
    // .map(([category, amount]) => ({
    //     categoryname: [category],
    //     categoryamount: amount
    // }));

    // Fetching Expance Data with Date Filters for Chart
    useEffect(() => {
        const fetchExpanceForChart = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}api/expance`, {
                    params: { startingDate: chartStartDate, endingDate: chartEndDate },
                });
                setExpanceData(res.data);
            } catch (error) {
                console.error("Error Fetching Chart Data", error);
            }
        };
        fetchExpanceForChart();
    }, [chartStartDate, chartEndDate]);

    // Clear filters for each date range
    const clearTable1Filters = () => {
        setTable1StartDate("");
        setTable1EndDate("");
    };
    const clearTable2Filters = () => {
        setTable2StartDate("");
        setTable2EndDate("");
    };
    const clearChartFilters = () => {
        setChartStartDate("");
        setChartEndDate("");
    };

    // Calculate total amount and category-wise totals
    useEffect(() => {
        const total = ExpanceData.reduce((acc, expance) => acc + expance.expanceAmount, 0);
        setTotalAmount(total);
        const categoryTotals = ExpanceData.reduce((acc, expance) => {
            const category = expance.expanceCategory.ExpanceCategoryName;
            acc[category] = (acc[category] || 0) + expance.expanceAmount;
            return acc;
        }, {});
        setCategoryTotals(categoryTotals);
    }, [ExpanceData]);

    useEffect(() => {
        const total = GExpanceData.reduce((acc, expance) => acc + expance.expanceAmount, 0)
        setGExpanceTotal(total)
    }, [GExpanceData])

    // Calculate total amount and category-wise totals for table 1
    useEffect(() => {
        const total = Tb1ExpanceData.reduce((acc, expance) => acc + expance.expanceAmount, 0);
        setTb1TotalAmount(total);
        const categoryTotals = Tb1ExpanceData.reduce((acc, expance) => {
            const category = expance.expanceCategory.ExpanceCategoryName;
            acc[category] = (acc[category] || 0) + expance.expanceAmount;
            return acc;
        }, {});
        setTb1CategoryTotals(categoryTotals);
    }, [Tb1ExpanceData]);

    // Handle pagination logic on changes
    useEffect(() => {
        setTotalPagesTable1(Math.ceil((Object.keys(Tb1categoryTotals)).length / pageSizeTable1));
    }, [Tb1categoryTotals, pageSizeTable1]);

    const handlePageChangeTable1 = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesTable1) {
            setPageTable1(newPage);
        }
    };

    // Pagination slice
    const startIndexTb1 = (pageTable1 - 1) * pageSizeTable1;
    const endIndexTb1 = pageTable1 * pageSizeTable1;
    const currentDataTb1 = Object.entries(Tb1categoryTotals)
        .slice(startIndexTb1, endIndexTb1)
        .map(([category, amount]) => ({
            categoryname: [category],
            categoryamount: amount
        }));

    // Calculate total amount and category-wise totals for table 2
    useEffect(() => {
        const total = Tb2ExpanceData.reduce((acc, expance) => acc + expance.expanceAmount, 0);
        setTb2TotalAmount(total);
        const categoryTotals = Tb2ExpanceData.reduce((acc, expance) => {
            const category = expance.expanceCategory.ExpanceCategoryName;
            acc[category] = (acc[category] || 0) + expance.expanceAmount;
            return acc;
        }, {});
        setTb2CategoryTotals(categoryTotals);
    }, [Tb2ExpanceData]);

    // Update chart data based on categoryTotals
    useEffect(() => {
        const backgroundColors = ExpanceData.map(exp => exp.expanceCategory?.ExpanceCategoryColor || "#CCCCCC"); // Default color if undefined
        setChartExpenseData({
            labels: Object.keys(categoryTotals),
            datasets: [{
                label: "Expense Distribution",
                data: Object.values(categoryTotals),
                backgroundColor: backgroundColors,
                borderColor: "black",
                borderWidth: 1,
            }]
        });
    }, [categoryTotals]);

    return (
        <>
            <div className="container-fluid mt-3">

                <div class="row d-flex">
                    <div class="col-lg-6 col-sm-6 flex-fill">
                        <div class="card gradient-1 text-center">
                            <div class="card-body">
                                <h3 class="card-title text-white">Total Employees</h3>
                                <div class="d-inline-block">
                                    <h3 class="card-title text-white">{employeeData ? employeeData.length : "no Employees Found"}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                <div class="col-lg-6 col-sm-6 flex-fill">
                        <div class="card gradient-3 text-center">
                            <div class="card-body">
                                <h3 class="card-title text-white">Roles</h3>
                                <div class="d-inline-block">
                                    <h3 class="card-title text-white">{RoleData ? RoleData.length : "no Employees Role Found"}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row d-flex" style={{ visibility: "hidden" }}>
                    <div class="col-lg-6 col-sm-6 flex-fill">
                        <div class="card gradient-1 text-center">
                            <div class="card-body">
                                <h3 class="card-title text-white">Total Employees</h3>
                                <div class="d-inline-block">
                                    <h3 class="card-title text-white">{employeeData ? employeeData.length : "no Employees Found"}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                <div class="col-lg-6 col-sm-6 flex-fill">
                        <div class="card gradient-3 text-center">
                            <div class="card-body">
                                <h3 class="card-title text-white">Roles</h3>
                                <div class="d-inline-block">
                                    <h3 class="card-title text-white">{RoleData ? RoleData.length : "no Employees Role Found"}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row d-flex" style={{ visibility: "hidden" }}>
                    <div class="col-lg-6 col-sm-6 flex-fill">
                        <div class="card gradient-1 text-center">
                            <div class="card-body">
                                <h3 class="card-title text-white">Total Employees</h3>
                                <div class="d-inline-block">
                                    <h3 class="card-title text-white">{employeeData ? employeeData.length : "no Employees Found"}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                <div class="col-lg-6 col-sm-6 flex-fill">
                        <div class="card gradient-3 text-center">
                            <div class="card-body">
                                <h3 class="card-title text-white">Roles</h3>
                                <div class="d-inline-block">
                                    <h3 class="card-title text-white">{RoleData ? RoleData.length : "no Employees Role Found"}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row d-flex" style={{ visibility: "hidden" }}>
                    <div class="col-lg-6 col-sm-6 flex-fill">
                        <div class="card gradient-1 text-center">
                            <div class="card-body">
                                <h3 class="card-title text-white">Total Employees</h3>
                                <div class="d-inline-block">
                                    <h3 class="card-title text-white">{employeeData ? employeeData.length : "no Employees Found"}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                <div class="col-lg-6 col-sm-6 flex-fill">
                        <div class="card gradient-3 text-center">
                            <div class="card-body">
                                <h3 class="card-title text-white">Roles</h3>
                                <div class="d-inline-block">
                                    <h3 class="card-title text-white">{RoleData ? RoleData.length : "no Employees Role Found"}</h3>
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