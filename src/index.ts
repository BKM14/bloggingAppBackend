import { Hono } from 'hono'

import { userRouter } from '../routers/userRouter';
import { postRouter } from '../routers/postRouter';
import { tagRouter } from '../routers/tagRouter';

const app = new Hono()

app.route("/users", userRouter);
app.route("/posts", postRouter);
app.route("/tags", tagRouter);

export default app
