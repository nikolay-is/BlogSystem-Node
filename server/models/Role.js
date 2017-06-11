const mongoose = require('mongoose')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let roleSchema = mongoose.Schema({
  name: { type: String, required: REQUIRED_VALIDATION_MESSAGE, unique: true },
  users: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ]
})

let Role = mongoose.model('Role', roleSchema)

module.exports = Role

module.exports.initialize = () => {
  Role.findOne({ name: 'Admin' })
    .then(role => {
      if (!role) {
        Role.create({name: 'Admin'})
      }
    })

  Role.findOne({name: 'User'})
    .then(role => {
      if (!role) {
        Role.create({name: 'User'})
      }
    })
}
