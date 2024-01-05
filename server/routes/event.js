const express = require("express");
const router = express.Router();

const {
    createEvent,
    updateEvent,
    deleteEvent,
    deleteBulkEvent,
    getEvent,
    getAllEvents,
    londontheatredirect
} = require("../controllers/event");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/createEvent", isAuthenticatedUser, authorizeRoles("admin"), createEvent);

router.put("/updateEvent", isAuthenticatedUser, authorizeRoles("admin"), updateEvent);

router.delete("/deleteEvent", isAuthenticatedUser, authorizeRoles("admin"), deleteEvent);

router.post("/deleteBulkEvent", isAuthenticatedUser, authorizeRoles("admin"), deleteBulkEvent);

router.post("/getEvent", getEvent);

router.get("/getAllEvents", getAllEvents);

router.get("/londontheatredirect", londontheatredirect);

module.exports = router;
