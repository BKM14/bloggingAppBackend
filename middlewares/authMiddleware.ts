import { Next } from 'hono';
import { Jwt } from 'hono/utils/jwt';

export async function authMiddleware(c: any, next: Next) {
    const secretPassword = c.env.JWT_PASSWORD
    try {
        const inputToken: string = c.req.header("Authorization").split(" ")[1];
        if (inputToken !== null || inputToken !== undefined) {
            const decode = await Jwt.verify(inputToken, secretPassword);
            if (decode) {
                c.set("userId", decode);
                await next();
            } else {
                return c.body("Unauthorized");
            }
        } else {
            return c.body("Unauthorized")
        }
    } catch {
        return c.body("Unauthorized")
    }
}