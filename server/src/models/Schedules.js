module.exports = (sequelize, DataTypes) => {
    const Schedules = sequelize.define('Schedules', {
        moduleStart: DataTypes.DATE,
        moduleEnd: DataTypes.DATE,
        moduleCode: DataTypes.STRING,
        moduleTitle: DataTypes.STRING,
        moduleLocation: DataTypes.STRING,
        moduleUniversity: DataTypes.STRING
    })

    Schedules.associate = function (models) {
        Schedules.belongsTo(models.Modules)
    }

    return Schedules
}
