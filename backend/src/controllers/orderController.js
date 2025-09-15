import Order from "../model/orderModel.js";

// Create new order (Customer)
export const createOrder = async (req, res) => {
  try {
    const { products, totalPrice, paymentMethod, shippingAddress } = req.body;

    if (!products || products.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "Products are required" });

    const order = await Order.create({
      user: req.user._id,
      products,
      totalPrice,
      paymentMethod,
      shippingAddress,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get orders for the logged-in user (Customer)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "products.product",
      "title price"
    );
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "first_name last_name email")
      .populate("products.product", "title price");
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    order.status = status || order.status;
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
