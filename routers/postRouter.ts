import { Hono } from "hono";
import { createPost, deletePost, getPost, getPosts, getUserPosts, updatePost } from "../controllers/postController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const postRouter = new Hono();

postRouter.get("/all-posts", getPosts);
postRouter.get("/user-posts" ,authMiddleware, getUserPosts);
postRouter.get("/get-post/:id", authMiddleware, getPost);
postRouter.post("/create-post", authMiddleware, createPost);
postRouter.put("/update-post/:id", authMiddleware, updatePost);
postRouter.delete("/delete-post/:id", authMiddleware, deletePost);