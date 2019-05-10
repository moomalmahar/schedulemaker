const {UserModules, Modules} = require('../models')
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
let clashes = []
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
            console.log(req.body.ModuleId)
            let prevschedules = []
            let newschedules = []


            // TODO: get all schedules of user previous added modules
            await sequelize.query("select schedules.moduleCode as \"modulescode\",\n" +
                " schedules.moduleTitle as \"modulestitle\",\n" +
                " DATE_FORMAT(schedules.moduleStart, '%Y-%m-%d %T.%f')  as \"modulesstart\",\t\n" +
                " DATE_FORMAT(schedules.moduleEnd, '%Y-%m-%d %T.%f')  as \"modulesend\" \n" +
                "from modules inner join usermodules on modules.id = usermodules.moduleid and usermodules.UserId = 1\n" +
                "inner join schedules on modules.moduleCode = schedules.moduleCode",
                {type: sequelize.QueryTypes.SELECT})
                .then(modules => {
                    prevschedules = modules
                })

            // TODO: get all schedules of new added modules
            await sequelize.query("select \tDATE_FORMAT(schedules.moduleStart, '%Y-%m-%d %T.%f') as 'start', " +
                "\tDATE_FORMAT(schedules.moduleEnd,  '%Y-%m-%d %T.%f') as 'end', schedules.moduleCode as modulescode from schedules\n" +
                "inner join modules on modules.moduleCode = schedules.moduleCode where modules.id = :id",
                {replacements: {id: req.body.ModuleId}, type: sequelize.QueryTypes.SELECT})
                .then(modules => {
                    newschedules = modules
                })

            for (let i = 0; i < newschedules.length; i++) {
                for (let j = 0; j < prevschedules.length; j++) {
                    // check > from && check < to
                    //   console.log('i: ', i, 'j: ', j)
                    if ((newschedules[i].start >= prevschedules[j].modulesstart && newschedules[i].start <= prevschedules[j].modulesend)
                        || (newschedules[i].end >= prevschedules[j].modulesstart && newschedules[i].end <= prevschedules[j].modulesend)) {
                        clashes.push({
                            clashwith: newschedules[i].modulescode,
                            title: prevschedules[j].modulestitle,
                            code: prevschedules[j].modulescode,
                            start: prevschedules[j].modulesstart
                        })
                        console.log('--------------------------- clash ------------------------------ ')
                    }
                }
            }

            const module = await UserModules.create(req.body)
            res.send(clashes)
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
            const getmodule = await Modules.findOne({
                where: {
                    id: ModuleId
                }
            })
            if (!module) {
                return res.status(403).send({
                    error: 'you do not have access to this module'
                })
            }
            let tempclashes = []
            for (let i = 0; i < clashes.length; i++) {
                if ((clashes[i].code === getmodule.moduleCode) || (clashes[i].clashwith === getmodule.moduleCode)) {
                } else {
                    tempclashes.push(clashes[i])
                }
            }
            clashes = tempclashes
            await module.destroy()
            res.send(clashes)
        } catch (err) {
            res.status(500).send({
                error: 'an error has occurred trying to delete the module from your courses'
            })
        }
    }

}
