const mongoose = require('mongoose')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let commentSchema = mongoose.Schema({
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
  comment: { type: String, required: REQUIRED_VALIDATION_MESSAGE },
  author: { type: mongoose.Schema.Types.ObjectId, required: REQUIRED_VALIDATION_MESSAGE, ref: 'User' },
  date: { type: Date, default: Date.now }
})

let Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
