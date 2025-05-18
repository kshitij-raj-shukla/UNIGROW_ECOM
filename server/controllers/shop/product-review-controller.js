const Order = require('../../models/Order');
const Product = require('../../models/Product');
const ProductReview = require('../../models/Review');

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } = req.body;

    // Check if user has ordered the product
    const order = await Order.findOne({
      where: {
        userId,
      }
    });

    if (!order || !order.cartItems.some(item => item.productId === productId)) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase product to review it.",
      });
    }

    // Check for existing review 
    const existingReview = await ProductReview.findOne({
      where: {
        productId,
        userId,
      }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    // Create new review
    const newReview = await ProductReview.create({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    // Calculate average review for the product
    const reviews = await ProductReview.findAll({
      where: { productId }
    });

    const totalReviewsLength = reviews.length;
    const averageReview = reviews.reduce((sum, r) => sum + r.reviewValue, 0) / totalReviewsLength;

    // Update product averageReview
    await Product.update(
      { averageReview },
      { where: { id: productId } }
    );

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await ProductReview.findAll({
      where: { productId }
    });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { addProductReview, getProductReviews };
