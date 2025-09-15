import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";
export const register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password)
    return res
      .status(400)
      .json({ success: false, message: "All fields are requierd" });

  if (typeof password != "string")
    return res.json({ success: false, message: "Password must be String" });
  if (password.length < 6)
    return res.json({
      success: false,
      message: "Password must be 6-digits or more!",
    });

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "User Already Exist" });

    const hashedPass = await bcrypt.hash(password, 10);

    const user = new userModel({
      first_name,
      last_name,
      email,
      password: hashedPass,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("Token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res
      .status(201)
      .json({ success: true, message: "User created Successfully" });
  } catch (error) {
    console.log("Error Occured in the Registration controller", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email)
    return res.json({ success: false, message: "All fields are required" });

  if (typeof password != "string")
    return res
      .status(400)
      .json({ success: false, message: "Password must be String" });
  if (password.length < 6)
    return res
      .status(400)
      .json({ success: false, message: "Password must be 6-digits" });

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("Token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.first_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Error Occured in the Login controller", error);
    return res.json({ success: false, message: "Internal Server Error" });
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("Token", {
      httpOnly: true,
    });
    res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
