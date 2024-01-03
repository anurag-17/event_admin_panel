require("dotenv").config({ path: "./.env" });
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const passport = require('passport');
const User = require("./models/User");
const OAuth2Strategy = require('passport-google-oauth20').Strategy;

// Connect Database
connectDB();

const app = express();

const corsOptions = {
  origin: [
  "http://localhost:3000",
  "*"
],
  credentials: true, 
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(cookieParser('secret'));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// setuppassport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:"/auth/google/callback",
      scope:["profile","email"]
  },
  async(accessToken,refreshToken,profile,done)=>{

      try {
          let user = await User.findOne({email: profile.emails[0].value});

          if(!user){
              user = new User({
                // googleId: profile.id,
                //   displayName: profile.displayName,
                  firstname: profile.name.givenName,
                  lastname: profile.name.familyName,
                //   image: profile.photos[0].value,
                  email: profile.emails[0].value
              });

              await user.save();
          }

          return done(null,user)
      } catch (error) {
          return done(error,null)
      }
  }
  )
)

passport.serializeUser((user,done)=>{
  done(null,user);
})

passport.deserializeUser((user,done)=>{
  done(null,user);
});

// initial google ouath login
app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}));

app.get("/auth/google/callback",passport.authenticate("google",{
  successRedirect:"http://localhost:3000/admin/admin-dashboard",
  failureRedirect:"http://localhost:3000/login"
}));

app.get("/login/sucess",async(req,res)=>{

  if(req.user){
      res.status(200).json({message:"user Login",user:req.user})
  }else{
      res.status(400).json({message:"Not Authorized"})
  }
})

app.get("/logout",(req,res,next)=>{
  req.logout(function(err){
      if(err){return next(err)}
      res.redirect("http://localhost:3000");
  })
})

// Backend API is Running Msg 
app.get("/", (req, res) => {
  res.send("API is running..");
});

// Auth and User 
app.use("/api/auth", require("./routes/auth"));

// Category
app.use("/api/category", require("./routes/category"));

// Sub Category
app.use("/api/subCategory", require("./routes/subCategory"));

// Events
app.use("/api/event", require("./routes/event"));

app.use("/api/auth/upload", require("./routes/auth"));

// Error Handler 
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
// DB error handler
process.on("unhandledRejection", (err, promise) => {
  console.log(`Log Error: ${err}`);
  server.close(() => process.exit(1));
});
