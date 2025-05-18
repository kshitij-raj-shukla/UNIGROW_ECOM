const { Op } = require('sequelize');
const Product = require('../../models/Product');

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Keyword is required and must be a string',
      });
    }

    // MySQL default collations are case-insensitive, so LIKE works like ILIKE
    const likePattern = `%${keyword}%`;
    const searchResults = await Product.findAll({
      where: {
        [Op.or]: [
          { title:       { [Op.like]: likePattern } },
          { description: { [Op.like]: likePattern } },
          { category:    { [Op.like]: likePattern } },
          { brand:       { [Op.like]: likePattern } },
        ],
      },
    });

    res.status(200).json({ success: true, data: searchResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = { searchProducts };
