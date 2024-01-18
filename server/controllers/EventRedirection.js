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
    const currentDate = new Date();

    await EventRedirection.deleteMany({
      $or: [
        { event: null },
        { event: { $exists: true, $ne: null }, 'event.endDate': { $lt: currentDate } },
      ],
    });
    
    const { page = 1, limit = 20, eventId } = req.query;

    const currentPage = parseInt(page, 10);
    const itemsPerPage = parseInt(limit, 10);

    let query = {};

    if (eventId) {
      query.event = eventId;
    }

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
    console.log("EEEE",error);
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