import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    stock: { type: Number, default: 0 },
    image: String, // URL (from Cloudinary or S3)
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
