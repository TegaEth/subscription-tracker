import mongoose from "mongoose";
import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import ErrorResponse from "../utils/errorResponse.js";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // CREATE A NEW USER
        const {name, email, password} = req.body;
        //check if user ecists
        const existingUser = await User.findOne({email}); 

        if (existingUser) {
            throw new ErrorResponse('User already exists', 400);
        }
        
        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{
            name,
            email,
            password: hashedPassword
        }], { session });

        const token = jwt.sign({userId: newUsers[0]}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});


        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User signed up successfully',
            data: {
                token,
                user: newUsers[0]
            }
        });


    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user){
            const error = new ErrorResponse('User not found')
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid){
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user
            }
        })
    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
}