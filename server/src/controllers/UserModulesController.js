const {UserModules, Modules} = require('../models')
const _ = require('lodash')

module.exports = {
    async index(req, res) {
        try {
            const modules = await UserModules.findAll({
                where: {
                    UserId: 1
                },
                include: [
                    {
                        model: Modules
                    }
                ]
            })
                .map(module => module.toJSON())
                .map(module => _.extend(
                    {},
                    module.Module
                ))
            res.send(modules)
        } catch (err) {
            res.status(500).send({
                error: 'Could not get modules'
            })
        }
    },
    async post(req, res) {
        try {
            const module = await UserModules.create(req.body)
            res.send(module)
        } catch (err) {
            res.send({
                error: err
            })
        }
    },
    async remove(req, res) {
        try {
            const {ModuleId} = req.params
            const module = await UserModules.findOne({
                where: {
                    ModuleId: ModuleId,
                    UserId: 1
                }
            })
            if (!module) {
                return res.status(403).send({
                    error: 'you do not have access to this module'
                })
            }
            await module.destroy()
            res.send(module)
        } catch (err) {
            res.status(500).send({
                error: 'an error has occurred trying to delete the module from your courses'
            })
        }
    }

}
