import { register, login, getProfile, getFriends, addFriend, getProfilebyId } from "../Controllers/auth.controller.js";
import express from 'express';



const authRouter = express.Router()


authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/profile", getProfile);

authRouter.get("/getFriends", getFriends);
authRouter.post("/addFriend", addFriend);
authRouter.get("/profilebyId", getProfilebyId);


export default authRouter;