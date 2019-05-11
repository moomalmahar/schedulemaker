module.exports = (sequelize, DataTypes) => {
    const LocationClashes = sequelize.define('LocationClashes', {
        clashWithStart: DataTypes.DATE,
        clashWithCode: DataTypes.STRING,
        clashWithTitle: DataTypes.STRING,
        moduleClashEnd: DataTypes.DATE,
        moduleTitle: DataTypes.STRING,
        moduleCode: DataTypes.STRING,
        departureUniversity: DataTypes.STRING,
        destinationUniversity: DataTypes.STRING,
        timeDifference: DataTypes.INTEGER
    })

    LocationClashes.associate = function (models) {
        LocationClashes.belongsTo(models.Users)
    }
    return LocationClashes
}

