import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connectToDatabase } from "../database.js";
import { User } from "../Models/user.model.js";

const testuri = "hello";
const JWT_SECRET = "your_secret_key"; // Store securely in environment variables

const signToken = (userId, email) => {
    return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "1h" });
};

const checkPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

const createUser = async (name, hashedPassword, email) => {
    const newUser = new User({ name, password: hashedPassword, email });
    await newUser.save();
    return newUser;
};

export const register = async (req, res) => {
    const connection = await connectToDatabase(testuri);

    try {
        const { name, password, email } = req.body;

        if (!name) {
            return res.status(400).json({ message: "name is required" });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        if (!email) {
            return res.status(400).json({ message: "Email is required" });

        }

        // Check if user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists 🧑‍🦰" });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const newUser = await createUser(name, hashedPassword, email);

        // Generate token
        const token = signToken(newUser._id, newUser.email);

        res.status(201).json({ message: "User registered successfully ✅", authToken: token, success: true, user: { name: newUser.name, email: newUser.email, userId: newUser._id } });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};

export const login = async (req, res) => {
    console.log("login");
    const connection = await connectToDatabase(testuri);

    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // Find user by email
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "User Does Not exits 🧑‍🦰", success: false });
        }

        // Compare passwords
        const isMatch = await checkPassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password ❌", success: false });
        }

        // Generate token
        const token = signToken(user._id, user.email);

        res.status(200).json({ message: "Login successful ✅", token, success: true, user: { name: user.name, email: user.email, userId: user._id } });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};


export const getProfile = async (req, res) => {
    const connection = await connectToDatabase(testuri);

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        return res.status(200).json({ user: { name: user.name, email: user.email, userId: user._id }, success: true });

    } catch (error) {
        res.status(500).json({ message: "Error retrieving profile", error });
    }
};


export const getProfilebyId = async (req, res) => {
    const connection = await connectToDatabase(testuri);

    try {
        const userId = req.headers["userid"];
        console.log(userId);

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        return res.status(200).json({ user: { name: user.name, email: user.email, userId: user._id }, success: true });

    } catch (error) {
        res.status(500).json({ message: "Error retrieving profile", error });
    }
};


export const getFriends = async (req, res) => {
    const connection = await connectToDatabase(testuri);

    try {
        const userEmail = req.headers["email"];

        if (!userEmail) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await findUserByEmail(userEmail);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }


        const friends = await User.find({ _id: { $in: user.friends } }).select(['name', 'email', '_id']);

        if (friends.length === 0) {
            return res.status(400).json({ message: "No friends found" });
        }

        console.log(friends);

        return res.status(200).json({ friends, success: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving friends", error });
    }
};

export const addFriend = async (req, res) => {
    const connection = await connectToDatabase(testuri);

    try {
        const { email, friendEmail } = req.body;

        if (!email || !friendEmail) {
            return res.status(400).json({ message: "Both email and friendEmail are required" });
        }

        const user = await findUserByEmail(email);
        const friend = await findUserByEmail(friendEmail);

        if (!user || !friend) {
            return res.status(400).json({ message: "User or friend not found" });
        }

        if (user.friends.includes(friend._id)) {
            return res.status(400).json({ message: "Friend already added" });
        }

        user.friends.push(friend._id);
        friend.friends.push(user._id);

        await user.save();
        await friend.save();

        return res.status(200).json({ message: "Friend added successfully", success: true });

    } catch (error) {
        res.status(500).json({ message: "Error adding friend", error });
    }
};