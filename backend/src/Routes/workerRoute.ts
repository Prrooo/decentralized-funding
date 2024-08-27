import express from 'express'
import { workerMiddleware } from "../middlewares/middleware";
import { workerSiginController } from '../controllers/signinController';
import workerController from '../controllers/workerController';

const router=express.Router();

router.post('/signin',workerSiginController);
router.get('/nextTask',workerMiddleware,workerController.getNextTask);
router.post('/submission',workerMiddleware,workerController.submissioins);
router.get('/balance',workerMiddleware,workerController.balanceController);
router.post('/payout',workerMiddleware,workerController.payOutController);

export default router;