const mongoose = require("mongoose");

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
      type: String,
    },
    longitude: {
      type: String,
    },
    price: {
      type: String,
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

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
