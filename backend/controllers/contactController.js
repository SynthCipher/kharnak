import contactModel from "../models/contactModel.js";

// Submit Contact Form
const submitContact = async (req, res) => {
    try {
        const { name, email, message, category } = req.body;

        const contactData = {
            name,
            email,
            message,
            category,
            date: Date.now()
        };

        const newContact = new contactModel(contactData);
        await newContact.save();

        res.json({ success: true, message: "Message Sent Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get All Messages (for Admin)
const getAllContacts = async (req, res) => {
    try {
        const contacts = await contactModel.find({}).sort({ date: -1 });
        res.json({ success: true, contacts });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { submitContact, getAllContacts };
