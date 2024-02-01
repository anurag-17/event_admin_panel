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
// Set a default value of null for the event field
EventRedirectionSchema.pre('save', function (next) {
  if (!this.event) {
    this.event = null;
  }
  next();
});

const EventRedirection = mongoose.model("EventRedirection",EventRedirectionSchema);

module.exports = EventRedirection;
