import { Express } from "express";
import { fileRouter } from "./file.route";
import { userRouter } from "./user.route";

export function buildRoutes(app: Express) {
    app.use('/api/user', userRouter);  
    app.use('/api/file', fileRouter);  
}