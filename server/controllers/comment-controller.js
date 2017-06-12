const Article = require('mongoose').model('Article')
const Comment = require('mongoose').model('Comment')

module.exports = {
  addPost: (req, res) => {
    let articleId = req.params.id
    let userId = req.user._id
    let reqComment = req.body
    let articleObj = {
      article: articleId,
      comment: reqComment.comment,
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
    let id = req.params.id
    let reqComment = req.body
    Comment.findById(id)
      .populate('author')
      .then(comment => {
        if (!req.user.isInRole('Admin') && !req.user.isAuthor(comment.article)) {
          res.redirect('/users/login')
        } else {
          comment.comment = reqComment.comment
          comment
            .save()
            .then(() => {
              res.redirect(`/article/details/${comment.article}`)
            })
        }
      })
  },
  deleteGet: (req, res) => {
    let id = req.params.id

    Comment.findById(id)
      .populate('author')
      .populate('article')
      .then(comment => {
        res.render('comment/delete', {
          comment: comment
        })
      })
  },
  deletePost: (req, res) => {
    let id = req.params.id
    Comment.findByIdAndRemove(id)
      .then(comment => {
        Article.findByIdAndUpdate(comment.article, {
          $pull: {'comments': {id: comment._id}}
        })
        .then(article => {
          res.redirect(`/article/details/${article._id}`)
        })
      })
  }
}
