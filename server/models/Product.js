const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  image: {
    type: DataTypes.STRING,
  },
  title: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.STRING,
  },
  brand: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.FLOAT,
  },
  salePrice: {
    type: DataTypes.FLOAT,
  },
  totalStock: {
    type: DataTypes.INTEGER,
  },
  averageReview: {
    type: DataTypes.FLOAT,
  },
}, {
  tableName: 'products',
  timestamps: true,
});

module.exports = Product;
