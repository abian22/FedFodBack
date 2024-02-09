// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const jwt = require('jsonwebtoken');
// const User = require('../models/user.model');

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: 'http://localhost:4000/api/google/callback',
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({ googleId: profile.id });

//         if (existingUser) {
//           // Si el usuario ya existe, simplemente devuélvelo
//           return done(null, existingUser);
//         }

//         // Si el usuario no existe, crea uno nuevo
//         const newUser = new User({
//           googleId: profile.id,
//           username: profile.displayName,
//           email: profile.emails[0].value,
//         });

//         await newUser.save();
//         console.log('Google authentication successful:', profile);

//         // Generar un token JWT
//         const token = jwt.sign({ userId: newUser.id }, process.env.SECRET);

//         // Añadir el token al usuario antes de devolverlo
//         newUser.token = token;

//         return done(null, newUser);
//       } catch (error) {
//         console.error('Error in Google authentication:', error);
//         return done(error, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });
