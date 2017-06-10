const encryption = require('../utilities/encryption')
// const User = require('mongoose').model('User')
const User = require('../models/User')
// const Role = require('mongoose').model('Role')
const Role = require('../models/Role')

module.exports = {
  registerGet: (req, res) => {
    res.render('users/register')
  },

  registerPost: (req, res) => {
    let reqUser = req.body
    // Add validations!

    User.findOne({email: reqUser.email})
      .then(user => {
        let errorMsg = ''
        if (user) {
          errorMsg = 'User with same username exists!'
        } else if (reqUser.password !== reqUser.repeatedPassword) {
          errorMsg = 'Password do not match!'
        }

        if (errorMsg) {
          // reqUser.error = errorMsg
          res.locals.globalError = errorMsg
          res.render('users/register', reqUser)
          // ??? returm
        } else {
          let salt = encryption.generateSalt()
          let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password)

          let userObject = {
            email: reqUser.email,
            hashedPass: hashedPassword,
            fullName: reqUser.fullName,
            salt: salt
          }

          let roles = []
          Role.findOne({ name: 'User' })
            .then(role => {
              roles.push(role.id)

              userObject.roles = roles
              User.create(userObject)
                .then(user => {
                  role.users.push(user)
                  role.save(err => {
                    if (err) {
                      // reqUser.error = err.message
                      res.locals.globalError = err
                      res.render('users/register', user)
                    } else {
                      req.logIn(user, (err, user) => {
                        if (err) {
                          // reqUser.error = err.message
                          res.locals.globalError = err
                          res.render('users/register', user)
                          // return ???
                        }

                        res.redirect('/')
                      })
                    }
                  })
                })
            })
        }
      })
  },

  loginGet: (req, res) => {
    res.render('users/login')
  },

  loginPost: (req, res) => {
    let reqUser = req.body
    User.findOne({email: reqUser.email})
      .then(user => {
        if (!user) {
          res.locals.globalError = 'Invalid user data!'
          res.render('users/login')
          return
        }

        if (!user.authenticate(reqUser.password)) {
          res.locals.globalError = 'Invalid user data!'
          res.render('users/login')
          return
        }
        // console.log(`1: ${user}`)
        req.logIn(user, (err, user) => {
          if (err) {
            res.locals.globalError = 'Invalid user data!'
            res.render('users/login')
          }

          res.redirect('/')
        })
      })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  }
}
