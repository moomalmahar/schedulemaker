module.exports = (sequelize, DataTypes) => {
    const Modules = sequelize.define('Modules', {
        moduleCode: DataTypes.STRING,
        moduleTitle: DataTypes.STRING
    })

    Modules.associate = function (models) {
        Modules.hasMany(models.UserModules, { as: 'isMyModule' })
    }

    return Modules
}
