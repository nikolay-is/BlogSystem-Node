const Article = require('mongoose').model('Article')
const Comment = require('mongoose').model('Comment')

module.exports = {
  addGet: (req, res) => {
    res.render('article/add')
  },

  addPost: (req, res) => {
    let reqArticle = req.body
    reqArticle.author = req.user._id

    Article.create({
      title: reqArticle.title,
      content: reqArticle.comment,
      author: reqArticle.author
    })
    .then(() => {
      res.redirect('/article/list')
    })
    .catch((err) => {
      res.locals.globalError = err
      res.render('article/add', reqArticle)
    })
  },

  list: (req, res) => {
    let pagesSize = 2
    let page = Number(req.query.page) || 1
    let search = req.query.search

    let query = Article.find()

    if (search) {
      query = query.where('title').regex(new RegExp(search, 'i'))
    }

    query
      .populate('author')
      .sort('date')
      .skip((page - 1) * pagesSize)
      .limit(pagesSize)
      .then(articles => {
        let articlesObj = {
          articles: articles,
          hasPrevPage: page > 1,
          hasNextPage: articles.length === pagesSize, // == nn
          prevPage: page - 1,
          nextPage: page + 1,
          search: search
        }
        res.render('articles/list', articlesObj)
      })
  },

  details: (req, res) => {
    let id = req.params.id
    if (req.user) {
      Article
      .findById(id)
      .populate('author')
      .then(article => {
        Comment.find({article: article._id})
          .populate('author')
          .sort('date')
          .then(comment => {
            res.render('article/details', {
              article: article,
              comments: comment
            })
          .catch(err => {
            res.locals.globalError = err
            res.redirect('/artile/list')
          })
          })
      })
    } else {
      res.redirect('/users/login')
    }
  },

  editGet: (req, res) => {
    let id = req.params.id

    Article.findById(id)
      .populate('author')
      .then(article => {
        req.user.isInRole('Admin').then(isAdmin => {
          if (!isAdmin && !req.iser.isAuthor(article)) {
            res.redirect('/users/login')
          }

          res.render('article/edit', {
            article: {
              title: article.title,
              content: article.comment
            }
          })
        })
      }).catch(err => {
        res.locals.globalError = err
        res.render('article/list')
      })
  },

  editPost: (req, res) => {
    let id = req.params.id
    let reqArticle = req.body

    Article.findById(id)
      .populate('author')
      .then(article => {
        if (!req.user.isInRole('Admin') && !req.iser.isAuthor(article)) {
          res.redirect('/users/login')
        }
        article.title = reqArticle.title
        article.content = reqArticle.content
        article.save()
          .then(() => {
            res.redirect(`/article/details/${article._id}`)
          })
      }).catch(err => {
        res.locals.globalError = err
        res.render('article/list')
      })
  },
  deleteGet: (req, res) => {
    let id = req.params.id

    Article.findById(id)
      .then(article => {
        res.render('article/delete')
      })
  },

  deletePost: (req, res) => {
    let id = req.params.id
    Article.findByIdAndRemove(id)
      .then(article => {
        Comment.remove({article: article._id})
          .then(() => {
            res.redirect('article/list')
          })
      })
      .catch(err => {
        res.locals.globalError = err
        res.redirect(`article/details/${id}`)
      })
  }
}
