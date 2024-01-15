const express = require("express");
const router = express.Router();

const {
    createEventIssue,
    updateEventIssue,
    deleteEventIssue,
//   deleteBulkCategory,
  getEventIssue,
  getAllEventIssues,
} = require("../controllers/eventIssue");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/createEventIssue", isAuthenticatedUser, createEventIssue);

router.put("/updateEventIssue", isAuthenticatedUser, updateEventIssue);

router.delete("/deleteEventIssue", isAuthenticatedUser, authorizeRoles("admin"), deleteEventIssue);

// router.post("/deleteBulkCategory", isAuthenticatedUser, authorizeRoles("admin"), deleteBulkCategory);

router.post("/getEventIssue", isAuthenticatedUser, getEventIssue);

router.get("/getAllEventIssues", isAuthenticatedUser, getAllEventIssues);

module.exports = router;
