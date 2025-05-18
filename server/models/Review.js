const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // your Sequelize instance

const ProductReview = sequelize.define('ProductReview', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reviewMessage: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  reviewValue: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'product_reviews',
  timestamps: true, // createdAt, updatedAt auto-managed
});

module.exports = ProductReview;
