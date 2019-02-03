const ModulesController = require('./controllers/ModulesController')

module.exports = (app) => {
    app.get('/modules', ModulesController.index)
    app.post('/modules', ModulesController.post)
}
