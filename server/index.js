const express = require("express");
const app = express();
require('dotenv').config();
const bodyParser = require("body-parser");
const cors = require("cors");
const ConnectDB = require("./config/Db");
const path = require("path");

//cors is a middleware used as a bridge for connection between server and client
const corOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};

// middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corOptions));

//    routes
app.use("/api/role", require("./routers/RoleRouter"));
app.use("/api/employee", require("./routers/EmployeeRouter"));
app.use("/api/employee/login", require("./routers/LoginRouter"));
// app.use("/api/expance/category", require("./routers/ExpanceCategoryRouter"));
// app.use("/api/expance", require("./routers/ExpanceRouter"));
app.use("/api/attendance", require("./routers/AttendanceRouter"));
app.use("/api/salary", require("./routers/SalaryRouter"));
app.use("/api/holiday", require("./routers/HolidayRouter"));
app.use("/api/leave", require("./routers/LeaveRouter"));
app.use("/api/leaveType", require("./routers/LeaveTypeRouter"));
app.use("/api/markAbsences", require("./routers/AbsentRouter"));


// Server Listening
const PORT = process.env.Port || 6000;
ConnectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is successfully running on http://localhost:${PORT}/`);
  });
});
