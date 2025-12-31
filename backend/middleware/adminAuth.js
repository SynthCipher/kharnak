import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.json({ success: false, message: "Not Authorized Login Again" })
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // Scenario 1: Master Admin (Env Fallback)
        if (token_decode === process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            req.userRole = 'master_admin'; // Attach role to request
            req.userId = 'MASTER_ADMIN'; // Fallback ID for Env Master Admin
            next();
            return;
        }

        // Scenario 2: DB-based Admin
        if (token_decode.id) {
            const user = await userModel.findById(token_decode.id);
            if (user && (user.role === 'admin' || user.role === 'master_admin')) {
                req.userRole = user.role; // Attach role to request
                req.userId = user._id;
                next();
                return;
            }
        }

        res.json({ success: false, message: "Not Authorized Login Again" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default adminAuth
