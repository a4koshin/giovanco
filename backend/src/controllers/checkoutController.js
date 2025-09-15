import Cart from "../model/cartModel.js";
import Order from "../model/orderModel.js";

// Checkout cart → create order
export const checkoutCart = async (req, res) => {
  try {
    // 1. Find the user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product",
      "title price"
    );
    if (!cart || cart.products.length === 0)
      return res.status(400).json({ success: false, message: "Cart is empty" });

    // 2. Calculate total price
    const totalPrice = cart.products.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    // 3. Create order
    const order = await Order.create({
      user: req.user._id,
      products: cart.products.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalPrice,
      paymentMethod: req.body.paymentMethod || "COD",
      shippingAddress: req.body.shippingAddress || "",
    });

    // 4. Clear cart
    cart.products = [];
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
