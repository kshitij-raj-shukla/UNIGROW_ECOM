const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // your sequelize instance

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cartId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cartItems: {
    type: DataTypes.JSON,  // store array of cart items as JSON
    allowNull: false,
  },
  addressInfo: {
    type: DataTypes.JSON,  // store address info as JSON
    allowNull: false,
  },
  orderStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  orderUpdateDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  paymentId: {
    type: DataTypes.STRING,
  },
  payerId: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'orders',
  timestamps: false, // since you have orderDate/orderUpdateDate explicitly
});

module.exports = Order;
