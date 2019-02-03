module.exports = (sequelize, DataTypes) => {
    const ModuleDepartment = sequelize.define('ModuleDepartments', {})

    ModuleDepartment.associate = function (models) {
        ModuleDepartment.belongsTo(models.Modules)
        ModuleDepartment.belongsTo(models.Departments)
    }

    return ModuleDepartment
}