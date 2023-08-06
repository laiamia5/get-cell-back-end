const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('cupon', {
        id:{
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        numero:{
            type: DataTypes.TEXT
        },
        usado:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        razon: {
            type: DataTypes.TEXT,
        }
    },{timestamps: false})
}