import { z } from 'zod'

export const userSignIn = z.object({
    email: z.string().email(),
    password: z.string()
});

export const userSignUp = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(5)
});



