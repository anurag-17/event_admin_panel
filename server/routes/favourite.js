const express = require("express");
const router = express.Router();

const {
    addToFavourite,
    deleteFavouriteEvent,
    getFavouriteEvent,
} = require("../controllers/favouriteEvent");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/addToFavourite",isAuthenticatedUser, addToFavourite);

router.delete("/deleteFavouriteEvent", isAuthenticatedUser, deleteFavouriteEvent);

router.get("/getFavouriteEvent/:userId", isAuthenticatedUser, getFavouriteEvent);

module.exports = router;
