module.exports = (sequelize, DataTypes) => {
    const Departments = sequelize.define('Departments', {
        departmentName: DataTypes.STRING,
        departmentDegree: DataTypes.STRING
    })
    Departments.associate = function (models) {
    }
    return Departments
}
