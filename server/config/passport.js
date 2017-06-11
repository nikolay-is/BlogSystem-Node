const passport = require('passport')
const LocalPassport = require('passport-local')
// const LocalStrategy = require('passport-local').Strategy
const User = require('mongoose').model('User')
// const User = require('../models/User')

// const authenticateUser = (username, password, done) => {
//   console.log(`username: ${username}`)
//   User.findOne({email: username}).then(user => {
//     if (!user) {
//       return done(null, false)
//     }

//     if (!user.authenticate(password)) {
//       return done(null, false)
//     }
//     console.log(user)
//     return done(null, user)
//   })
// }

module.exports = () => {
  // passport.use(new LocalStrategy({
  //   usernameField: 'email',
  //   passwordField: 'password'
  // }, authenticateUser))

  // passport.use(new LocalStrategy({
  //   usernameField: 'email',
  //   passwordField: 'password',
  //   session: false
  // }, // authenticateUser
  // function (username, password, done) {
  //   console.log(`username: ${username}`)
  //   User.findOne({email: username}).then(user => {
  //     if (!user) {
  //       return done(null, false)
  //     }

  //     if (!user.authenticate(password)) {
  //       return done(null, false)
  //     }
  //     console.log(user)
  //     return done(null, user)
  //   })
  // }
  // ))

  passport.use(new LocalPassport((
    username, password, done) => {
    User.findOne({ username: username })
      .then(user => {
        if (!user) return done(null, false)
        if (!user.authenticate(password)) return done(null, false)
        return done(null, user)
      })
  }))

  passport.serializeUser((user, done) => {
    if (user) return done(null, user._id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => {
        if (!user) return done(null, false)
        return done(null, user)
      })
  })
}
