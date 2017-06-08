const controllers = require('../controllers')
// auth

module.exports = (app) => {
  app.get('/', controllers.home.index)
  app.get('/about', controllers.home.about)
}
