import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express"
import { optional } from "zod";

const prismaClient = new PrismaClient();

export const getAllTask = async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const userId = req.userId;
        const taskId = req.params.id;

        const taskDetails = await prismaClient.task.findFirst({
            where: {
                id: Number(taskId),
                userId,
            },
            include: {
                options:true
            }
        })

        if (!taskDetails) {
            return res.status(403).json({
                success: false,
                message: "You don't have access to this task"
            })
        }

        const response = await prismaClient.submission.findMany({
            where: {
                task_id: Number(taskId)
            }
        })

        const result: Record<string, {
            count:number;
            option:{
                discription:string;
                imageURL?:string;
            }
        }> ={}

        taskDetails.options.map(option=>(
            result[option.id]={
                count:0,
                option:{
                    discription:option.description,
                    imageURL:option.image_url!,
                }
            }
        ))

        response.forEach(r=>{
            result[r.option_id].count++;
        })

        return res.status(200).json({
            success:true,
            result
        })

    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "error while getting count of options"
        })
    }
}