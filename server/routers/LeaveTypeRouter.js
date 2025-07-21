const express = require("express");
const {
  createLeaveType,
  getLeaveType,
  getSingleLeaveType,
  updateLeaveType,
  deleteLeaveType,
  getActiveLeaveType,
} = require("../controller/LeaveTypeController");
const router = express.Router();

router.route("/").get(getLeaveType).post(createLeaveType);
router.route("/:id").get(getSingleLeaveType).put(updateLeaveType).delete(deleteLeaveType);
router.route("/active/leavetype").get(getActiveLeaveType);

module.exports = router;
