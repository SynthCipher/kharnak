import userModel from "../models/userModel.js";

// ADD TO USER CART
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }
    let cartData = await userData.cartData;

    // Check if the item already exists in the cart
    if (cartData[itemId]) {
      // If the item exists, check if the size exists
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1; // Increase the quantity
      } else {
        cartData[itemId][size] = 1; // Add the new size with quantity 1
      }
    } else {
      // If the item does not exist in the cart, add it with the size and quantity 1
      cartData[itemId] = { [size]: 1 };
      //   cartData[itemId] = {};
      //   cartData[itemId][size] = 1;
    }
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// UPDATR  USER CART
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User Not Found" });
    }
    let cartData = await userData.cartData;

    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//  GET USER CARD DATA
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId)

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User Not Found" });
    }
    let cartData = await userData.cartData;
    console.log(cartData)
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
