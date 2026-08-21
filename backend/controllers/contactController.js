import { Contact } from "../models/contactModel.js";

export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are all required.",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Message received. We'll get back to you soon.",
      contact,
    });
  } catch (error) {
    console.error("CONTACT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while submitting your message.",
    });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("GET CONTACT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch messages.",
    });
  }
};
