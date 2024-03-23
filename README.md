# Blogging app backend

This is the backend of a simple blogging application built with TypeScript using the Hono framework and Prisma ORM. The backend provides APIs for managing users, posts, and tags.

Backend hosted on cloudflare: Access [here](https://bloggingbackend.balajikrishnamurthy2004.workers.dev/)

## Routes
### Users
+ GET /users: Get all users.
+ POST /users/signup: Sign up a new user.
+ POST /users/login: Log in an existing user.

### Posts
- GET /posts/all-posts: Get all posts.
- GET /posts/user-posts: Get posts created by the authenticated user.
- GET /posts/get-post/:id: Get a specific post by ID.
- POST /posts/create-post: Create a new post.
- PUT /posts/update-post/:id: Update an existing post.
- DELETE /posts/delete-post/:id: Delete a post.
### Tags
- GET /tags/all-tags: Get all tags.
- POST /tags/create-tag: Create a new tag.
- PUT /tags/update-tag/:id: Update an existing tag.
- DELETE /tags/delete-tag/:id: Delete a tag.
## Middlewares
- authMiddleware: Middleware to authenticate requests using JWT token.
## Controllers
- postController: Contains functions to handle post-related logic.
##Database
- Uses Prisma ORM for database operations.
- Supports PostgreSQL database.
## Dependencies
- Hono: Lightweight web framework for TypeScript.
- Prisma: Modern database toolkit for Node.js and TypeScript.
- jsonwebtoken: JSON Web Token implementation for node.js.
- Zod: TypeScript-first schema validation with static type inference.

## Environment Variables
- DATABASE_URL: URL of the PostgreSQL database.
- JWT_PASSWORD: Secret key for JWT token encryption.
##Usage
1. Make sure the server is running.
2. Use tools like Postman or curl to send requests to the API endpoints.
3. Authenticate users using JWT tokens.
4. Create, read, update, and delete posts and tags as needed.

![Selection_001](https://github.com/BKM14/bloggingAppBackend/assets/107975017/b6b228b4-a498-43ac-9169-3396b9dba014)
![Selection_002](https://github.com/BKM14/bloggingAppBackend/assets/107975017/d946b12b-84c1-4717-aa26-7ccec3f4d808)
