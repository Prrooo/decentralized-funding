"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoute_1 = __importDefault(require("./Routes/userRoute"));
const workerRoute_1 = __importDefault(require("./Routes/workerRoute"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use(express_1.default.json());
app.use('/api/user', userRoute_1.default);
app.use('/api/worker', workerRoute_1.default);
app.use('/api/ping', (req, res) => {
    return res.status(200).json({
        success: true,
    });
});
app.listen(PORT, () => {
    console.log(`Listening at Port -> ${PORT}`);
});
