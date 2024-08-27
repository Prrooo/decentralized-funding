import { PrismaClient } from "@prisma/client"
import { NumericLiteral } from "typescript";

const prismaClient = new PrismaClient();

export const nextTask = async (userId: number) => {
    const task = await prismaClient.task.findFirst({
        where: {
            done: false,
            submissios: {
                none: {
                    worker_id: userId
                }
            }
        }, select: {
            id: true,
            amount: true,
            title: true,
            options: true
        }
    })
    return task;
}