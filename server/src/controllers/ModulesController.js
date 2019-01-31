const {Module} = require('../models')

module.exports = {
    async index (req, res) {
    try {
        const module = await Module.findAll()
        res.send(module)
    } catch (err) {
        res.status(500).send({
            error: 'Could not get modules'
        })
    }
}
}

