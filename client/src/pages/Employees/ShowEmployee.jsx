import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// Utility function to convert 24-hour time to 12-hour format
const convertTo12HourFormat = (time) => {
  if (!time) return "N/A"; // Handle empty or undefined time

  // Split the time into hours, minutes, and seconds
  const [hours, minutes, seconds] = time.split(":");

  // Convert hours to a number
  let hour = parseInt(hours, 10);

  // Determine AM/PM
  const period = hour >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hour = hour % 12 || 12; // Handle midnight (0 becomes 12 AM)

  // Return formatted time
  return `${hour}:${minutes} ${period}`;
};

const ShowEmployee = () => {
  const [employeeData, setEmployeeData] = useState([]); // Raw employee data
  const [search, setSearch] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState([]); // Filtered employees
  const [RoleFilter, setRoleFilter] = useState(""); // State to store selected role filter
  const [salaryRange, setSalaryRange] = useState({ min: "", max: "" }); // State for salary range filter
  // State to track sorting direction: 'asc' for ascending, 'desc' for descending, and 'none' for no sort
  const [sortDirection, setSortDirection] = useState("none");

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const userToken = Cookies.get("UserAuthToken");

    if (userToken) {
      try {
        const decodedToken = jwtDecode(userToken); // Decode the JWT token
        const userRole = decodedToken.userrole; // Get the user role(s)

        // Redirect to login if the user is not an Admin
        if (
          !(Array.isArray(userRole) && userRole.includes("Admin")) && // Array case
          userRole !== "Admin" // String case
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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}api/employee`);
        setEmployeeData(res.data);
        setFilteredData(res.data); // Initialize filtered data with all employees
      } catch (error) {
        console.log("Error Fetching Employees Data", error);
      }
    };
    fetchEmployees();
  }, []);

  // Handle pagination logic on changes
  useEffect(() => {
    setTotalPages(Math.ceil(filteredData.length / pageSize));
  }, [filteredData, pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    // Filter employees whenever search, RoleFilter, or salaryRange changes
    const filteredEmployees = employeeData.filter((employee) => {
      // Check if the employee matches the search term
      const matchesSearch =
        employee?.employeeName
          .toLowerCase()
          .includes(search.toLowerCase().trim()) ||
        employee?.employeeEmail
          .toLowerCase()
          .includes(search.toLowerCase().trim()) ||
        employee?.employeeId
          .toLowerCase()
          .includes(search.toLowerCase().trim());

      // Check if the employee matches the role filter (handles role being an array)
      const matchesRole = RoleFilter
        ? employee.employeeRoles?.some((role) =>
            role?.roleName.toLowerCase().includes(RoleFilter.toLowerCase())
          )
        : true;

      // Check if the employee matches the salary range
      const matchesSalary =
        (!salaryRange.min ||
          employee?.employeeSalary >= parseFloat(salaryRange.min)) &&
        (!salaryRange.max ||
          employee?.employeeSalary <= parseFloat(salaryRange.max));

      return matchesSearch && matchesRole && matchesSalary;
    });

    setFilteredData(filteredEmployees); // Set filtered data
  }, [search, RoleFilter, salaryRange, employeeData]); // Run the effect when search, RoleFilter, salaryRange, or employeeData changes

  // Extract all roles from employee data for dropdown
  const allRoles = [
    ...new Set(
      employeeData
        .map((employee) => employee.employeeRoles?.map((role) => role.roleName)) // Extract role names from employeeRole array
        .flat()
    ),
  ];

  const deleteEmployee = async (employeeid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${process.env.REACT_APP_API_URL}api/employee/${employeeid}`);
          setEmployeeData(
            employeeData.filter((employee) => employee._id !== employeeid)
          );
          setFilteredData(
            filteredData.filter((employee) => employee._id !== employeeid)
          );
          Swal.fire("Deleted!", response.data.msg, "success");
        } catch (error) {
          Swal.fire(
            "Error",
            error?.response?.data?.err ||
              "An unexpected error occurred. Please try again.",
            "error"
          );
          console.error("Error deleting employee:", error);
        }
      }
    });
  };

  // Pagination slice
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Sort function based on employeeId
  const handleSort = () => {
    if (sortDirection === "none" || sortDirection === "desc") {
      setSortDirection("asc");
    } else {
      setSortDirection("desc");
    }
  };

  // const sortedData = [...filteredData].sort((a, b) => {
  //   const numA = parseInt(a.employeeId.substring(5), 10);
  //   const numB = parseInt(b.employeeId.substring(5), 10);

  //   if (sortDirection === "asc") {
  //     return numA - numB; // ascending
  //   } else if (sortDirection === "desc") {
  //     return numB - numA; // descending
  //   }
  //   return 0; // no sort
  // });
  const sortedData = [...filteredData].sort((a, b) => {
    // Helper function to extract number from employeeId
    const getIdNumber = (employee) => {
      if (!employee?.employeeId || typeof employee.employeeId !== 'string') {
        return Infinity; // Push invalid entries to the end
      }
      const idPart = employee.employeeId.substring(5);
      const num = parseInt(idPart, 10);
      return isNaN(num) ? Infinity : num; // Handle non-numeric IDs
    };
  
    const numA = getIdNumber(a);
    const numB = getIdNumber(b);
  
    if (sortDirection === "asc") {
      return numA - numB; // Ascending
    } else if (sortDirection === "desc") {
      return numB - numA; // Descending
    }
    return 0; // No sort
  });

  return (
    <>
      <div className="container-fluid mb-5">
        <div
          className="row"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginRight: "3%",
          }}
        >
          <Link
            type="button"
            className="btn mb-1 btn-primary"
            to="/addemployee"
          >
            Add Employee
            <span className="btn-icon-right">
              <i className="fa-solid fa-user-plus"></i>
            </span>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="row mt-1">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="row mt-2">
                  <div className="col-lg-4 col-md-5 col-sm-6 my-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by Name, Email, or ID"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)} // Update search query
                    />
                  </div>

                  <div className="col-lg-3 col-md-5 col-sm-5 my-2">
                    <select
                      id="inputState"
                      className="form-control"
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <option disabled selected>
                        Search By Role
                      </option>
                      <option value={""}>All</option>
                      {allRoles.length > 0 ? (
                        allRoles.map((role, index) => (
                          <option value={role || ""} key={index}>
                            {role || "N/A"}
                          </option>
                        ))
                      ) : (
                        <option disabled>No Roles Available</option>
                      )}
                    </select>
                  </div>

                  {/* Salary Range Filter */}
                  <div className="col-lg-5 col-md-10 col-sm-11 d-flex align-items-center my-2">
                    <input
                      min={1}
                      className="form-control"
                      type="number"
                      placeholder="Min Salary"
                      value={salaryRange.min}
                      onChange={(e) =>
                        setSalaryRange((prev) => ({
                          ...prev,
                          min: e.target.value,
                        }))
                      }
                    />
                    <span className="mx-2">to</span>
                    <input
                      min={1}
                      className="form-control"
                      type="number"
                      placeholder="Max Salary"
                      value={salaryRange.max}
                      onChange={(e) =>
                        setSalaryRange((prev) => ({
                          ...prev,
                          max: e.target.value,
                        }))
                      }
                    />
                    <button
                      className="btn btn-primary mx-3"
                      onClick={() => setSalaryRange({ min: "", max: "" })} // Reset salary range
                    >
                      Clear Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="row mt-2">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Employee</h4>
                {/* Pagination Controls */}
                {filteredData.length > pageSize && (
                  <div className="mt-5 mb-2 d-flex  justify-content-end">
                    <button
                      className="btn btn-sm mx-2"
                      onClick={() => handlePageChange(1)}
                      disabled={page <= 1}
                    >
                      First
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                    >
                      Prev
                    </button>
                    <span className="mx-2">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      className="btn btn-sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages}
                    >
                      Next
                    </button>
                    <button
                      className="btn mx-2 btn-sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={page >= totalPages}
                    >
                      Last
                    </button>
                  </div>
                )}
                <div className="table-responsive table-hover">
                  <table className="table header-border ">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th onClick={handleSort} style={{ cursor: "pointer" }}>
                          Employee Id{" "}
                          {sortDirection === "asc"
                            ? "↑"
                            : sortDirection === "desc"
                            ? "↓"
                            : ""}
                        </th>
                        <th>Employee Name</th>
                        <th>Employee Email</th>
                        <th>Employee Role</th>
                        <th>Employee TimeIn</th>
                        <th>Employee TimeOut</th>
                        <th>Employee Salary</th>
                        <th>Employee Allowances</th>{" "}
                        <th>Employee Leave Balance</th>
                        {/* New column for allowances */}
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedData.length > 0 ? (
                        sortedData.map((employee, index) => (
                          <tr key={index}>
                            <td>{startIndex + index + 1}</td>{" "}
                            {/* Correct index calculation */}
                            <td>{employee?.employeeId || "N/A"}</td>
                            <td>{employee?.employeeName || "N/A"}</td>
                            <td>{employee?.employeeEmail || "N/A"}</td>
                            <td>
                              {employee.employeeRoles?.length > 0
                                ? employee.employeeRoles.map((role, index) => (
                                    <span key={role.roleName}>
                                      {role?.roleName || "N/A"},
                                      <br />
                                    </span>
                                  ))
                                : "N/A"}
                            </td>
                            <td>
                              {employee?.employeeTimeIn
                                ? convertTo12HourFormat(employee.employeeTimeIn)
                                : "N/A"}{" "}
                            </td>
                            <td>
                              {employee?.employeeTimeOut
                                ? convertTo12HourFormat(
                                    employee?.employeeTimeOut
                                  )
                                : "N/A"}
                            </td>
                            <td>{employee?.employeeSalary || "N/A"}</td>
                            <td>
                              {employee?.employeeallowances &&
                              employee.employeeallowances.length > 0 ? (
                                <table>
                                  <thead>
                                    <tr>
                                      <th>Allowance Name</th>
                                      <th>Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {employee.employeeallowances.map(
                                      (allowance, idx) => (
                                        <tr key={idx}>
                                          <td>{allowance.name}</td>
                                          <td>{allowance.amount}</td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              ) : (
                                "No Allowances"
                              )}
                            </td>
                            <td>
                              {employee?.leaveBalances &&
                              employee?.leaveBalances.length > 0 ? (
                                <table>
                                  <thead>
                                    <tr>
                                      <th>Leave Type</th>
                                      <th>Current Balance</th>
                                      <th>Allowed Leaves</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {employee?.leaveBalances.map(
                                      (balance, idx) => (
                                        <tr key={idx}>
                                          <td>
                                            {balance?.leaveTypeId
                                              ?.leaveTypeName || "N/A"}
                                          </td>
                                          <td>
                                            {balance?.currentBalance || "N/A"}
                                          </td>
                                          <td>
                                            {balance?.allowedLeaves || "N/A"}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              ) : (
                                "No Leave Balances"
                              )}
                            </td>
                            <td>
                              <span>
                                <Link
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Edit"
                                  to={`/updateemployee/${employee._id}`}
                                >
                                  <button className="btn btn-primary btn-sm">
                                    <i className="fa fa-pencil color-muted mx-2"></i>{" "}
                                    Edit
                                  </button>
                                </Link>
                                <button
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Delete"
                                  className="btn btn-danger btn-sm mx-1 my-2"
                                  onClick={() => deleteEmployee(employee._id)}
                                >
                                  <i className="fa fa-trash"></i> Delete
                                </button>
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No employees found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Controls */}
                {filteredData.length > pageSize && (
                  <div className=" d-flex mt-3  justify-content-end">
                    <button
                      className="btn btn-sm mx-2"
                      onClick={() => handlePageChange(1)}
                      disabled={page <= 1}
                    >
                      First
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                    >
                      Prev
                    </button>
                    <span className="mx-2">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      className="btn btn-sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages}
                    >
                      Next
                    </button>
                    <button
                      className="btn mx-2 btn-sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={page >= totalPages}
                    >
                      Last
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <center className=" card py-5" style={{ visibility: "hidden" }}>
          <div className="row"></div>
        </center>
      </div>
    </>
  );
};

export default ShowEmployee;
