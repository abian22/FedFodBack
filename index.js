const dotenv = require("dotenv").config();
const User = require("./src/models/user.model.js");

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const { google } = require("googleapis");
const MongoStore = require("connect-mongo");
const http = require('http');
const socketIo = require('socket.io');
const NodeMediaServer = require ("node-media-server")

async function startExpress() {
  const app = express();
  const server = http.createServer(app);
  const io = require('socket.io')(server, {
    cors: {
      origin: [
        "http://feedfoodback.onrender.com",
        "http://localhost:5173",
        "https://lighthearted-muffin-287c32.netlify.app",
        "https://feedfood.onrender.com"
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "token"],
    }
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
        "https://feedfood.onrender.com"
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "token"],
    })
  );
  
  app.use(express.json());
  app.use("/api", require("./src/routes/index"));
  app.use(morgan("dev"));

  io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
  
    const videoStream = iniciarTransmisionDeVideo();

    videoStream.on('data', (videoFragment) => {
        socket.emit('streamData', videoFragment); 
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
        detenerTransmisionDeVideo(videoStream); 
    });
  });

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
  });
  console.log("MongoDB connected....");

  server.listen(process.env.PORT, () => {
    console.log(`On port ${process.env.PORT} !!!`);
  });

  const config = {
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60,
    },
    http: {
      port: 8000,
      allow_origin: '*',
      host: ['3.75.158.163', '3.125.183.140', '35.157.117.28']
    },
  };

  const nms = new NodeMediaServer(config);
  nms.on('prePublish', (id, StreamPath, args) => {
    // Obtener el ID del usuario logeado desde res.locals
    const userId = res.locals.user.id;
  
    // Generar el nombre único del archivo de streaming utilizando el ID del usuario
    const streamFileName = `stream_${userId}.m3u8`;
  
    // Establecer el nombre único del archivo de streaming
    args.streamPath = streamFileName;
  });
  nms.run();
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
        console.log("Google authentication successful:", profile);

        return done(null, newUser);
      } catch (error) {
        console.error("Error in Google authentication:", error);
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
