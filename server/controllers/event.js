const Event = require("../models/Event");
const Category = require("../models/Category");
const SubCategory = require("../models/subCategory");
const User = require("../models/User");
const EventRedirection = require("../models/EventRedirection");
const EventIssue = require("../models/EventIssue");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const axios = require('axios');

exports.createEvent = asyncHandler(async (req, res) => {
  try {
    const existingEvent = await Event.findOne({ name: req.body.name });

    if (existingEvent) {
      return res
        .status(409)
        .json({ error: "Event with this name already exists" });
    }

    // Use Google Geocoding API to get latitude and longitude
    const address  = req.body.location;
    const googleApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAP_KEY}`;

    const geocodingResponse = await axios.get(googleApiUrl);

    if (geocodingResponse.data.results.length === 0) {
      return res.status(400).json({ error: "Invalid address, cannot find coordinates" });
    }

    const location = geocodingResponse.data.results[0].geometry.location;

    // const imagesArray = Array.isArray(req.body.imags)
    //         ? req.body.imags.map((url, index) => ({ url, position: index }))
    //         : [{ url: req.body.imags, position: 0 }];

    // Add latitude and longitude to the request body
    req.body.latitude = location.lat;
    req.body.longitude = location.lng;
    // req.body.images = imagesArray;
    req.body.event_provider = "Sterna";
    
    // Create the new event
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
  try {
    const { id } = req.body;
    validateMongoDbId(id);

    const eventRedirections = await EventRedirection.find({ event: id });

    for (const eventRedirection of eventRedirections) {
      await EventRedirection.deleteOne({ _id: eventRedirection._id });
    }

    const eventIssues = await EventIssue.find({ event: id });

    for (const eventIssue of eventIssues) {
      await EventIssue.deleteOne({ _id: eventIssue._id });
    }

    // Delete the event
    const deletedEvent = await Event.findByIdAndDelete(id);

    res.json(deletedEvent);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

exports.deleteBulkEvent = asyncHandler(async (req, res) => {
  try {
    // const { eventIds } = req.body;

    // if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
    //   return res.status(400).json({ error: 'Invalid eventIds array in the request body.' });
    // }

    const deleteEvents = await Event.deleteMany({  });
    
    res.json({ message: `${deleteEvents.deletedCount} events deleted successfully.` });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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
  try {
    // Delete expired events first
    const currentDate = new Date();
    // await Event.deleteMany({ endDate: { $lt: currentDate } });

    const expiredEvents = await Event.find({ endDate: { $lt: currentDate } });

    for (const event of expiredEvents) {
      const eventRedirections = await EventRedirection.find({ event: event._id });

      for (const eventRedirection of eventRedirections) {
        await EventRedirection.deleteOne({ _id: eventRedirection._id });
      }

      const eventIssues = await EventIssue.find({ event: event._id });

      for (const eventIssue of eventIssues) {
        await EventIssue.deleteOne({ _id: eventIssue._id });
      }
    }

    await Event.deleteMany({ endDate: { $lt: currentDate } });
    
    const { page = 1, limit = 20, searchQuery, startDate, endDate, category, subCategory, provider ,city ,country} = req.query;

    const currentPage = parseInt(page, 10);
    const itemsPerPage = parseInt(limit, 10);

    let query = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { location: { $regex: new RegExp(searchQuery, "i") } },
        { city: { $regex: new RegExp(searchQuery, "i") } },
        { country: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    if (startDate) {
      const parsedStartDate = new Date(startDate);
      if (isNaN(parsedStartDate)) {
        return res.status(401).json({ status: 'fail', message: 'Invalid start date format' });
      }
      query.startDate = { $gte: parsedStartDate };
    }

    if (endDate) {
      const parsedEndDate = new Date(endDate);
      if (isNaN(parsedEndDate)) {
        return res.status(401).json({ status: 'fail', message: 'Invalid end date format' });
      }

      parsedEndDate.setHours(23, 59, 59, 999);
      
      query.endDate = { $lte: parsedEndDate };
    }

    if (category) {
      query.category = category;
    }

    if (subCategory) {
      query.subCategory = subCategory;
    }

    if (provider) {
      query.event_provider = provider;
    }

    if (city) {
      query.city = city;
    }

    if (country) {
      query.country = country;
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
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

exports.getDashEvents = asyncHandler(async (req, res) => {
  try {
    // Delete expired events first
    const currentDate = new Date();
    await Event.deleteMany({ endDate: { $lt: currentDate } });
    
    const { page = 1, limit = 20, searchQuery, startDate, endDate, category, subCategory, provider ,city} = req.query;

    const currentPage = parseInt(page, 10);
    const itemsPerPage = parseInt(limit, 10);

    let query = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { location: { $regex: new RegExp(searchQuery, "i") } },
        { city: { $regex: new RegExp(searchQuery, "i") } },
        { country: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    if (startDate) {
      const parsedStartDate = new Date(startDate);
      if (isNaN(parsedStartDate)) {
        return res.status(401).json({ status: 'fail', message: 'Invalid start date format' });
      }
      query.startDate = { $gte: parsedStartDate };
    }

    if (endDate) {
      const parsedEndDate = new Date(endDate);
      if (isNaN(parsedEndDate)) {
        return res.status(401).json({ status: 'fail', message: 'Invalid end date format' });
      }
      query.endDate = { $lte: parsedEndDate };
    }

    if (category) {
      query.category = category;
    }

    if (subCategory) {
      query.subCategory = subCategory;
    }

    if (provider) {
      query.event_provider = provider;
    }

    if (city) {
      query.city = city;
    }

    const totalEvents = await Event.countDocuments(query);
    const totalPages = Math.ceil(totalEvents / itemsPerPage);

    const skip = (currentPage - 1) * itemsPerPage;

    const allEvents = await Event.find(query)
      .skip(skip)
      .limit(itemsPerPage)
      .sort({ createdAt: -1 })
      .populate("category")
      .populate("subCategory");

    res.json({
      current_page: currentPage,
      total_pages: totalPages,
      total_items: totalEvents,
      events: allEvents,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

exports.getStats = asyncHandler(async (req, res) => {
  try {
    const { category, subCategory, provider } = req.query;

    let query = {};

    if (category) {
      const categoryObject = await Category.findOne({ title: category });
      if (categoryObject) {
        query.category = categoryObject._id;
      } else {
        return res.status(404).json({ status: 'fail', message: 'Category not found' });
      }
    }

    if (subCategory) {
      const subCategoryObject = await SubCategory.findOne({ subCategory });
      if (subCategoryObject) {
        query.subCategory = subCategoryObject._id;
      } else {
        return res.status(404).json({ status: 'fail', message: 'SubCategory not found' });
      }
    }

    if (provider) {
      query.event_provider = provider;
    }

    const totalEvents = await Event.countDocuments(query);
    const totalCategories = await Category.countDocuments(query);
    const totalSubCategories = await SubCategory.countDocuments(query);
    const totalUsers = await User.countDocuments(query);
    const totalEventRedirections = await EventRedirection.countDocuments(query);
    const totalEventIssues = await EventIssue.countDocuments(query);

    res.json({
      totalEvents,
      totalCategories,
      totalSubCategories,
      totalUsers,
      totalEventRedirections,
      totalEventIssues
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Function to map EventType to Category
function mapEventTypeToCategory(eventType, eventTypes) {
  const eventTypeMap = {};

  // Populate eventTypeMap from the eventTypes array
  for (const type of eventTypes) {
    eventTypeMap[type.EventTypeId] = type.EventTypeName;
  }

  return eventTypeMap[eventType] || "Other";
};
exports.londontheatredirect = asyncHandler(async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    // Default startDate to the current date if not provided
    startDate = startDate ? new Date(startDate) : new Date();

    // Default endDate to one month after the current date if not provided
    endDate = endDate ? new Date(endDate) : new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const eventTypesResponse = await axios.get(
      "https://api.londontheatredirect.com/rest/v2/System/EventTypes",
      {
        headers: {
          Accept: "application/json",
          "Api-Key": process.env.londontheatredirectkey,
        },
      }
    );
    const eventTypes = eventTypesResponse.data.EventTypes;  

    // Fetch events data
    const eventsResponse = await axios.get(
      "https://api.londontheatredirect.com/rest/v2/Events",
      {
        headers: {
          Accept: "application/json",
          "Api-Key": process.env.londontheatredirectkey,
        },
        params: {
          // Include any other necessary parameters
        },
      }
    );

    const events = eventsResponse.data.Events;

    // Initialize the eventsAdded counter
    let eventsAdded = 0;

    // Filter events based on startDate and endDate
    const filteredEvents = events.filter((event) => {
      const eventStartDate = new Date(event.StartDate);
      const eventEndDate = new Date(event.EndDate);

      return eventStartDate >= startDate && eventEndDate <= endDate;
    });

    // Process and save each filtered event to the database
    for (const event of filteredEvents) {
      // Check if the event already exists in the database
      const existingEvent = await Event.findOne({ name: event.Name, startDate: event.StartDate, endDate: event.EndDate });

      if (existingEvent) {
        console.error(`Event ${event.Name} already exists. Skipping...`);
      } else {
        // Fetch venue details
        const venueResponse = await axios.get(
          `https://api.londontheatredirect.com/rest/v2/Venues/${event.VenueId}`,
          {
            headers: {
              Accept: "application/json",
              "Api-Key": process.env.londontheatredirectkey,
            },
          }
        );

        const eventTypeCategory = mapEventTypeToCategory(
          event.EventType,
          eventTypes
        );

        // Find or create the category in the Category model
        let category = await Category.findOne({ title: eventTypeCategory });

        if (!category) {
          // If the category doesn't exist, create it
          category = await Category.create({ title: eventTypeCategory });
        }

        const venueData = venueResponse.data.Venue;

        // Use Google Geocoding API to get latitude and longitude for the venue
        const addressToGeocode = venueData.Address || venueData.Name;
        const googleApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressToGeocode)}&key=${process.env.GOOGLE_MAP_KEY}`;
        const geocodingResponse = await axios.get(googleApiUrl);
        
        if (geocodingResponse.data.results && geocodingResponse.data.results.length > 0) {
          const location = geocodingResponse.data.results[0].geometry.location;
        
          // Extract relevant venue information
          const venueInfo = {
            city: venueData.City.trim(),
            address: venueData.Address || venueData.Name,
            location: venueData.Name,
            latitude: location.lat,
            longitude: location.lng,
          };
          const imagesArray = Array.isArray(event.MainImageUrl)
            ? event.MainImageUrl.map((url, index) => ({ url, position: index }))
            : [{ url: event.MainImageUrl, position: 0 }];
          // Extract relevant event information
          const eventData = {
            name: event.Name,
            description: event.Description,
            startDate: event.StartDate,
            endDate: event.EndDate,
            images: imagesArray,
            price: event.CurrentPrice,
            resource_url: event.EventDetailUrl,
            ...venueInfo,
            event_provider: "London Theatre Direct",
            category: category._id,
          };
        
          // Save the event to the database
          await Event.create(eventData);
          console.log(`Event ${event.Name} saved successfully.`);
          
          // Increment the eventsAdded counter
          eventsAdded++;
        } else {
          console.error("Error fetching geocoding data:", geocodingResponse.data.error_message || "Unknown error");
        }
      }
    }

    res.status(200).json({ message: `Filtered events saved successfully. ${eventsAdded} event(s) added.` });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(403).send("Internal Server Error");
  }
});

function mapEventCodeToCategory(eventCode) {
  const codeToCategoryMap = {
    FEST: "Festivals",
    LIVE: "Live music",
    CLUB: "Clubbing/Dance music",
    DATE: "Dating event",
    THEATRE: "Theatre/Dance",
    COMEDY: "Comedy",
    EXHIB: "Exhibitions and Attractions",
    KIDS: "Kids/Family event",
    BARPUB: "Bar/Pub event",
    LGB: "Gay/Lesbian event",
    SPORT: "Sporting event",
    ARTS: "The Arts",
  };

  return codeToCategoryMap[eventCode] || "Other";
}
exports.skiddleEvents = asyncHandler(async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    // Default startDate to the current date if not provided
    startDate = startDate ? new Date(startDate) : new Date();

    // Default endDate to one month after the current date if not provided
    endDate = endDate ? new Date(endDate) : new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    // Fetch events data from Skiddle API
    const skiddleApiUrl = `https://www.skiddle.com/api/v1/events/?api_key=${process.env.skiddleApiKey}&limit=100`;
    
    const skiddleResponse = await axios.get(skiddleApiUrl);
    const skiddleEvents = skiddleResponse.data.results;

    // Initialize the eventsAdded counter
    let eventsAdded = 0;

    // Filter events based on startDate and endDate
    const filteredEvents = skiddleEvents.filter((event) => {
      const eventStartDate = new Date(event.startdate);
      const eventEndDate = new Date(event.enddate || event.startdate);

      return eventStartDate >= startDate && eventEndDate <= endDate;
    });

    // Process and save each filtered event to the database
    for (const event of filteredEvents) {
      // Check if the event already exists in the database

      const eventCategory = mapEventCodeToCategory(event.EventCode);

      // Find or create the category in the Category model
      const category = await Category.findOneAndUpdate(
        { title: eventCategory },
        { title: eventCategory },
        { upsert: true, new: true }
      );    

      const existingEvent = await Event.findOne({
        name: event.eventname,
        startDate: event.startdate,
        endDate: event.enddate
      });

      if (existingEvent) {
        console.error(`Event ${event.eventname} already exists. Skipping...`);
      } else {
        const imagesArray = Array.isArray(event.imageurl)
          ? event.imageurl.map((url, index) => ({ url, position: index }))
          : [{ url: event.imageurl, position: 0 }];

        const eventData = {
          name: event.eventname,
          description: event.description,
          startDate: event.startdate,
          endDate: event.enddate,
          images: imagesArray,
          location: event.venue.name,
          address: event.venue.address,
          city: event.venue.town.trim(),
          country: event.venue.country,
          latitude: event.venue.latitude,
          longitude: event.venue.longitude,
          resource_url: `${event.link}?sktag=15306`,
          price: event.entryprice,
          event_provider: "Skiddle",
          category: category._id,
        };

        // Save the event to the database
        await Event.create(eventData);
        
        // Increment the eventsAdded counter
        eventsAdded++;
      }
    }

    res.status(200).json({ message: `Filtered events saved successfully. ${eventsAdded} event(s) added.` });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});