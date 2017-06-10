const mongoose = require('mongoose')

// const Role = require('../models/Role')
// const User = require('../models/User')

mongoose.Promise = global.Promise

module.exports = (config) => {
  mongoose.connect(config.dbStr)

  let db = mongoose.connection

  db.once('open', err => {
    if (err) {
      throw err
    }

    console.log(`MongoDB connected to "${config.dbName}" database on port: ${config.dbPort}`)

    // Add seedData here
    require('../models/Role').initialize()
    // Role.initialize()
    require('../models/User').seedAdminUser()
    // User.seedAdminUser()
    // require Article
  })

  db.on('error', err => console.log(`Database error: ${err}`))
}
