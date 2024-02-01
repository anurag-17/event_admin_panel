const EventIssue = require("../models/EventIssue");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

exports.createEventIssue = asyncHandler(async (req, res) => {
  try {
    const newEventIssue = await EventIssue.create(req.body);
    res.status(201).json(newEventIssue);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});

exports.updateEventIssue = asyncHandler(async (req, res) => {
  const id = req.body._id;
  validateMongoDbId(id);

  const updatedEventIssue = await EventIssue.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedEventIssue) {
    res.status(404).json({ error: "EventIssue not found" });
  } else {
    res.json(updatedEventIssue);
  }
});

exports.deleteEventIssue = asyncHandler(async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);

  const deletedEventIssue = await EventIssue.findByIdAndDelete(id);

  if (!deletedEventIssue) {
    res.status(404).json({ error: "EventIssue not found" });
  } else {
    res.json(deletedEventIssue);
  }
});

exports.deleteBulkEventIssue = asyncHandler(async (req, res) => {
  try {
    const { EventIssueIds } = req.body;
    const deleteEventIssues = await EventIssue.deleteMany({
      _id: { $in: EventIssueIds },
    });

    res.json(deleteEventIssues);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.getEventIssue = asyncHandler(async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);

  const getEventIssue = await EventIssue.findById(id)
    .populate("event")
    .populate({
        path: "userId",
        select: "-passwordResetToken -passwordResetExpires -updatedAt -createdAt -provider_ID -role -provider -password -__v",
      });

  if (!getEventIssue) {
    res.status(404).json({ error: "EventIssue not found" });
  } else {
    res.json(getEventIssue);
  }
});

exports.getAllEventIssues = asyncHandler(async (req, res) => {
  try {
    const deletionResult = await EventRedirection.deleteMany({
      event: { $exists: false },
    });
    console.log(deletionResult);

    const { page = 1, limit = 10, isResolved } = req.query;

    const currentPage = parseInt(page, 10);
    const itemsPerPage = parseInt(limit, 10);

    let query = {};

    if (isResolved !== undefined) {
      query.isResolved = isResolved === "true";
    }

    const totalEventIssues = await EventIssue.countDocuments(query);
    const totalPages = Math.ceil(totalEventIssues / itemsPerPage);

    const skip = (currentPage - 1) * itemsPerPage;

    const getAllEventIssues = await EventIssue.find(query)
      .skip(skip)
      .limit(itemsPerPage)
      .populate("event")
      .populate({
        path: "userId",
        select:
          "-passwordResetToken -passwordResetExpires -updatedAt -createdAt -provider_ID -role -provider -password -__v",
      });

    res.json({
      current_page: currentPage,
      total_pages: totalPages,
      total_items: totalEventIssues,
      eventIssues: getAllEventIssues,
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
