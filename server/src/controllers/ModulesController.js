const {Modules} = require('../models')
const _ = require('lodash')

module.exports = {
    async index (req, res) {
        try {
            const modules = await Modules.findAll()
            res.send(modules)
        } catch (err) {
            res.status(500).send({
                error: 'Could not get modules'
            })
        }
    },
    async post (req, res) {
        try {
            const module = await Modules.create(req.body)
            res.send(module)
        } catch (err) {
            res.status(500).send({
                error: "Couldn't create song"
            })
        }
    }

}
