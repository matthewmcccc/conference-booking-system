const User = require("../models/User");
const jwt = require("jsonwebtoken");
const encryptPassword = require("../utils/crypto");
const authenticateToken = require("../utils/authenticateToken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-passwordHash");
        if (users.length == 0) {
            res.status(404).json("Couldn't find any users")
        } else {
            res.status(201).json(users);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.error(`Couldn't get all users: ${error}`);
    }
}

exports.createUser = async (req, res) => {
    try {
        const { password: plaintextPassword, ...userData } = req.body;
        const passwordHash = await encryptPassword(plaintextPassword);
        console.log(passwordHash);
        const user = await User.create({ ...userData, passwordHash });

        const userResponse = user.toObject();
        delete userResponse.passwordHash;

        const token = jwt.sign(
        { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
        { expiresIn: '7d' });


        if (!user) {
            res.status(404).json("Couldn't create suer")
        } else {
            res.status(200).json({ message: "User created successfully", token, user: user });
        }
    } catch (err) {
        console.error(`Couldn't create user: ${err}`);
        res.status(400).json({ error: err.message });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json("Couldn't delete user");
        } else {
            res.status(200).json({ message: "User successfully deleted", user: user});
        }
    } catch (err) {
        console.error(`Couldn't delete user: ${err}`);
        res.status(400).json({ error: err.message });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        };

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password "});
        };

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid email or password"});
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                first_name: user.first_name,
                surname: user.surname
            }
        });
        
    } catch (error) {
        res.status(400).json(`Couldn't log in user: ${error}`);
        console.error(`Couldn't log in user: ${error}`);
    }
}

exports.getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found"});
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error"});
    }
}

exports.health = async (req, res) => {
    try {
        return res.status(200).json({ message: "Auth service is nice and healthy." })
    } catch {
        return res.status(404).json({ message: "You probably won't ever see this if the auath service is truly cooked." })
    }
}