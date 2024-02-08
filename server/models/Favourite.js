const mongoose = require("mongoose");

const FavoriteEventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event", // Reference to the Event model
  },
});

const FavoriteEvent = mongoose.model("FavoriteEvent", FavoriteEventSchema);

module.exports = FavoriteEvent;
