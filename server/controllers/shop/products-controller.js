const Product = require('../../models/Product');
const { Op } = require('sequelize');

const getFilteredProducts = async (req, res) => {
  try {
    let { category = '', brand = '', sortBy = 'price-lowtohigh' } = req.query;

    let where = {};

    if (category) {
      where.category = { [Op.in]: category.split(',') };
    }
    if (brand) {
      where.brand = { [Op.in]: brand.split(',') };
    }

    let order = [];

    switch (sortBy) {
      case 'price-lowtohigh':
        order = [['price', 'ASC']];
        break;
      case 'price-hightolow':
        order = [['price', 'DESC']];
        break;
      case 'title-atoz':
        order = [['title', 'ASC']];
        break;
      case 'title-ztoa':
        order = [['title', 'DESC']];
        break;
      default:
        order = [['price', 'ASC']];
    }

    const products = await Product.findAll({ where, order });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Some error occurred' });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found!' });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Some error occurred' });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
