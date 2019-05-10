const {Schedules, Modules} = require('../models')
const _ = require('lodash')
const Sequelize = require('sequelize')
const config = require('../config/config')
const db = {}
const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    config.db.options
)
module.exports = {
    async index(req, res) {
        let schedules = []
        try {
            await sequelize.query("SELECT * FROM schedules \n" +
                "INNER JOIN modules ON modules.moduleCode = schedules.modulecode \n" +
                "INNER JOIN usermodules  ON usermodules.moduleid = modules.id AND usermodules.userid = 1",
                { type: sequelize.QueryTypes.SELECT})
                .then(modules => {
                    // We don't need spread here, since only the results will be returned for select queries
                    console.log('hey   -----------------    ', modules)
                    schedules = modules
                })
            res.send(schedules)
        } catch (err) {
            res.status(500).send({
                error: 'Could not get schedules'
            })
        }
    }

}
