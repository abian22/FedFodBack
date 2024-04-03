const dotenv = require("dotenv").config();
const User = require("./src/models/user.model.js");

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const http = require("http");
const { Server } = require("socket.io");
const GoogleStrategy = require("passport-google-oauth20");
const { google } = require("googleapis");
const MongoStore = require("connect-mongo");
// const fileUpload = require("express-fileupload")
const drive = google.drive("v3");

function startExpress() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server,{
    cors: {
      origin: ["http://localhost:4000", "http://localhost:5173"],
    },
  });

  app.use(
    require("express-session")({
      secret: "Enter your secret key",
      resave: true,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
      }),
    })
  );
  app.use(passport.initialize());
  app.use(
    cors({
      origin: [
        "http://feedfoodback.onrender.com",
        "http://localhost:5173",
        "https://lighthearted-muffin-287c32.netlify.app",
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      // optionsSuccessStatus: 204,
      // credentials: true,
      allowedHeaders: ["Content-Type", "token"],
    })
  );

  app.use(express.json());
  app.use("/api", require("./src/routes/index"));
  app.use(morgan("dev"));

  mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    })
    .then(() => {
      console.log("MongoDB connected....");
    })
    .catch((err) => console.log(err.message));
    io.on("connection", (socket) => {
      console.log("Nuevo socket conectado:", socket.id);
  
      socket.on("message", (message) => {
        console.log("Message received:", message);
        io.emit("message", message);
      });
  
      socket.on("disconnect", () => {
        console.log("Socket desconectado:", socket.id);
      });
    });


  server.listen(process.env.PORT, () => {
    console.log(`En el puerto ${process.env.PORT} !!!`);
  });
}

const driveAuth = new google.auth.GoogleAuth({
  // keyFile: './feedFoodDrive.json',
  scopes: "https://www.googleapis.com/auth/drive.file",
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://feedfoodback.onrender.com/api/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
        });

        await newUser.save();
        console.log("Autenticación de Google exitosa:", profile);

        return done(null, newUser);
      } catch (error) {
        console.error("Error en la autenticación de Google:", error);
        return done(error, null);
      }
    }
  )
);

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
  await startExpress();
}

start();
