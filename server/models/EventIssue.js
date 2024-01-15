const mongoose = require("mongoose");

const eventIssueSchema = new mongoose.Schema(
  {
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
    },
    issue: {
      type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const EventIssue = mongoose.model("EventIssue", eventIssueSchema);

module.exports = EventIssue;
