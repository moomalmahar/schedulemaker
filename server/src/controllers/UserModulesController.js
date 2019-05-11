let moment = require('moment');

const {UserModules, Modules, ClassClashes, LocationClashes} = require('../models')
const _ = require('lodash')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
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
        let getclassclashes = []
        let getlocationclashes = []
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


            // TODO: ---------- getting class clashes from database
            let tempgetclassclashes = await ClassClashes.findAll({
                where: {
                    UserId: 1
                }
            })

            // TODO: ---------- getting location clashes from database
            let tempgetlocationclashes = await LocationClashes.findAll({
                where: {
                    UserId: 1
                }
            })



            for (let i = 0; i < tempgetclassclashes.length; i++) {
                getclassclashes.push({
                    clashWithStart: moment(tempgetclassclashes[i].clashWithStart).format('MMMM Do YYYY') + ', '
                    + moment(tempgetclassclashes[i].clashWithStart).format('HH:mm'),
                    clashWithCode: tempgetclassclashes[i].clashWithCode,
                    clashWithTitle: tempgetclassclashes[i].clashWithTitle,
                    moduleStart: moment(tempgetclassclashes[i].moduleStart).format('MMMM Do YYYY') + ', '
                        + moment(tempgetclassclashes[i].moduleStart).format('HH:mm'),
                    moduleTitle: tempgetclassclashes[i].moduleTitle,
                    moduleCode: tempgetclassclashes[i].moduleCode
                })
            }

           for (let i = 0; i < tempgetlocationclashes.length; i++) {
                getlocationclashes.push({
                    clashWithStart: moment(tempgetlocationclashes[i].clashWithStart).format('MMMM Do YYYY') + ', '
                        + moment(tempgetlocationclashes[i].clashWithStart).format('HH:mm'),
                    clashWithCode: tempgetlocationclashes[i].clashWithCode,
                    clashWithTitle: tempgetlocationclashes[i].clashWithTitle,
                    moduleClashEnd: moment(tempgetlocationclashes[i].moduleClashEnd).format('MMMM Do YYYY') + ', '
                        + moment(tempgetlocationclashes[i].moduleClashEnd).format('HH:mm'),
                    moduleTitle: tempgetlocationclashes[i].moduleTitle,
                    moduleCode: tempgetlocationclashes[i].moduleCode,
                    departureUniversity: tempgetlocationclashes[i].departureUniversity,
                    destinationUniversity: tempgetlocationclashes[i].destinationUniversity,
                    timeDifference: tempgetlocationclashes[i].timeDifference
                })
            }

            res.send({
                modules: modules,
                clashes: getclassclashes,
                locationclashes: getlocationclashes
            })
        } catch (err) {
            res.status(500).send({
                error: 'Could not get modules'
            })
        }
    },
    async post(req, res) {
        let clashes = []
        let locactionclashes = []
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
                            clashWithStart: newschedules[i].start,
                            clashWithCode: newschedules[i].modulescode,
                            clashWithTitle: newschedules[i].moduletitle,
                            moduleTitle: prevschedules[j].modulestitle,
                            moduleCode: prevschedules[j].modulescode,
                            moduleStart: prevschedules[j].modulesstart,
                            UserId: 1
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
                    let nexta = moment(new Date(newschedules[i].end), "DD/MM/YYYY").format('DD/MM/YYYY')
                    let preva = moment(new Date(prevschedules[j].modulesstart), "DD/MM/YYYY").format('DD/MM/YYYY')

                    let timenext = ''

                    if ((prevstart > newend)) {
                        timenext = moment.utc(moment(new Date(prevschedules[j].modulesstart), "DD/MM/YYYY HH:mm:ss")
                            .diff(moment(new Date(newschedules[i].end), "DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
                    } else if (prevend < newstart) {
                        timenext = moment.utc(moment(new Date(newschedules[i].start), "DD/MM/YYYY HH:mm:ss")
                            .diff(moment(new Date(prevschedules[j].modulesend), "DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
                    }

                    let difference = moment.duration(timenext).asMinutes()
                    if ((difference > 0 && difference < 45) && (prevschedules[j].moduleuni !== newschedules[i].moduleuni)
                        && (nexta === preva)) {
                        locactionclashes.push({
                            clashWithStart: newschedules[i].start,
                            clashWithCode: newschedules[i].modulescode,
                            clashWithTitle: newschedules[i].moduletitle,
                            moduleClashEnd: prevschedules[j].modulesend,
                            moduleTitle: prevschedules[j].modulestitle,
                            moduleCode: prevschedules[j].modulescode,
                            departureUniversity: prevschedules[j].moduleuni,
                            destinationUniversity: newschedules[i].moduleuni,
                            timeDifference: difference,
                            UserId: 1
                        })
                    }
                }
            }

            // TODO: insert the class clashes into the database to retain them
            if (clashes.length !== 0) {
                for (let k = 0; k < clashes.length; k++) {
                    ClassClashes.create(clashes[k])
                }
            }
            // TODO: insert the location clashes into the database to retain them
            if (locactionclashes.length !== 0) {
                for (let k = 0; k < locactionclashes.length; k++) {
                    LocationClashes.create(locactionclashes[k])
                }
            }

            await UserModules.create(req.body)
            res.send()
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

            // TODO: ----------------------------------------------------------------------------------
            // TODO: Handling the clashes -------------------------------------------------------------

            // TODO: ------ delete class clash from database
            const deleteClassClash = await ClassClashes.findAll({
                where: {
                    [Op.or]: [
                        {
                            moduleCode: {
                                [Op.eq]: getmodule.moduleCode
                            }
                        },
                        {
                            clashWithCode: {
                                [Op.eq]: getmodule.moduleCode
                            }
                        }
                    ],
                    UserId: 1
                }
            })

            if (deleteClassClash.length !== 0) {
                for (let k = 0; k < deleteClassClash.length; k++) {
                    deleteClassClash[k].destroy()

                }
            }

            // TODO: delete location clash from database
            const deleteLocationClash = await LocationClashes.findAll({
                where: {
                    [Op.or]: [
                        {
                            moduleCode: {
                                [Op.eq]: getmodule.moduleCode
                            }
                        },
                        {
                            clashWithCode: {
                                [Op.eq]: getmodule.moduleCode
                            }
                        }
                    ],
                    UserId: 1
                }
            })

            if (deleteLocationClash.length !== 0) {
                for (let k = 0; k < deleteLocationClash.length; k++) {
                    deleteLocationClash[k].destroy()
                }
            }

            await module.destroy()
            res.send()
        } catch (err) {
            res.status(500).send({
                error: 'an error has occurred trying to delete the module from your courses'
            })
        }
    }

}
