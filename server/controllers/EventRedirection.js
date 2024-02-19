const asyncHandler = require("express-async-handler");
const EventRedirection = require("../models/EventRedirection");
const Event = require("../models/Event");

exports.eventRedirection = asyncHandler(async (req, res) => {
  const { eventId } = req.body;

  if (!eventId) {
    return res.status(400).json({ error: "eventId is required" });
  }

  const event = await Event.findById(eventId);

  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  let eventRedirection = await EventRedirection.findOne({ event: eventId });

  if (!eventRedirection) {
    eventRedirection = await EventRedirection.create({ event: eventId });
  }

  // Increment the redirection count
  eventRedirection.redirection += 1;

  await eventRedirection.save();

  res.status(200).json({ redirectionCount: eventRedirection.redirection });
});

exports.getAllEventRedirections = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 20, eventId } = req.query;

    const currentPage = parseInt(page, 10);
    const itemsPerPage = parseInt(limit, 10);

    let query = {};

    if (eventId) {
      query.event = eventId;
    }

    // Filter out non-existing events 
    const favoriteEvents = await EventRedirection.find();
    const idsToRemove = favoriteEvents
      .filter((fav) => fav.event === null)
      .map((fav) => fav._id);

      if (idsToRemove.length > 0) {
        await EventRedirection.deleteMany({ _id: { $in: idsToRemove } });
      }

    const deletionResult = await EventRedirection.deleteMany({ $or: [{ event: null }, { event: { $exists: false } }] });

    console.log("Deletion result:", deletionResult);

    const totalEventRedirections = await EventRedirection.countDocuments(query);
    const totalPages = Math.ceil(totalEventRedirections / itemsPerPage);

    const skip = (currentPage - 1) * itemsPerPage;

    const allEventRedirections = await EventRedirection.find(query)
      .skip(skip)
      .limit(itemsPerPage)
      .populate({
        path: 'event',
        populate: {
          path: 'category',
        },
      });

    res.status(200).json({
      current_page: currentPage,
      total_pages: totalPages,
      total_items: totalEventRedirections,
      eventRedirections: allEventRedirections,
    });
  } catch (error) {
    console.log("EEEE", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.getEventRedirectionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const eventRedirection = await EventRedirection.findById(id).populate({
    path: "event",
    populate: {
      path: "category",
    },
  });

  if (!eventRedirection) {
    return res.status(404).json({ error: "EventRedirection not found" });
  }

  res.status(200).json(eventRedirection);
});

exports.updateEventRedirectionById = asyncHandler(async (req, res) => {
  const id = req.body._id;

  const eventRedirection = await EventRedirection.findById(id);

  if (!eventRedirection) {
    return res.status(404).json({ error: "EventRedirection not found" });
  }

  await eventRedirection.save();

  res.status(200).json(eventRedirection);
});

exports.deleteEventRedirectionById = asyncHandler(async (req, res) => {
  const id = req.body._id;

  const eventRedirection = await EventRedirection.findById(id);

  if (!eventRedirection) {
    return res.status(404).json({ error: "EventRedirection not found" });
  }

  await EventRedirection.deleteOne({ _id: id });

  res.status(200).json({ message: "EventRedirection deleted successfully" });
});

exports.getRedirectedEvents = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const currentPage = parseInt(page, 10);
    const itemsPerPage = parseInt(limit, 10);

    const events = await EventRedirection.find()
      .populate({
        path: "event",
        populate: [
          { path: "category" },
          { path: "subCategory" }
        ]
      })
      .sort({ redirection: -1 })
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .exec();

    const totalEvents = await EventRedirection.countDocuments();

    const totalPages = Math.ceil(totalEvents / itemsPerPage);

    // Formatting events to include redirection count
    const formattedEvents = events.map(event => ({
      _id: event.event._id,
      name: event.event.name,
      description: event.event.description,
      startDate: event.event.startDate,
      endDate: event.event.endDate,
      location: event.event.location,
      city: event.event.city,
      address: event.event.address,
      latitude: event.event.latitude,
      longitude: event.event.longitude,
      price: event.event.price,
      category: event.event.category,
      subCategory: event.event.subCategory,
      images: event.event.images,
      resource_url: event.event.resource_url,
      event_provider: event.event.event_provider,
      createdAt: event.event.createdAt,
      updatedAt: event.event.updatedAt,
      redirection_count: event.redirection 
    }));

    res.json({
      current_page: currentPage,
      total_pages: totalPages,
      total_items: totalEvents,
      events: formattedEvents,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});