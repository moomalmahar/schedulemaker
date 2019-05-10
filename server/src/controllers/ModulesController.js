const {UserModules, Modules} = require('../models')
const _ = require('lodash')

module.exports = {
    async index(req, res) {
        try {
            const modules = await Modules.findAll({
                include: [{
                    model: UserModules,// this all is to get a left outer join
                    as: 'isMyModule',
                    where: {UserId: 1}, // instead of 2 get the userid
                    required: false // so that we get all the modules regardless of if the user has bookmarked it
                }]
            })
                .map(module => module.toJSON())
                .map(module => _.extend(
                    {},
                    module

                ))
            /* ----------- Above code gives us the following sql query ------------------------
            ----------------------------------------------------------------------------------
            select * from modules
            left join usermodules
            on modules.id = usermodules.ModuleId
            and usermodules.UserId = 2
            * */

            res.send(modules)
        } catch (err) {
            res.status(500).send({
                error: 'Could not get modules'
            })
        }
    }

}