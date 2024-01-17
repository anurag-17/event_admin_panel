const mongoose = require("mongoose");

const EventRedirectionSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    redirection: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const EventRedirection = mongoose.model("EventRedirection",EventRedirectionSchema);

module.exports = EventRedirection;
