module.exports = (sequelize, DataTypes) => {
    const Modules = sequelize.define('Modules', {
        moduleID: DataTypes.STRING,
        moduleName: DataTypes.STRING,
        moduleSemesterOffered: DataTypes.STRING,
        moduleECTS: DataTypes.INTEGER,
        moduleLocation: DataTypes.STRING,
        moduleDepartment: DataTypes.STRING
    })

    Modules.associate = function (models) {
        Modules.hasMany(models.UserModules, { as: 'isMyModule' })
    }

    return Modules
}
