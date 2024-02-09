const FavoriteEvent = require("../models/Favourite");
const User = require("../models/User");

exports.addToFavourite = async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    // Check if the user has any favorite events
    let favorite = await FavoriteEvent.findOne({ user: userId });

    if (!favorite) {
      // If no favorite events exist, create a new favorite entry
      favorite = new FavoriteEvent({ user: userId, events: [eventId] });
    } else {
      // If the user already has favorite events, add the new event to the array
      if (!favorite.events.includes(eventId)) {
        favorite.events.push(eventId);
      } else {
        return res.status(400).json({ message: "Event already in favorites" });
      }
    }

    await favorite.save();

    res
      .status(201)
      .json({ message: "Event added to favorites", favoriteId: favorite._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteFavouriteEvent = async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    await FavoriteEvent.findOneAndUpdate(
      { user: userId },
      { $pull: { events: eventId } }
    );

    res.status(200).json({ message: "Event removed from favorites" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getFavouriteEvent = async (req, res) => {
  try {
    const userId = req.params.userId;

    const favorite = await FavoriteEvent.findOne({ user: userId }).populate("events").populate({
      path: "user",
      select: "-passwordResetToken -passwordResetExpires -updatedAt -createdAt -role -password -__v",
    });

    if (!favorite) {
      return res.status(404).json({ message: "No favorite events found for the user" });
    }

    // Since favorite.events is an array, you can directly operate on it
    const filteredEvents = favorite.events.filter(event => event !== null);

    const idsToRemove = favorite.events
      .filter(event => event === null)
      .map(event => event._id);

    if (idsToRemove.length > 0) {
      await FavoriteEvent.findOneAndUpdate(
        { user: userId },
        { $pull: { events: { $in: idsToRemove } } },
        { new: true } // to return the updated document after update
      );
    }

    res.status(200).json(filteredEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
