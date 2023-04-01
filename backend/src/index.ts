import express, { Express } from "express";
// import bodyParser from "body-parser";
import { buildRoutes } from "./routes/index.js";

import mongoose from 'mongoose';
// import cors from 'cors';
// const cors = require('cors')
// const path = require("path");
const app: Express = express();

import { config } from "dotenv";
import findConfig from "find-config";
config({ path: findConfig('.env') });

try {
    mongoose.connect(process.env["DB_URL"], { useNewUrlParser: true, useUnifiedTopology: true });
} catch (error) {
    console.log(error);   
}

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// const allowedOrigins = ['http://localhost:3000'];
// const options: cors.CorsOptions = {
//    origin: allowedOrigins
// };
// app.use(cors(options));

buildRoutes(app);

const port = process.env["PORT_BACK"] ? Number(process.env.PORT_BACK) : 4000;
app.listen(port, "0.0.0.0", () => {
    console.log(`Listening on port ${port}`);
});