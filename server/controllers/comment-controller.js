const Article = require('mongoose').model('Article')
const Comment = require('mongoose').model('Comment')

module.exports = {
  addPost: (req, res) => {
    let articleId = req.params.id
    let userId = req.user._id
    let reqComment = req.body
    console.log(reqComment)
    let articleObj = {
      article: articleId,
      comment: reqComment.content,
      author: userId
    }
    Comment.create(articleObj)
      .then(comment => {
        Article
          .findById(articleId)
          .then(article => {
            article.comments.push(comment._id)
            article
              .save()
              .then(() => {
                res.redirect(`/article/details/${articleId}`)
              })
          })
      })
  },
  editGet: (req, res) => {
    let id = req.params.id

    Comment.findById(id)
      .populate('author')
      .populate('article')
      .then(comment => {
        if (!req.user.isInRole('Admin') && !req.user.isAuthor(comment.article)) {
          res.redirect(`/article/details/${comment.article.id}`)
        } else {
          res.render('comment/edit', {
            comment: comment
          })
        }
      })
  },
  editPost: (req, res) => {

  },
  deleteGet: (req, res) => {

  },
  deletePost: (req, res) => {

  }
}
