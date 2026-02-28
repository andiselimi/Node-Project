import User from "../user/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


export const login = async (req, res) =>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({email, isActive: true}).select("password");

        if(!user){
            return res.status(401).json({
                message: "user not found",
                success: false,
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({
                message: "password incorrect",
                success: false,
            })
        }

        const payload = {
            id: user._id,
            role: user.role,
        }

        const token = jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: "8h"});

        return res.status(200).json({
            message: "welcome back",
            success: true,
            token,
        })
        
    } catch (error) {
        return res.status(500).json({
            message: "server error",
            success: false,
        })
    }
}