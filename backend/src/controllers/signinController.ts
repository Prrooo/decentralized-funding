import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import dotenv from 'dotenv';
import { chown } from "fs";

dotenv.config();
const prismaClient = new PrismaClient();
const jwt = require("jsonwebtoken");

// signin with wallet 
// signin a message 
export const siginController = async (req: Request, res: Response) => {
    try {
        // Todo: ADD sign verification logic here

        const hardcodedWalletAddress = "ljasdlkfjlakdf";
        const JWT_SCRET = process.env.JWT_SCRET;

        const existingUser = await prismaClient.user.findFirst({
            where: {
                address: hardcodedWalletAddress,
            }
        });

        if (existingUser) {
            const token = await jwt.sign({
                userId: existingUser.id,
            }, JWT_SCRET)
            return res.status(200).json({
                success: true,
                token,
            })
        }
        else {
            const user = await prismaClient.user.create({
                data: {
                    address: hardcodedWalletAddress,
                    email: "randomEmail@gmail.com"
                }
            })
            const token = await jwt.sign({
                userId: user.id,
            }, JWT_SCRET);
            return res.status(200).json({
                success: true,
                token,
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
        })
    }
}

export const workerSiginController  = async (req: Request, res: Response) => {
    try {
        // Todo: ADD sign verification logic here

        const hardcodedWalletAddress = "ljasdlkfjlakdf";
        const JWT_SCRET = process.env.JWT_SCRET_WORK;

        const existingUser = await prismaClient.worker.findFirst({
            where: {
                address: hardcodedWalletAddress,
            }
        });

        if (existingUser) {
            const token = await jwt.sign({
                userId: existingUser.id,
            }, JWT_SCRET)
            return res.status(200).json({
                success: true,
                token,
            })
        }
        else {
            const user = await prismaClient.worker.create({
                data: {
                    address: hardcodedWalletAddress,
                    email: "randomEmail@gmail.com",
                    pending_amount:0,
                    locked_amount:0,
                }
            })
            const token = await jwt.sign({
                userId: user.id,
            }, JWT_SCRET);
            return res.status(200).json({
                success: true,
                token,
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
        })
    }
}