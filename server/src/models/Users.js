module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        password: DataTypes.STRING
    })


    Users.associate = function (models) {
    }

    return Users
}