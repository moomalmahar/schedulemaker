const ModulesController = require('./controllers/ModulesController')

module.exports = (app) => {
  app.get('/modules', ModulesController.index)
}
