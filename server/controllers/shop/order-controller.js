const paypal = require('../../helpers/paypal');
const  Order  = require('../../models/Order');       // make sure this is your Sequelize model
const { Cart } = require('../../models/Cart');         // <— Sequelize Cart
const Product = require('../../models/Product');

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    // 1) Build the PayPal payment JSON **before** calling paypal.payment.create
    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: 'http://localhost:5173/shop/paypal-return',
        cancel_url: 'http://localhost:5173/shop/paypal-cancel',
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map(item => ({
              name: item.title,
              sku: item.productId,
              price: Number(item.price).toFixed(2),
              currency: 'USD',
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: 'USD',
            total: Number(totalAmount).toFixed(2),
          },
          description: 'Order payment',
        },
      ],
    };

    // 2) Create the PayPal payment
    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.error('PayPal create error:', error);
        return res.status(500).json({
          success: false,
          message: 'Error while creating PayPal payment',
        });
      }

      // 3) On success, create our DB order record
      const newlyCreatedOrder = await Order.create({
        userId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus,
        paymentMethod,
        paymentStatus,
        totalAmount,
        orderDate,
        orderUpdateDate,
        paymentId,
        payerId,
      });

      // 4) Grab PayPal approval URL and send back to client
      const approvalURL = paymentInfo.links.find(l => l.rel === 'approval_url').href;
      res.status(201).json({
        success: true,
        approvalURL,
        orderId: newlyCreatedOrder.id,
      });
    });

  } catch (e) {
    console.error('createOrder error:', e);
    res.status(500).json({
      success: false,
      message: 'Some error occurred!',
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order cannot be found",
      });
    }

    // update payment & status
    order.paymentStatus = "paid";
    order.orderStatus   = "confirmed";
    order.paymentId     = paymentId;
    order.payerId       = payerId;

    // decrement stock
    for (const item of order.cartItems) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`,
        });
      }
      product.totalStock -= item.quantity;
      await product.save();
    }

    // destroy the cart
    console.log('Attempting Cart.destroy for id=', order.cartId);
    const deletedCount = await Cart.destroy({
      where: { id: order.cartId }
    });
    console.log(`Cart.destroy deleted ${deletedCount} row(s)`);

    // save the order
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.error('capturePayment error:', e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.findAll({ where: { userId } });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
