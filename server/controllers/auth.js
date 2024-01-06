const User = require("../models/User");
const Event = require("../models/Event")
const ErrorResponse = require("../utils/errorRes");
const sendEmail = require("../utils/sendEmail");
const validateMongoDbId = require("../utils/validateMongodbId");
// const { generateToken } = require("../config/jwtToken");
const sendToken = require("../utils/jwtToken");
const axios = require('axios');
const cheerio = require('cheerio');

exports.register = async (req, res, next) => {
  const { email, mobile } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });

  if (existingUser) {
    return res
      .status(203)
      .json({ error: "User with this email or mobile number already exists." });
  }

  const userData = {
    email,
    mobile,
    // role: req.body.role,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
  };

  try {
    const newUser = await User.create(userData);
    sendToken(newUser, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide Email and Password", 400));
  }

  try {
    const findUser = await User.findOne({ email }).select("+password");
    // const isPasswordMatch = await bcrypt.compare(password, findUser.password);

    if (findUser && (await findUser.matchPasswords(password))) {
      sendToken(findUser, 201, res);
    } else {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  
  try {
    const findAdmin = await User.findOne({ email }).select("+password");
    
    if (!findAdmin) {
      throw new Error("Admin not found");
    }

    if (findAdmin.role !== "admin") {
      throw new Error("Not Authorized");
    }

    if (await findAdmin.matchPasswords(password)) {
      // const refreshToken = await generateRefreshToken(findAdmin?._id);
      // const updateuser = await User.findByIdAndUpdate(
      //   findAdmin.id,
      //   {
      //     refreshToken: refreshToken,
      //   },
      //   { new: true }
      // );

      // res.cookie("token", generateToken(findAdmin?._id), {
      //   httpOnly: true,
      //   maxAge: 72 * 60 * 60 * 1000,
      //   secure: true,
      // });
      sendToken(findAdmin, 201, res);
      // res.json({
      //   _id: findAdmin?._id,
      //   firstname: findAdmin?.firstname,
      //   lastname: findAdmin?.lastname,
      //   email: findAdmin?.email,
      //   mobile: findAdmin?.mobile,
      //   token: generateToken(findAdmin?._id),
      // });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  // Clear the token cookie
  res.clearCookie('token');

  // Send a response indicating successful logout
  res.status(200).json({ success: true, message: 'Logout successful' });
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json(`${email} this email is not registered`);
    }
    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `http://localhost:3000/user-password-reset/${resetToken}`;

    const message = `
    <!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
        }
        .header {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            background-color: #f5f5f5;
            padding: 10px;
            border-top: 1px solid #e0e0e0;
            border-radius: 0 0 5px 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Hello ${user.firstname},</h2>
        </div>
        <div class="content">
            <p>We have received a request to reset your password for your account on <strong>Event Panel</strong>. If you did not request this change, you can ignore this email and your password will not be changed.</p>
            
            <p>To reset your password, please click on the following link and follow the instructions:</p>
            
            <p><a class="button" href="${resetUrl}">Reset Password</a></p>
            
            <p>This link will expire in <strong>15 minutes</strong> for security reasons. If you need to reset your password after this time, please make another request.</p>
        </div>
        <div class="footer">
            <h3>Thank you,</h3>
            <h3>Event Team </h3>
        </div>
    </div>
</body>
</html>
    `;
    try {
      await sendEmail({
        to: user.email,
        subject: "Account Password Reset Link",
        text: message,
      });
      res.status(200).json({
        success: true,
        data: "Password Reset Email Sent Successfully",
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save();

      return res.status(500).json("Email could not be sent");
    }
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      passwordResetToken: req.params.resetToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    
    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400));
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    res.status(201).json({
      success: true,
      data: "Password Reset Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.updatedUser = async (req, res) => {
  const { _id } = req.user._id;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
};

exports.getallUser = async (req, res) => {
  try {
    const searchQuery = req.query.search;

    const userQuery = User.find();

    if (searchQuery) {
      userQuery.or([
        { firstname: { $regex: new RegExp(searchQuery, "i") } },
        { lastname: { $regex: new RegExp(searchQuery, "i") } },
        { email: { $regex: new RegExp(searchQuery, "i") } },
        { mobile: { $regex: new RegExp(searchQuery, "i") } },
      ]);
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    userQuery.skip(skip).limit(limit);

    const users = await userQuery.exec();

    // Count total items
    const totalItems = await User.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);

    // Check if requested page exists
    if (page > totalPages) {
      throw new Error("This Page does not exist");
    }

    res.json({
      totalItems,
      totalPages,
      currentPage: page,
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getaUser = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const getaUser = await User.findById(_id);
    res.json({
      getaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
};

exports.getUserById = async (req, res) => {
  const { _id } = req.body;
  validateMongoDbId(_id);

  try {
    const user = await User.findById(_id);
    res.status(200).json({
      user,
    });
  } catch (error) {
    throw new Error(error);
  }
};

exports.deleteaUser = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({
      deleteaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { _id } = req.user._id;

    const user = await User.findById(_id).select("+password");
    // Verify the current password
    const isPasswordMatch = await user.matchPasswords(oldPassword);
    if (!isPasswordMatch) {
      return res.status(203).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Password change failed" });
  }
};

exports.fetchEvent = async (req, res) => {
  try {
    
    const apiKey = process.env.TICKETMASTER_API_KEY;

    // Extract start and end dates from query parameters
    const startDateParam = req.query.startDate;
    const endDateParam = req.query.endDate;

    // Validate and parse the dates
    const filterStartDate = new Date(startDateParam);
    const filterEndDate = new Date(endDateParam);

    // Fetch events data
    const response = await axios.get(
      process.env.TICKETMASTER_URL,
      {
        params: {
          apikey: apiKey,
        },
        headers: {
          Accept: "application/json",
          Host: "app.ticketmaster.com",
          "X-Target-URI": "https://app.ticketmaster.com",
          Connection: "Keep-Alive",
        },
      }
    );

    const events = response.data._embedded.events;

    // Filter events based on Start and End Dates
    const filteredEvents = events.filter((event) => {
      const eventStartDate = new Date(event.dates.start.dateTime);
      const eventEndDate = new Date(event.sales.public.endDateTime);

      return eventStartDate >= filterStartDate && eventEndDate <= filterEndDate;
    });

    // Process and save each filtered event to the database
    for (const event of filteredEvents) {
      // Check if the event with the same name already exists
      const existingEvent = await Event.findOne({ name: event.name });

      if (!existingEvent) {
        // Extract relevant venue information
        const venueInfo = {
          country: event._embedded.venues[0].country.name,
          city: event._embedded.venues[0].city.name,
          address: event._embedded.venues[0].address.line1,
          location: event._embedded.venues[0].name,
          latitude: event._embedded.venues[0].location.latitude,
          longitude: event._embedded.venues[0].location.longitude,
        };

        // Extract relevant event information
        const eventData = {
          name: event.name,
          description: event.info,
          startDate: event.dates.start.dateTime,
          endDate: event.sales.public.endDateTime,
          // image: event.images[0].url,
          images: event.images.map((image) => ({ url: image.url })),
          price: 0,
          resource_url: event.url,
          ...venueInfo,
        };

        // Save the event to the database
        await Event.create(eventData);
      }
    }

    res.status(200).json({ message: "Filtered events saved successfully." });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};


// if (req.body?.address && req.body?.address != "") {
//   await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.body?.address}&key=${REACT_APP_GOOGLE_MAP}`).then((res) => {
//     // console.log(res.data.results[0].geometry.location);
//     if (res.data.status === "OK") {

//       req.body.google_geo_location = res.data.results[0].geometry.location
//     } else {
//       // console.log(res.data);
//     }

//   }).catch((e) => {
//     console.log(e);
//   })
// }