module.exports = (sequelize, DataTypes) => {
  const Module = sequelize.define('Module', {
    moduleID: DataTypes.STRING,
    moduleName: DataTypes.STRING,
    moduleSemesterOffered: DataTypes.STRING,
    moduleECTS: DataTypes.INTEGER,
    moduleLocation: DataTypes.STRING,
    moduleDepartment: DataTypes.STRING
  })

  return Module
}
