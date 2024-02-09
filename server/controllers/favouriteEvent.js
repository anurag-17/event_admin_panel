const FavoriteEvent = require("../models/Favourite");
const User = require("../models/User");

exports.addToFavourite = async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    let favorite = await FavoriteEvent.findOne({ user: userId });

    if (!favorite) {
      
      favorite = new FavoriteEvent({ user: userId, events: [eventId] });
    } else {
      
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

    const filteredEvents = favorite.events.filter(event => event !== null);

    const idsToRemove = favorite.events
      .filter(event => event === null)
      .map(event => event._id);

    if (idsToRemove.length > 0) {
      await FavoriteEvent.findOneAndUpdate(
        { user: userId },
        { $pull: { events: { $in: idsToRemove } } },
        { new: true }
      );
    }

    const responseData = {
      user: {
        ...favorite.user.toObject(), 
        events: filteredEvents
      }
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
