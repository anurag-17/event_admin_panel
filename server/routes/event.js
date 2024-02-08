const express = require("express");
const router = express.Router();

const {
    createEvent,
    updateEvent,
    deleteEvent,
    deleteBulkEvent,
    getEvent,
    getAllEvents,
    getDashEvents,
    londontheatredirect,
    skiddleEvents,
    getStats,
    giganticEvents
} = require("../controllers/event");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/createEvent", isAuthenticatedUser, authorizeRoles("admin"), createEvent);

router.put("/updateEvent", isAuthenticatedUser, authorizeRoles("admin"), updateEvent);

router.delete("/deleteEvent", isAuthenticatedUser, authorizeRoles("admin"), deleteEvent);

router.post("/deleteBulkEvent",  deleteBulkEvent);

router.post("/getEvent", getEvent);

router.get("/getAllEvents", getAllEvents);

router.get("/getDashEvents", getDashEvents);

router.get("/getStats", getStats);

router.get("/londontheatredirect", londontheatredirect);

router.get("/skiddleEvents", skiddleEvents);

router.get("/giganticEvents", giganticEvents);

module.exports = router;
