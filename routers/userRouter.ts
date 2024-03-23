import { Hono } from "hono";
import { getUsers, userSignin, userSignup } from "../controllers/userController";

export const userRouter = new Hono();

userRouter.post("/signup", userSignup);
userRouter.post("/signin", userSignin);
userRouter.get("/all-users", getUsers);
