const mongoose = require('mongoose')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let articleSchema = mongoose.Schema({
  title: { type: String, required: REQUIRED_VALIDATION_MESSAGE },
  content: { type: String, required: REQUIRED_VALIDATION_MESSAGE },
  author: { type: mongoose.Schema.Types.ObjectId, required: REQUIRED_VALIDATION_MESSAGE, ref: 'User' },
  date: { type: Date, default: Date.now() },
  comments: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' } ]
})

let Article = mongoose.model('Article', articleSchema)

module.exports = Article
