const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('subscribe', {
        id:{
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        email:{
            type: DataTypes.STRING
        },
        nombre:{
            type: DataTypes.STRING
        }
    },{timestamps: false})
}