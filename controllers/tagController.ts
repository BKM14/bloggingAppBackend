import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";

const prisma = new PrismaClient().$extends(withAccelerate());

export async function getPostsByTag(c : Context) {
    const tag = c.req.param('tag');
    try {
        const res = await prisma.tag.findMany({
            where: {
                tag: String(c.req.param('tag'))
            },
            select: {
                post: {
                    select: {
                        user: {select: {username: true}},
                        id: true,
                        userId: true,
                        title: true,
                        description: true,
                        tags: true
                    },
                },
            },
        });

        return c.json({
            posts: res[0].post.map((post) => ({
                username: post.user.username,
                id: post.id,
                title: post.title,
                description: post.description,
                userId: post.userId,
                tags: post.tags,
            }))
        })
    } catch (error) {
        return c.json({
            Error: error
        })
    }
}

export async function getTags(c : Context) {
    try {
        const res = await prisma.tag.findMany();

        if (res == null || res == undefined) {
            return c.json({
                message: "No tags found"
            })
        }

        return c.json({
            tags: res.map((tag) => ({
                tagName: tag.tag,
                tagId: tag.id
            }))
        })
    } catch (error) {
        c.json({
            Error: error
        })
    }
}