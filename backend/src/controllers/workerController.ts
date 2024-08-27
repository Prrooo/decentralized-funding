import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";
import { couldStartTrivia } from "typescript";
import { nextTask } from "../helper/nextTask";
import z, { any } from "zod";
import dotenv from "dotenv"
dotenv.config();

const prismaClient = new PrismaClient();

const TOTAL_SUBMISSIONS = 100;
export const createSubmissionInput = z.object({
    taskId: z.string(),
    selection: z.string(),
});

const getNextTask = async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const userId = req.userId;

        const task = await nextTask(Number(userId));

        if (!task) {
            return res.status(411).json({
                success: false,
                message: "No more tasks left for you",
            })
        }

        return res.status(200).json({
            success: true,
            task,
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "error while fetching next task"
        })
    }
}


const submissioins = async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const userId = req.userId;
        const body = req.body;
        const parsedBody = createSubmissionInput.safeParse(body);

        if (parsedBody.success) {
            const task = await nextTask(Number(userId));
            if (!task || task?.id !== Number(parsedBody.data.taskId)) {
                return res.status(411).json({
                    message: "Incorrect task id"
                })
            }

            const amount = (Number(task.amount) / TOTAL_SUBMISSIONS).toString();

            const submission = await prismaClient.$transaction(async tx => {
                const submission = await tx.submission.create({
                    data: {
                        option_id: Number(parsedBody.data.selection),
                        worker_id: userId,
                        task_id: Number(parsedBody.data.taskId),
                        amount: Number(amount)
                    }
                })

                await tx.worker.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        pending_amount: {
                            increment: Number(amount)
                        }
                    }
                })

                return submission;
            })

            const nextTaskTo = await nextTask(Number(userId));
            res.json({
                nextTaskTo,
                amount
            })


        } else {
            res.status(411).json({
                message: "Incorrect inputs"
            })

        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "error while submission",
        })
    }
}

const balanceController = async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const userId = req.userId;
        const response = await prismaClient.worker.findFirst({
            where: {
                id: Number(userId)
            }
        })
        return res.status(200).json({
            success: true,
            pendingAmount: response?.pending_amount,
            lockedAmount: response?.locked_amount
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "error while getting balance",
        })
    }
}

const payOutController = async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const userId: string = req.userId;
        const worker = await prismaClient.worker.findFirst({
            where: { id: Number(userId) }
        })

        if (!worker) {
            return res.status(403).json({
                message: "User not found"
            })
        }

        // const transaction = new Transaction().add(
        //     SystemProgram.transfer({
        //         fromPubkey: new PublicKey("2KeovpYvrgpziaDsq8nbNMP4mc48VNBVXb5arbqrg9Cq"),
        //         toPubkey: new PublicKey(worker.address),
        //         lamports: 1000_000_000 * worker.pending_amount / TOTAL_DECIMALS,
        //     })
        // );


        // console.log(worker.address);

        // const keypair = Keypair.fromSecretKey(decode(privateKey));

        // TODO: There's a double spending problem here

        let signature = "";
        // try {
        //     signature = await sendAndConfirmTransaction(
        //         connection,
        //         transaction,
        //         [keypair],
        //     );

        // } catch (e) {
        //     return res.json({
        //         message: "Transaction failed"
        //     })
        // }

        // console.log(signature)

        // We should add a lock here
        await prismaClient.$transaction(async tx => {
            await tx.worker.update({
                where: {
                    id: Number(userId)
                },
                data: {
                    pending_amount: {
                        decrement: worker.pending_amount
                    },
                    locked_amount: {
                        increment: worker.pending_amount
                    }
                }
            })

            await tx.payouts.create({
                data: {
                    user_id: Number(userId),
                    amount: worker.pending_amount,
                    status: "Processing",
                    signature: signature
                }
            })
        })

        res.json({
            message: "Processing payout",
            amount: worker.pending_amount
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "unable to payout",
        })
    }
}

export default { getNextTask, submissioins, balanceController, payOutController };
