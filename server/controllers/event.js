const Event = require("../models/Event");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const axios = require("axios");

exports.createEvent = asyncHandler(async (req, res) => {
  try {
    const existingEvent = await Event.findOne({ name: req.body.name });

    if (existingEvent) {
      return res
        .status(409)
        .json({ error: "Event with this name already exists" });
    }

    const newEvent = await Event.create(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.updateEvent = asyncHandler(async (req, res) => {
  const id = req.body._id;
  validateMongoDbId(id);
  const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json(updatedEvent);
});

exports.deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);
  const deletedEvent = await Event.findByIdAndDelete(id);
  res.json(deletedEvent);
});

exports.deleteBulkEvent = asyncHandler(async (req, res) => {
  // const { eventIds } = req.body;
  const deleteEvents = await Event.deleteMany();
  res.json(deleteEvents);
});

exports.getEvent = asyncHandler(async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);
  const getEvent = await Event.findById(id)
    .populate("category")
    .populate("subCategory");
  res.json(getEvent);
});

exports.getAllEvents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, searchQuery, startDate, endDate, category, subCategory } = req.query;

  const currentPage = parseInt(page, 10);
  const itemsPerPage = parseInt(limit, 10);

  let query = {}; // Initialize an empty query object

  if (searchQuery) {
    query.$or = [
      { name: { $regex: new RegExp(searchQuery, "i") } },
      { location: { $regex: new RegExp(searchQuery, "i") } },
      { city: { $regex: new RegExp(searchQuery, "i") } },
      { country: { $regex: new RegExp(searchQuery, "i") } },
    ];
  }

  if (startDate ) {
    query.startDate = { $gte: new Date(startDate) };
    // query.endDate = { $lte: new Date(endDate) };
  }

  if (category) {
    query.category = category;
  }

  if (subCategory) {
    query.subCategory = subCategory;
  }

  const totalEvents = await Event.countDocuments(query);
  const totalPages = Math.ceil(totalEvents / itemsPerPage);

  const skip = (currentPage - 1) * itemsPerPage;

  const allEvents = await Event.find(query)
    .skip(skip)
    .limit(itemsPerPage)
    .sort({ endDate: 1 })
    .populate("category")
    .populate("subCategory");

  res.json({
    current_page: currentPage,
    total_pages: totalPages,
    total_items: totalEvents,
    events: allEvents,
  });
});

exports.londontheatredirect = asyncHandler(async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Ensure startDate and endDate are provided
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Both startDate and endDate are required in the query parameters.' });
    }

    // Parse the provided dates
    const filterStartDate = new Date(startDate);
    const filterEndDate = new Date(endDate);

    // Fetch events data
    const eventsResponse = await axios.get(
      "https://api.londontheatredirect.com/rest/v2/Events",
      {
        headers: {
          Accept: "application/json",
          "Api-Key": "Testing12345",
        },
        params: {
          // Include any other necessary parameters
        },
      }
    );

    const events = eventsResponse.data.Events;

    // Filter events based on StartDate and EndDate
    const filteredEvents = events.filter((event) => {
      const eventStartDate = new Date(event.StartDate);
      const eventEndDate = new Date(event.EndDate);

      return eventStartDate >= filterStartDate && eventEndDate <= filterEndDate;
    });

    // Process and save each filtered event to the database
    for (const event of filteredEvents) {
      // Fetch venue details
      const venueResponse = await axios.get(
        `https://api.londontheatredirect.com/rest/v2/Venues/${event.VenueId}`,
        {
          headers: {
            Accept: "application/json",
            "Api-Key": "Testing12345",
          },
        }
      );

      const venueData = venueResponse.data.Venue;

      // Extract relevant venue information
      const venueInfo = {
        city: venueData.City,
        address: venueData.Address,
        location: venueData.Name,
      };

      // Extract relevant event information
      const eventData = {
        name: event.Name,
        description: event.Description,
        startDate: event.StartDate,
        endDate: event.EndDate,
        image: event.MainImageUrl,
        price: event.CurrentPrice,
        resource_url: event.EventDetailUrl,
        ...venueInfo,
      };

      // Save the event to the database
      await Event.create(eventData);
    }

    res.status(200).json({ message: "Filtered events saved successfully." });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
