import { Hono } from "hono";
import { getPostsByTag, getTags } from "../controllers/tagController";

export const tagRouter = new Hono();

tagRouter.get("/getPost/:tag", getPostsByTag);
tagRouter.get("/tags", getTags);