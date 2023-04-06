import express from "express";
import { User } from "../models/user.model.js";

export async function corporateMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const email: string = req.params['userEmail'];
    const userInfo = await User.findOne({email: email}).exec();
    console.log(userInfo);
    if(userInfo) {
        if(userInfo.role === 'Corporate'){
            next();
            return;
        } else{
            res.status(401).end();
            return;
        }
    } else {
        res.status(403).end();
    }
}