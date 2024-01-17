const express = require("express");
const router = express.Router();

const {
    eventRedirection,
    updateEventRedirectionById,
    deleteEventRedirectionById,
   getEventRedirectionById,
getAllEventRedirections,
} = require("../controllers/EventRedirection");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/eventRedirection", isAuthenticatedUser ,eventRedirection);

router.put("/updateEventRedirectionById", isAuthenticatedUser, updateEventRedirectionById);

router.delete("/deleteEventRedirection", isAuthenticatedUser, authorizeRoles("admin"), deleteEventRedirectionById);

router.get("/getEventRedirectionById/:id", isAuthenticatedUser, getEventRedirectionById);

router.get("/getAllEventRedirections", isAuthenticatedUser, getAllEventRedirections);

module.exports = router;
