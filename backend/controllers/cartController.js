import userModel from "../models/userModel.js"
import productModel from "../models/productModel.js"

// add items to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body

        const product = await productModel.findById(itemId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        // Basic check: if strictly 0 stock, deny.
        if (product.quantity <= 0) {
            return res.json({ success: false, message: "Out of Stock" });
        }

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        let currentQty = 0;
        if (cartData[itemId] && cartData[itemId][size]) {
            currentQty = cartData[itemId][size];
        }

        if (currentQty + 1 > product.quantity) {
            return res.json({ success: false, message: `Only ${product.quantity} items available.` });
        }


        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            }
            else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Added To Cart" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// update user cart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body

        const product = await productModel.findById(itemId);
        if (product && quantity > product.quantity) {
            return res.json({ success: false, message: `Only ${product.quantity} items available.` });
        }

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        cartData[itemId][size] = quantity

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// get user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        res.json({ success: true, cartData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

export { addToCart, updateCart, getUserCart }
