import User from "./user.model.js";
import bcrypt from "bcrypt";
import { sendWellcomeEmail } from "../../config/email.js";

export const createUser = async (req, res) => {
    try {
        // const firstName = req.body.firstName;
        // const lastName = req.body.lastName;
        // const email = req.body.email;
        // const password = req.body.password;
        // const phoneNumber = req.body.phoneNumber;
        // const identityCard = req.body.identityCard;

        const {firstName, lastName, email, password, phoneNumber, identityCard} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            identityCard,
        });

        await user.save();

        sendWellcomeEmail(user.email, `${user.firstName} ${user.lastName}`);

        res.status(201).json({
            success: true,
            data: user
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error
        })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const firstName = req.query.firstName;
        const lastName = req.query.lastName;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = { isActive: true };
        if (firstName) {
            query.firstName = { $regex: firstName, $options: "i" };
        }
        if (lastName) {
            query.lastName = { $regex: lastName, $options: "i" };
        }

        const users = await User.find(query)
        .select("-password")
        .sort({
            createdAt: -1,
        })
        .skip(skip)
        .limit(limit);

        const totalDocuments = await User.countDocuments(query);
        
        res.status(200).json({
            message: "Users retrieved successfully",
            length: users.length,
            totalDocuments,
            success: true,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error,
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = req.user;

        res.status(200).json({
            message: "hello me",
            data: user,
        })
    } catch(error) {
        res.status(500).json({
            message: "Server Error",
            error: error,
        })
    }
}

export const editMe = async (req, res) =>{
    try {
        const userId = req.user._id;
        const {firstName, lastName, email, phoneNumber, identityCard} = req.body;
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                message: "user not found",
            });
        }

        if(firstName){
            user.firstName = firstName
        }
        if(lastName){
            user.lastName = lastName
        }
        if(email){
            user.email = email
        }
        if(phoneNumber){
            user.phoneNumber = phoneNumber
        }
        if(identityCard){
            user.identityCard = identityCard
        }

        await user.save();
        res.status(200).json({
            success: true,
            message: "User Updated",
            data: user,
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error,
        })
    }
}

export const deleteMe = async (req, res) => {
    try {
        const userId = req.user._id;
        await User.findByIdAndUpdate(userId, {isActive: false});

        res.status(200).json({
            message: "Account Deleted",
        })

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error,
        })
    }
}

export const getOneUser = async (req, res) =>{
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select("-password");

        if(!user){
            return res.status(404).json({
                message: "user not found",
            });
        }else{
            res.status(200).json({
                success: true,
                data: user,
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error,
        })
    }
}

export const editUser = async (req, res) =>{
    try {
        const userId = req.params.userId;
        const {firstName, lastName, email, role, phoneNumber, identityCard} = req.body;
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                message: "user not found",
            });
        }

        if(firstName){
            user.firstName = firstName
        }
        if(lastName){
            user.lastName = lastName
        }
        if(email){
            user.email = email
        }
        if(phoneNumber){
            user.phoneNumber = phoneNumber
        }
        if(identityCard){
            user.identityCard = identityCard
        }
        if(role && req.user.role === "admin"){
            user.role = role
        }

        await user.save();
        res.status(200).json({
            success: true,
            message: "User Updated",
            data: user,
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error,
        })
    }
}

export const deleteUser = async (req, res) =>{
    try {
        const userId = req.params.userId;
        await User.findByIdAndUpdate(userId, {isActive: false});

        res.status(200).json({
            message: "User Deleted",
        })

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error,
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select("password");

        if(!user){
            return res.status(404).json({
                message: "user not found",
            });
        }

        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;

        if(newPassword !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if(!isOldPasswordValid){
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error,
        })
    }
}

