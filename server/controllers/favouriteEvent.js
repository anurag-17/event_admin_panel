const FavoriteEvent = require("../models/Favourite");
const User = require("../models/User");

exports.addToFavourite = async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    const existingFavorite = await FavoriteEvent.findOne({
      user: userId,
      event: eventId,
    });

    if (existingFavorite) {
      return res.status(400).json({ message: "Event already in favorites" });
    }

    const favorite = new FavoriteEvent({ user: userId, event: eventId });
    await favorite.save();

    await User.findByIdAndUpdate(userId, {
      $push: { favoriteEvents: favorite._id },
    });

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

    await FavoriteEvent.findOneAndDelete({ user: userId, event: eventId });

    await User.findByIdAndUpdate(userId, {
      $pull: { favoriteEvents: eventId },
    });

    res.status(200).json({ message: "Event removed from favorites" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getFavouriteEvent = async (req, res) => {
  try {
    const userId = req.params.userId;

    const favoriteEvents = await FavoriteEvent.find({ user: userId })
      .populate("event")
      .populate({
        path: "user",
        select:
          "-passwordResetToken -passwordResetExpires -updatedAt -createdAt -role -password -__v",
      });

    const filteredFavorites = favoriteEvents.filter(
      (fav) => fav.event !== null
    );

    const idsToRemove = favoriteEvents
      .filter((fav) => fav.event === null)
      .map((fav) => fav._id);

    if (idsToRemove.length > 0) {
      await FavoriteEvent.deleteMany({ _id: { $in: idsToRemove } });
    }

    res.status(200).json(filteredFavorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
