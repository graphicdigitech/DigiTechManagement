import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const RequestLeave = () => {
  const [leaveTypes, setLeaveTypes] = useState([]); // Initialized as array
  const [leaveTypeName, setLeaveTypeName] = useState("");
  const [selectedLeaveType, setSelectedLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [id, setId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const showErrorAlert = (message) => {
    Swal.fire({ icon: "error", title: "Oops...", text: message });
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: message,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  useEffect(() => {
    const userToken = Cookies.get("UserAuthToken");

    if (userToken) {
      try {
        const decodedToken = jwtDecode(userToken);
        const userRole = decodedToken.userrole;
        const userid = decodedToken.userid;
        setId(userid);
        if (!(Array.isArray(userRole) ? userRole.includes("Admin") : userRole === "Admin")) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/leaveType/active/leavetype`);
        setLeaveTypes(res.data);
      } catch (error) {
        console.error("Error fetching leave types:", error);
      }
    };
    fetchLeaveTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      Swal.fire({
        icon: "warning",
        title: "Request Already Sent",
        text: "Please wait while we process your previous request",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    setIsSubmitting(true);

    const formData = {
      employee: id,
      leaveType: selectedLeaveType,
      startDate,
      endDate,
      reason,
      leaveTypeName, // include leave type name for historical reference
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/leave`, formData);
      showSuccessAlert(response.data.msg);
      setTimeout(() => {
        navigate("/employee/leave-history");
      }, 2000);
    } catch (error) {
      showErrorAlert(error.response?.data?.err || "Leave Request Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid">
      <button
        type="button"
        className="btn mb-3 btn-primary"
        onClick={() => navigate(-1)}
      >
        <i
          className="fa-solid fa-arrow-left-long"
          style={{ fontSize: "20px", fontWeight: "900" }}
        ></i>
      </button>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Request Leave</h4>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group col-md-12" style={formGroup}>
                    <label>Leave Type</label>
                    <select
                      className="form-control"
                      style={inputStyle}
                      onChange={(e) => {
                        setSelectedLeaveType(e.target.value);
                        setLeaveTypeName(
                          e.target.options[e.target.selectedIndex].text
                        );
                      }}
                      defaultValue=""
                    >
                      <option disabled value="">
                        Choose Leave Type
                      </option>
                      {leaveTypes.length > 0 ? (
                        leaveTypes.map((lt) => (
                          <option key={lt._id} value={lt._id}>
                            {lt.leaveTypeName}
                          </option>
                        ))
                      ) : (
                        <option disabled>No Leave Types Available</option>
                      )}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>Leave Start Date</label>
                    <input
                      style={inputStyle}
                      type="date"
                      className="form-control"
                      placeholder="Start Date"
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label>Leave End Date</label>
                    <input
                      style={inputStyle}
                      type="date"
                      className="form-control"
                      placeholder="End Date"
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group col-md-12 p-0">
                  <label>Leave Reason</label>
                  <textarea
                    style={inputStyle}
                    className="form-control"
                    placeholder="Enter leave reason"
                    onChange={(e) => setReason(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Sending Leave Request..." : "Send Leave Request"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <center className="card py-5" style={{ visibility: "hidden" }}>
        <div className="row"></div>
      </center>
    </div>
  );
};

const formGroup = {
  marginBottom: "20px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #e0e0e0",
  borderRadius: "4px",
  fontSize: "14px",
  boxSizing: "border-box",
};

export default RequestLeave;
