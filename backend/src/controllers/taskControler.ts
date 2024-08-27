import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express"
import { TOTAL_DECIMALS } from "..";
import { date, z } from "zod";

const prismaClient = new PrismaClient();

const inputTask = z.object({
    title: z.string(),
    amount: z.string(),
    signature: z.string(),
    options: z.array(z.object({
        image_url: z.string().optional(),
        description: z.string()
    })),
})

type InputParam = z.infer<typeof inputTask>;

export const taskController = async (req: Request, res: Response) => {
    try {
        const parseData = inputTask.safeParse(req.body);
        //@ts-ignore
        const user_id = req.userId;
        if (!parseData) {
            return res.status(200).json({
                success: false,
                message: "not enough information provided",
            })
        }
        const inputData: InputParam = req.body;

        const amount=Number(inputData.amount)

        let response=await prismaClient.$transaction(async tx => {
            const response = await tx.task.create({
                data: {
                    title: inputData.title,
                    amount: amount*TOTAL_DECIMALS,
                    signature: inputData.signature,
                    userId: user_id,
                }
            })

            await tx.options.createMany({
                data: inputData.options.map(option => ({
                    image_url: option.image_url,
                    description: option.description,
                    taskId: response.id
                }))
            })
            return response;
        })

        return res.status(200).json({
            success:true,
            id: response.id
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "unable to create task"
        })
    }
}