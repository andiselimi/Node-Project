import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../modules/user/user.model.js";

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const isAuthenticated = async (req, res, next) => {

    console.log(req.headers.authorization, "kqyreeee");

    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            message: "Access denied, no token provided",
        })
    }

    const token = authHeader.split(" ")[1];

    try {
        const decode = jwt.verify(token, JWT_SECRET_KEY);
        const user = await User.findById(decode.id);
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            message: "invalid token",
        })
    }
    
}

export const isAuthorized = (roles) => {
    return (req, res, next) => {
        
        if(!req.user){
            return res.status(401).json({
                message: "Access denied, insufficient permission",
            })
        }

        if(roles && !roles.includes(req.user.role)){
            return res.status(403).json({
                message: "Access denied, you are unauthorized",
            })
        }
        next();
    }
}