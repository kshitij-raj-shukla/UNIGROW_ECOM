const { Cart, CartItem } = require('../../models/Cart');
const Product = require('../../models/Product');
const { Op } = require('sequelize');

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid data provided!' });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    if (!cartItem) {
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
      });
    } else {
      cartItem.quantity += quantity;
      await cartItem.save();
    }

    const updatedCart = await Cart.findOne({
      where: { id: cart.id },
      include: {
        model: CartItem,
        as: 'items',
        include: {
          model: Product,
          attributes: ['id', 'image', 'title', 'price', 'salePrice'],
        },
      },
    });

    res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error' });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User id is mandatory!' });
    }

    const cart = await Cart.findOne({
      where: { userId },
      include: {
        model: CartItem,
        as: 'items',
        include: {
          model: Product,
          attributes: ['id', 'image', 'title', 'price', 'salePrice'],
        },
      },
    });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found!' });
    }

    // Filter out any items where product is missing
    cart.items = cart.items.filter((item) => item.Product !== null);

    // Optionally save if filtered
    // await cart.save(); // not needed in Sequelize here as we didn't modify DB

    // Format response like before
    const formattedItems = cart.items.map((item) => ({
      productId: item.Product.id,
      image: item.Product.image,
      title: item.Product.title,
      price: item.Product.price,
      salePrice: item.Product.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        id: cart.id,
        userId: cart.userId,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
        items: formattedItems,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error' });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid data provided!' });
    }

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found!' });
    }

    const cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not present!' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    const updatedCart = await Cart.findOne({
      where: { id: cart.id },
      include: {
        model: CartItem,
        as: 'items',
        include: {
          model: Product,
          attributes: ['id', 'image', 'title', 'price', 'salePrice'],
        },
      },
    });

    const formattedItems = updatedCart.items.map((item) => ({
      productId: item.Product ? item.Product.id : null,
      image: item.Product ? item.Product.image : null,
      title: item.Product ? item.Product.title : 'Product not found',
      price: item.Product ? item.Product.price : null,
      salePrice: item.Product ? item.Product.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        id: updatedCart.id,
        userId: updatedCart.userId,
        createdAt: updatedCart.createdAt,
        updatedAt: updatedCart.updatedAt,
        items: formattedItems,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error' });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: 'Invalid data provided!' });
    }

    const cart = await Cart.findOne({
      where: { userId },
      include: {
        model: CartItem,
        as: 'items',
        include: {
          model: Product,
          attributes: ['id', 'image', 'title', 'price', 'salePrice'],
        },
      },
    });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found!' });
    }

    await CartItem.destroy({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    const updatedCart = await Cart.findOne({
      where: { id: cart.id },
      include: {
        model: CartItem,
        as: 'items',
        include: {
          model: Product,
          attributes: ['id', 'image', 'title', 'price', 'salePrice'],
        },
      },
    });

    const formattedItems = updatedCart.items.map((item) => ({
      productId: item.Product ? item.Product.id : null,
      image: item.Product ? item.Product.image : null,
      title: item.Product ? item.Product.title : 'Product not found',
      price: item.Product ? item.Product.price : null,
      salePrice: item.Product ? item.Product.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        id: updatedCart.id,
        userId: updatedCart.userId,
        createdAt: updatedCart.createdAt,
        updatedAt: updatedCart.updatedAt,
        items: formattedItems,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error' });
  }
};

module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};
