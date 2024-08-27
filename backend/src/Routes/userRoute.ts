import express from "express";
import { authMiddleware } from "../middlewares/middleware";
import { siginController } from "../controllers/signinController";
import { taskController } from "../controllers/taskControler";
import { getAllTask } from "../controllers/getAllTaskControler";

const router=express.Router();



router.post('/signin', siginController);
router.post('/presignedUrl',authMiddleware,(req,res)=>{
    return res.status(200).json({
        message:"working"
    })
});
router.post('/task',authMiddleware,taskController)
router.get("/task/:id",authMiddleware,getAllTask)

export default router;