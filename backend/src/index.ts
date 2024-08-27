import  express from "express"
import userRouter from './Routes/userRoute';
import wokerRouter from './Routes/workerRoute';
import  workerData  from "worker_threads";
import { Request,Response } from "express";
import dotenv from 'dotenv';
import { dot } from "node:test/reporters";
const cors=require("cors");

dotenv.config();

export const TOTAL_DECIMALS:number=1000000;

const app=express();
const PORT=process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.use('/api/user',userRouter);
app.use('/api/worker',wokerRouter);

app.use('/api/ping',(req:Request,res:Response)=>{
    return res.status(200).json({
        success:true,
    })  
})

app.listen(PORT,()=>{
    console.log(`Listening at Port -> ${PORT}`);
})