module.exports = (sequelize, DataTypes) => {
    const ClassClashes = sequelize.define('ClassClashes', {
        clashWithStart: DataTypes.DATE,
        clashWithCode: DataTypes.STRING,
        clashWithTitle: DataTypes.STRING,
        moduleStart: DataTypes.DATE,
        moduleTitle: DataTypes.STRING,
        moduleCode: DataTypes.STRING
    })

    ClassClashes.associate = function (models) {
        ClassClashes.belongsTo(models.Users)
    }

    return ClassClashes
}
