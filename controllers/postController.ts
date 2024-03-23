import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Context } from 'hono';


export async function getPosts(c : Context) {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try {
        const res = await prisma.post.findMany({
            include: {
                tags: true,
                user: true,
            }
        });
        return c.json({
            posts: res.map((post) => {
                return {
                    id: post.id,
                    title: post.title,
                    description: post.description,
                    userId: post.userId,
                    username: post.user.username,
                    tags: post.tags,
                }
            })
        })
    } catch (e) {
        console.log(e);
    }
}

export async function getUserPosts(c : Context) {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const userId = c.get("userId");
    try {
        const userPosts = await prisma.post.findMany({
            where: {
                userId: userId
            }, include : {
                tags: true,
            }
        })
        return c.json({
            "posts" : userPosts
        })
    } catch(e) {
        return c.json({
            'Error': e
        })
    }
}

export async function createPost(c : Context) {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try {
        const inputPayload : {
            title: string
            description: string,
            tags: string
        } = await c.req.json();

        if (inputPayload.title != null && inputPayload.description != null) {
            const tagNames = inputPayload.tags.split(",").map((tag) => tag.trim());
            const res = await prisma.post.create({
                data: {
                    userId: await c.get('userId'),
                    title: inputPayload.title,
                    description: inputPayload.description,
                    tags: {
                        connectOrCreate : tagNames.map((tag) => ({
                            where: {tag: tag},
                            create: {tag: tag}
                        }))
                    }
                }, 
                include: {
                    tags: true,
                }
            })

            return c.json({
                message: "Posted successfully",
                post: {
                    id: res.id,
                    title: res.title,
                    description: res.description,
                    tags: res.tags
                }
            })
        }
    } catch (e) {
        return c.json({
            Error: e
        })
    }
}

export async function getPost(c : Context) {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const postId = c.req.param("id");
    const userId = c.get('userId');
    try {
        const res = await prisma.post.findFirst({
            where: {
                id: Number(postId),
                userId: userId
            },
            include: {
                tags: true
            }
        })

        if (res == null || res == undefined) {
            return c.json({
                message: "Post doesn't exist",
            })
        }
        return c.json({
            data: {
                id: res.id,
                title: res.title,
                description: res.description,
                tags: res.tags
            }
        });
    } catch (error) {
        return c.json({
            Error: error
        })
    }
}

export async function updatePost(c : Context) {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const postId = c.req.param("id");
    const userId = c.get("userId");

    try {
        const inputPayload: {
            title: string
            description: string
            tags: string
        } = await c.req.json();

        const isPostExist = await prisma.post.findFirst({
            where: {
                id: Number(postId),
            }
        })

        if (!isPostExist) {
            return c.json({
                message: "Post doesn't exist",
            })
        }
        const tagNames = inputPayload.tags.split(",").map((tag) => tag.trim());
        const res = await prisma.post.update({
            where: {
                id: Number(postId),
                userId: userId
            },
            data: {
                title: inputPayload.title,
                description: inputPayload.description,
                tags: {
                    connectOrCreate: tagNames.map((tag) => ({
                        where: {tag: tag},
                        create: {tag: tag}
                    }))
                }
            },
            include: {
                tags: true,
                user: true
            }
        })

        return c.json({
            message: "updated successfully",
            data: {
                id: res.id,
                title: res.title,
                description: res.description,
                tags: res.tags,
                username: res.user.username,
                userId: res.userId
            }
        })
    } catch (error) {
        return c.json({
            Error: error
        })
    }
}

export async function deletePost(c: Context) {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const postId = c.req.param('id');
    const userId = c.get('userId');

    try {
        const post = await prisma.post.findFirst({
            where: {
                id: Number(postId),
                userId: userId
            }
        })
        if (!post) {
            return c.json({
                message: "Post doesn't exist",
            })
        }

        const res = await prisma.post.delete({
            where: {
                id: Number(postId),
                userId: userId
            },
            include: {
                tags: true,
                user: true,
            }
        })

        if (!res) {
            return c.json({
                message: "Error deleting post"
            })
        }

        return c.json({
            message: "post deleted successfully",
            data: {
                id: res.id,
                title: res.title,
                description: res.description,
                tags: res.tags,
                username: res.user.username,
                userId: res.userId
            }
        })
    } catch(error) {
        return c.json({
            Error: error
        })
    }
}