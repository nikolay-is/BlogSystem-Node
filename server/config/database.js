const mongoose = require('mongoose')

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
    require('../models/User').seedAdminUser()
    // require Article
  })

  db.on('error', err => console.log(`Database error: ${err}`))
}
