const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Feature = sequelize.define('Feature', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  image: {
    type: DataTypes.STRING,
  }
}, {
  tableName: 'features',
  timestamps: true, // keep createdAt and updatedAt
});

module.exports = Feature;
