const dotenv = require("dotenv").config()
const User = require ("./src/models/user.model.js")

const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
const cors = require("cors")
const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20")
const { google } = require('googleapis');
const drive = google.drive('v3');


function startExpress() {
  const app = express()
  app.use(require('express-session')({ 
    secret: 'Enter your secret key',
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(
    cors({
      origin: "http://localhost:4000",
      // origin: "https://feedfoodback.onrender.com",
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  )

  app.use(express.json())
  app.use("/api", require("./src/routes/index"))
  app.use(morgan("dev"))

  mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    })
    .then(() => {
      console.log("MongoDB connected....")
    })
    .catch((err) => console.log(err.message))

  app.listen(process.env.PORT, () => {
    console.log(`On port ${process.env.PORT} !!!`)
  })
}

const driveAuth = new google.auth.GoogleAuth({
  // keyFile: './feedFoodDrive.json',
  scopes: 'https://www.googleapis.com/auth/drive.file',
});

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"http://localhost:4000/api/google/callback",
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ googleId: profile.id });
  
      if (existingUser) {
        return done(null, existingUser);
      }
  
      const newUser = new User({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value
      });
  
      await newUser.save();
      console.log('Google authentication successful:', profile);

      return done(null, newUser);
    } catch (error) {
      console.error('Error in Google authentication:', error);
      return done(error, null);
    }
  }));
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  

async function start() {
  await startExpress()
}

start()
