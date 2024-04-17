const mongoose = require("mongoose");
const EventIssue = require("../models/EventIssue");
const EventRedirection = require("../models/EventRedirection");

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    location: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    address: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    price: {
      type: Number,
      default:0
    },
    currency: {
      type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // Reference to the Category model
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory", // Reference to the SubCategory model
    },
    capacity: {
      type: String,
    },
    sourceCategory:{
      type: String,
    },
    images: [
      {
        url: { type: String },
        position: { type: Number }, // Add position property for image indexing
      },
    ],
    resource_url: {
      type: String,
    },
    event_provider: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

// Middleware to execute before removing an Event
EventSchema.pre("remove", async function (next) {
  try {
    // Delete related EventIssues
    await EventIssue.deleteMany({ event: this._id });

    // Delete related EventRedirections
    await EventRedirection.deleteMany({ event: this._id });

    // Continue with the remove operation
    next();
  } catch (error) {
    next(error);
  }
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
