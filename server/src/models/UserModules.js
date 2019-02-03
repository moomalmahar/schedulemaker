module.exports = (sequelize, DataTypes) => {
    const UserModules = sequelize.define('UserModules', {})

    UserModules.associate = function (models) {
        UserModules.belongsTo(models.Users)
        UserModules.belongsTo(models.Modules)
    }

    return UserModules
}