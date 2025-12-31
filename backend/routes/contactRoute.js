import express from "express";
import { getAllContacts, submitContact } from "../controllers/contactController.js";
import adminAuth from "../middleware/adminAuth.js";

const contactRouter = express.Router();

contactRouter.post("/add", submitContact);
contactRouter.get("/list", adminAuth, getAllContacts);

export default contactRouter;
