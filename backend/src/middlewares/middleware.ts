
import { Request, Response, NextFunction } from "express"
import dotenv from "dotenv";
const jwt=require("jsonwebtoken");
dotenv.config();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(403).json({
                success:false,
                message:"Authorization header is missing"
            });
        }

        const JWT_SCRET = process.env.JWT_SCRET;
        const token=authHeader.split(" ")[1];

        const decoded=jwt.verify(token, JWT_SCRET)
        if(!decoded && !decoded.userId){
            return res.status(403).json({
                success:false,
                message:"Invalid token",
            })
        }
       
        (req as any).userId=decoded.userId;
        next();

    } catch (error) {
        console.log(error);
        return res.status(403).json({
            success: false,
            message:"Your are not loggedIn"
        })
    }
}


export const workerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(403).json({
                success:false,
                message:"Authorization header is missing"
            });
        }

        const JWT_SCRET = process.env.JWT_SCRET_WORK;
        const token=authHeader.split(" ")[1];

        const decoded=jwt.verify(token, JWT_SCRET)
        if(!decoded && !decoded.userId){
            return res.status(403).json({
                success:false,
                message:"Invalid token",
            })
        }
       
        (req as any).userId=decoded.userId;
        next();

    } catch (error) {
        console.log(error);
        return res.status(403).json({
            success: false,
            message:"Your are not loggedIn"
        })
    }
}