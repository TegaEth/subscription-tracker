import express from "express";

import {PORT} from './config/env.js';

import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middleware/arcjet.middleware.js";


const app = express();

app.use(express.json()); // allows my app to handle json data sent in requests or api calls
app.use(express.urlencoded({ extended: true })); // this allows my app to handle url encoded data sent in requests or api calls
app.use(cookieParser()); // this allows my app to handle cookies sent in requests or api calls

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use(errorMiddleware);
app.use(arcjetMiddleware);

app.get('/', (req, res)=> {
    res.send("Welcome to the Subscription Tracker APi")
})

app.listen(PORT, async ()=>{
    console.log(`Server is running on port https://127.0.01:${PORT}`)
    await connectToDatabase();
})

export default app;