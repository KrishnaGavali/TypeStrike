import { TypingResult } from "../Models/typingResult.model.js";
import { User } from "../Models/user.model.js"; // Import User model
import { connectToDatabase } from "../database.js";

const createTypingResult = async (userId, wpm, accuracy, duration) => {
    const newTypingResult = new TypingResult({ userId, wpm, accuracy, duration });
    await newTypingResult.save();
    return newTypingResult;
};

const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

const findUserById = async (userId) => {
    return await User
        .findById(userId)
        .select("-password");
};

export const saveTypingResult = async (req, res) => {
    const connection = await connectToDatabase();

    try {
        const { email, wpm, accuracy, duration } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!wpm) {
            return res.status(400).json({ message: "WPM is required" });
        }

        if (!accuracy) {
            return res.status(400).json({ message: "Accuracy is required" });
        }

        if (!duration) {
            return res.status(400).json({ message: "Duration is required" });
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        await createTypingResult(user._id, wpm, accuracy, duration);

        return res.status(201).json({ message: "Typing result saved successfully 🔥", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Error saving typing result", error });
    }
};

export const getTypingHistory = async (req, res) => {
    const connection = await connectToDatabase();

    try {
        // Extract userId from headers instead of body
        const userId = req.headers["userid"];

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await findUserById(userId);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const typingHistory = await TypingResult.find({ userId }).select("-userId -_id -__v");

        return res.status(200).json({ typingHistory, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Error getting typing history", error });
    }
};

