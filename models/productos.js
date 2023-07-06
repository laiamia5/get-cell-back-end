const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('producto', {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING
        },
        precio:{
            type: DataTypes.INTEGER
        },
        precioAnterior: {
            type: DataTypes.INTEGER
        },
        categoria:{
            type: DataTypes.STRING
        },
        descripcion:{
            type: DataTypes.TEXT //poner cada caracteristica y luego coma
        },
        marca: {
            type: DataTypes.STRING
        },
        stock:{
            type: DataTypes.INTEGER,
        },
        img: {
            type: DataTypes.TEXT
        },
        display: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },{timestamps: false})
}