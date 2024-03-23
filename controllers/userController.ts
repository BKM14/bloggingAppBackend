import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Context } from 'hono';
import { userSignIn, userSignUp } from '../zod/Schemes';
import { Jwt } from 'hono/utils/jwt';


export async function userSignup(c: Context) {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const secretPassword = c.env.JWT_PASSWORD;
    const inputPayload : {
        username: string,
        email: string,
        password: string
    } = await c.req.json();
    const parsedPayload = userSignUp.safeParse(inputPayload);
    if (!parsedPayload) {
        return c.text("Error: Invalid inputs");
    }

    const email = await prisma.user.findFirst({
        where: {
            username: inputPayload.username,
            email: inputPayload.email,
            password: inputPayload.password
        },
        select: {email: true}
    })

    if (email!=null) {
        return c.text("Error: User already exists");
    }
    try {
        const user = await prisma.user.create({
            data: {
                username: inputPayload.username,
                email: inputPayload.email,
                password: inputPayload.password
            }
        })

        const userId = user.id;
        
        const token = await Jwt.sign(userId, secretPassword);
        return c.json(token)
    } catch (e) {
        return c.json(e);
    } finally {
        console.log("User sign up done");
    }
}

export async function userSignin(c: Context) {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const secretPassword = c.env.JWT_PASSWORD
    const inputPayload : {
        email: string,
        password: string
    } = await c.req.json();
    const parsedPayload = userSignIn.safeParse(inputPayload);

    if (!parsedPayload) {
        return c.text("Error: Incorrect inputs");
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: inputPayload.email,
                password: inputPayload.password,
            }
        })
    
        if (user==null) {
            return c.text("User doesn't exist. Create a new account");
        }
    
        const userId = user.id;
        const token = await Jwt.sign(userId, secretPassword);
        return c.json({"token" : token})
    } catch (e) {
        console.log(e);
        return c.json({"Error": e});
    } finally {
        console.log("Sign in done")
    }
}

export async function userProfile(c : Context) {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try {
        const userId = c.req.param("id");
        const user = await prisma.user.findFirst({
            where: {
                id: Number(userId)
            },
            include: {
                posts: true
            }
        })
        if (user == null) {
            return c.body("User not found");
        }
        return c.json({
            "user": user
        });
    } catch(e) {
        return c.json({
            "Error": e
        });
    }
}

export async function getUsers(c : Context) {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try {
        const users = await prisma.user.findMany();
        if (users == null || users == undefined) {
            return c.json({
                message: "No users to fetch"
            })
        }

        return c.json({
            users: users.map((user) => {
                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                }}
            )
        })
    } catch(e) {
        console.log(e);
        return c.json({Error: e});
    }
}