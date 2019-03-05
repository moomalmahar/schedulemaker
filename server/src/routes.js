const ModulesController = require('./controllers/ModulesController')
const UserModulesController = require('./controllers/UserModulesController')
const SchedulesController = require('./controllers/SchedulesController')

module.exports = (app) => {
    app.get('/modules', ModulesController.index)
    app.get('/mymodules', UserModulesController.index)
    app.post('/modules', UserModulesController.post)
    app.delete('/modules/:ModuleId',UserModulesController.remove)
    app.get('/calendar', SchedulesController.index)
}
