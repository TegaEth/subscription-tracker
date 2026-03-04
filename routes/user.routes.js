import { Router } from "express";
import { getUsers, getUser } from "../controllers/user.controller.js";
import authorize from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', authorize, getUsers);

userRouter.get('/:id', authorize, getUser);

userRouter.post('/', (req, res)=>{
    res.send({title: "CREATES a new user"})
})

userRouter.put('/:id', (req, res)=>{
    res.send({title: "UPDATES a single user"})
})

userRouter.delete('/:id', (req, res)=>{
    res.send({title: "DELETES a single user"})
})

export default userRouter;