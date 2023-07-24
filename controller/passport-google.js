const { Router } = require('express')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const express = require('express');
const session = require('express-session');
const rutaGoogle = Router()
const {usuario} = require('../db')
const axios = require('axios')


// Configuración de express-session
rutaGoogle.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
  }));
  
  // Inicialización de Passport.js
  rutaGoogle.use(passport.initialize());
  rutaGoogle.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user.id); // Utiliza un identificador único del usuario, como el ID de la base de datos
  });

  passport.deserializeUser((id, done) => {
    // Aquí puedes obtener el usuario correspondiente al identificador desde tu base de datos
    usuario.findOne( {where: {googleId : id}}, (err, user) => {
      done(err, user);
    });
  });


// Configuración de Passport para la estrategia de Google
passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:3001/auth/google/callback',
        scope: ['profile', 'email'] 
      },
      async (accessToken, refreshToken, profile, done) => {
        // Aquí puedes guardar el perfil del usuario en tu base de datos o realizar otras acciones.
        // En este ejemplo, simplemente pasamos el perfil al callback done().
        let encontrarUsuario = await usuario.findOne({where: {email: profile.emails[0].value}})
        if(!encontrarUsuario){
            encontrarUsuario = await axios.post('http://localhost:3001/usuarios/signup', 
            {
                email: profile.emails[0].value, 
                nombre: profile.name.givenName, 
                apellido: profile.name.familyName,
                foto: profile._json.picture
            })
        }
        return done(null, encontrarUsuario);
      }
    )
  );

  // Configuración de rutas
  rutaGoogle.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
  
  rutaGoogle.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      // Aquí puedes redirigir o realizar cualquier acción después de la autenticación exitosa.
      res.send(req.user.dataValues.id)
    }
  );

module.exports = rutaGoogle