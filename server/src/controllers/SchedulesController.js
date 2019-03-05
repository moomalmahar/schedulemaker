const {Schedules, Modules} = require('../models')
const _ = require('lodash')

module.exports = {
    async index(req, res) {
        try {
            const schedules = await Schedules.findAll()
            res.send(schedules)
        } catch (err) {
            res.status(500).send({
                error: 'Could not get modules'
            })
        }
    }

}
