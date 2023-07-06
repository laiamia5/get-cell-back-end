const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('compra', {
        id:{
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        entrega:{
            type: DataTypes.ENUM('pendiente', 'en camino', 'entregada'),
            defaultValue: "pendiente"
        },
        pago:{
            type: DataTypes.ENUM('pendiente', 'pagado'),
            defaultValue: "pendiente"
        },
        medio_de_pago: {
            type: DataTypes.ENUM('mercado pago', 'transferencia bancaria'),
        },
        monto_final : {
            type: DataTypes.INTEGER,
        }
    })
}