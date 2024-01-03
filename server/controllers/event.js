const Event = require("../models/Event");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

exports.createEvent = asyncHandler(async (req, res) => {
  const newEvent = await Event.create(req.body);
  res.json(newEvent);
});

exports.updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.body;
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
  const { eventIds } = req.body;
  const deleteEvents = await Event.deleteMany({ _id: { $in: eventIds } });
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
    const { page = 1, limit = 10 } = req.query;
  
    const currentPage = parseInt(page, 10);
    const itemsPerPage = parseInt(limit, 10);
  
    const totalEvents = await Event.countDocuments();
    const totalPages = Math.ceil(totalEvents / itemsPerPage);
  
    const skip = (currentPage - 1) * itemsPerPage;
  
    const allEvents = await Event.find()
    .skip(skip)
    .limit(itemsPerPage)
    .populate('category')
    .populate('subCategory');
  
    res.json({
      current_page: currentPage,
      total_pages: totalPages,
      total_items: totalEvents,
      events: allEvents,
    });
});