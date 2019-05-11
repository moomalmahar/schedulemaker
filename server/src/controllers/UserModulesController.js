let moment = require('moment');

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
let locactionclashes = []
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
            let prevschedules = []
            let newschedules = []


            // TODO: get all schedules of user previous added modules
            await sequelize.query("select schedules.moduleCode as 'modulescode',\n" +
                " schedules.moduleTitle as 'modulestitle',\n" +
                " DATE_FORMAT(schedules.moduleStart, '%Y-%m-%d %T.%f')  as 'modulesstart',\n" +
                " DATE_FORMAT(schedules.moduleEnd, '%Y-%m-%d %T.%f')  as 'modulesend',\n" +
                "schedules.moduleUniversity as 'moduleuni'" +
                "from modules inner join usermodules on modules.id = usermodules.moduleid and usermodules.UserId = 1\n" +
                "inner join schedules on modules.moduleCode = schedules.moduleCode",
                {type: sequelize.QueryTypes.SELECT})
                .then(modules => {
                    prevschedules = modules
                })

            // TODO: get all schedules of new added modules
            await sequelize.query("select \tDATE_FORMAT(schedules.moduleStart, '%Y-%m-%d %T.%f') as 'start', " +
                "\tDATE_FORMAT(schedules.moduleEnd,  '%Y-%m-%d %T.%f') as 'end', schedules.moduleCode as modulescode," +
                "schedules.moduleUniversity as 'moduleuni', schedules.moduleTitle as 'moduletitle' from schedules\n" +
                "inner join modules on modules.moduleCode = schedules.moduleCode where modules.id = :id",
                {replacements: {id: req.body.ModuleId}, type: sequelize.QueryTypes.SELECT})
                .then(modules => {
                    newschedules = modules
                })

            // TODO: for each class time clash
            for (let i = 0; i < newschedules.length; i++) {
                for (let j = 0; j < prevschedules.length; j++) {
                    // check > from && check < to

                    if ((newschedules[i].start >= prevschedules[j].modulesstart && newschedules[i].start <= prevschedules[j].modulesend)
                        || (newschedules[i].end >= prevschedules[j].modulesstart && newschedules[i].end <= prevschedules[j].modulesend)) {
                        clashes.push({
                            clashwith: newschedules[i].modulescode,
                            title: prevschedules[j].modulestitle,
                            code: prevschedules[j].modulescode,
                            start: prevschedules[j].modulesstart
                        })
                    }
                }
            }

            //TODO: getting the location clash/problems
            for (let i = 0; i < newschedules.length; i++) {
                for (let j = 0; j < prevschedules.length; j++) {

                    let newend = moment(new Date(newschedules[i].end), "DD/MM/YYYY").format('DD/MM/YYYY HH:mm:ss')
                    let prevstart = moment(new Date(prevschedules[j].modulesstart), "DD/MM/YYYY").format('DD/MM/YYYY HH:mm:ss')
                    let newstart = moment(new Date(newschedules[i].start), "DD/MM/YYYY").format('DD/MM/YYYY HH:mm:ss')
                    let prevend = moment(new Date(prevschedules[j].modulesend), "DD/MM/YYYY").format('DD/MM/YYYY HH:mm:ss')

                    // -------- for the other way around
                    let nexta = moment(new Date(newschedules[i].end), "DD/MM/YYYY").format('DD/MM/YYYY')
                    let preva = moment(new Date(prevschedules[j].modulesstart), "DD/MM/YYYY").format('DD/MM/YYYY')

                    let timenext = ''

                    if ((prevstart > newend)) {
                        timenext = moment.utc(moment(new Date(prevschedules[j].modulesstart), "DD/MM/YYYY HH:mm:ss")
                            .diff(moment(new Date(newschedules[i].end), "DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
                    }
                    else if(prevend < newstart){
                        timenext = moment.utc(moment(new Date(newschedules[i].start), "DD/MM/YYYY HH:mm:ss")
                            .diff(moment(new Date(  prevschedules[j].modulesend), "DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
                    }

                    let difference = moment.duration(timenext).asMinutes()

                      if ((difference > 0 && difference < 45) && (prevschedules[j].moduleuni !== newschedules[i].moduleuni)
                          && (nexta === preva)) {
                          locactionclashes.push({
                              clashwith: newschedules[i].modulescode,
                              code: prevschedules[j].modulescode,
                              moduletitle: prevschedules[j].modulestitle,
                              departure: prevschedules[j].moduleuni,
                              destination: newschedules[i].moduleuni,
                              prevclasstime: prevschedules[j].modulesend,
                              nextclassstart: newschedules[i].start,
                              timedifference: difference,
                              clashmodule: newschedules[i].moduletitle
                          })
                      }
                }
            }
            await UserModules.create(req.body)
            res.send({
                clashes: clashes,
                locationclashes: locactionclashes
            })
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
            let templocactionclashes = []
            for (let i = 0; i < clashes.length; i++) {
                if ((clashes[i].code === getmodule.moduleCode) || (clashes[i].clashwith === getmodule.moduleCode)) {
                } else {
                    tempclashes.push(clashes[i])
                }
            }

            for (let i = 0; i < locactionclashes.length; i++) {
                if ((locactionclashes[i].code === getmodule.moduleCode) || (locactionclashes[i].clashwith === getmodule.moduleCode)) {
                } else {
                    templocactionclashes.push(locactionclashes[i])
                }
            }


            clashes = tempclashes
            locactionclashes = templocactionclashes
            await module.destroy()
            res.send({
                clashes: clashes,
                locationclashes: locactionclashes
            })
        } catch (err) {
            res.status(500).send({
                error: 'an error has occurred trying to delete the module from your courses'
            })
        }
    }

}
