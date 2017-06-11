const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')

module.exports = (app) => {
  app.engine('handlebars', handlebars({
    defaultLayout: 'main'
  }))
  app.set('view engine', 'handlebars')

  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(session({
    secret: 'nesto_tainichko%$#@!~',
    resave: false,
    saveUninitialized: false
  }))

  app.use(passport.initialize())
  app.use(passport.session())

  app.use((req, res, next) => {
    if (req.user) {
      res.locals.currentUser = req.user

      res.locals.currentUser.isInRole('Admin')
      .then(isAdmin => {
        res.locals.isAdmin = isAdmin
      })
    }

    next()
  })

  app.use(express.static('public'))

  console.log('Express ready!')
}
