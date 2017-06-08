const mongoose = require('mongoose')
const Role = mongoose.model('Role')
const encryption = require('../utilities/encryption')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  hashedPass: { type: String },
  fullName: { type: String, required: true },
  articles: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Article' } ],
  roles: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Role' } ],
  salt: { type: String, required: true }
})

userSchema.method({
  authenticate: function (password) {
    return encryption.generateHashedPassword(this.salt, password) === this.hashedPass
  }
  // ,
  // isAuthor: function(article) {
  //   if (!article) {
  //     return false
  //   }
  //   let isAuthor = article.author.equals(this.id)

  //   return isAuthor
  // },
  // isInRole: function (roleName) {
  //   return Role.findOne({ name: roleName})
  //     .then(role => {
  //       if (!role) {
  //         return false
  //       }

  //       let isInRole = this.roles.indexOf(role.id) !== -1
  //       return isInRole
  //     })
  // }
})

let User = mongoose.model('User', userSchema)

module.exports = User

module.exports.seedAdminUser = () => {
  User.find({})
    .then(users => {
      if (users.lenght > 0) return 

      Role.findOne({name: 'Admin'})
        .then(role => {
          let salt = encryption.generateSalt()
          let hashedPass = encryption.generateHashedPassword(salt, '123456')

          let roles = []
          roles.push(role.id)

          User.create({
            email: 'admin@admin.com',
            hashedPass: hashedPass,
            fullName: 'Admin',
            articles: [],
            roles: roles,
            salt: salt
          })
          .then(user => {
            role.users.push(user.id)
            role.save(err => {
              if (err) {
                console.log(err.message)
              } else {
                console.log('Admin seeded successfully!')
              }
            })
          })
        })
    })
}
