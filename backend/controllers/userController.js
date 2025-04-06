import userModel from "../models/userModel.js";
import validator from "validator";
import passwordValidator from "password-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Create JWT Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });
};

// API for User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.json({ success: false, message: "Missing Detail" });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message:
          "User does not exist. Create a new account or enter the correct email.",
      });
    }

    // Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Create token if password matches
    // const token = createToken(user._id);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // Token expires in 7 days
    });
    return res.json({ success: true, token, message: "Login Successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// API for User registration
const registerUser = async (req, res) => {
  // Create a password schema using `password-validator`
  const passwordSchema = new passwordValidator();
  passwordSchema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(20) // Maximum length 20
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits() // Must have digits
    .has()
    .not()
    .spaces() // Should not have spaces
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123"]); // Not one of these common passwords

  try {
    const { name, email, password } = req.body;

    // Check if name, email, and password are provided
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Detail" });
    }

    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Email Already Exists" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please Enter a valid email",
      });
    }

    // Validate password using the schema
    if (!passwordSchema.validate(password)) {
      return res.json({
        success: false,
        message:
          "Password should be between 8 and 20 characters, contain uppercase letters, lowercase letters, digits, and no spaces.",
      });
    }

    // Hashing the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Create a token for the user
    // const token = createToken(newUser._id);
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // Token expires in 7 days
    });

    return res.json({
      success: true,
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// API FOR ADMIN LOGIN
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    // Check if email and password are provided
    if (!email || !password) {
      return res.json({ success: false, message: "Missing details" });
    }
    // Check if the provided email and password match the admin credentials
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Generate a token for the admin

      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      console.log(token)

      // Return success response with the token
      return res.json({ success: true, token, message: "Login successfully" });
    } else {
      // If credentials don't match
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    // If there's an error in the try block
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin };
