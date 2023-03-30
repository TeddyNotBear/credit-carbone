import mongoose from 'mongoose';
import express from "express";

import { IUser, User } from "../models/index.js";

const router = express.Router();

router.use(function(req, res: express.Response, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.post('/', async (req, res: express.Response) => {
    const { email, wallet_address, role } = req.body;
    const user: IUser = new User({
        _id: new mongoose.Types.ObjectId(),
        email, wallet_address, role
    });

    try {
        const newUser = await user.save();
        if(newUser !== null) {
            res.status(201).json(newUser);
        } else {
            res.status(409).end();
        }
    } catch (error) {
        res.status(500).end("User already exists !");
    }
});

router.get('/:email', async (req, res: express.Response) => {
    const email: string = req.params.email;
    const userInfo = await User.findOne({email: email}).exec();
    if (userInfo === null) {
        res.status(404).end();
        return;
    }
    res.status(200).json(userInfo).end();
});

export { router as userRouter }