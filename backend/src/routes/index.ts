import { Express } from "express";
import { fileRouter } from "./file.route.js";
import { userRouter } from "./user.route.js";

export function buildRoutes(app: Express) {
    app.use('/api/user', userRouter);  
    app.use('/api/file', fileRouter);  
}