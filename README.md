# Blogging Web App

## Backend: (can you express with any DB)

- Create User Authentication.
- Can see post, category, and static homepage.
- The category will have a list of Posts.
- API should support pagination and the infinite scroll of posts of a category

## Automate Deployment.

- Setup linting, prettier, and husky

## Extra Features:

1. Github Actions (covering test cases).

<br/>
<hr>
<br/>

## Following this blog to setup TS, Linting, prettier and husky

https://dev.to/ornio/node-js-express-with-typescript-eslint-jest-prettier-and-husky-part-1-1lin

<br/>

# Tech/tools used

- NodeJS
- Express
- TypeScript
- MongoDB
- Mongoose

<br/>

# API Routes

## Authentication

| Req    | Type | Url                        | Private |
| ------ | ---- | -------------------------- | ------- |
| Login  | Post | baseUrl/api/v1/auth/login  | No      |
| SignUp | Post | baseUrl/api/v1/auth/signup | No      |

<br/>

## User Profile

| Req            | Type   | Url                             | Private |
| -------------- | ------ | ------------------------------- | ------- |
| GetProfileById | Get    | baseUrl/api/v1/profile/[userId] | No      |
| GetProfile     | Get    | baseUrl/api/v1/profile          | Yes     |
| CreateProfile  | Post   | baseUrl/api/v1/profile          | Yes     |
| UpdateProfile  | Put    | baseUrl/api/v1/profile          | Yes     |
| DeleteProfile  | Delete | baseUrl/api/v1/profile          | Yes     |

<br/>

## Post

| Req      | Type   | Url                                                           | Private |
| -------- | ------ | ------------------------------------------------------------- | ------- |
| Create   | Post   | baseUrl/api/v1/post                                           | Yes     |
| Update   | Put    | baseUrl/api/v1/post/[postId]                                  | Yes     |
| Delete   | Delete | baseUrl/api/v1/post/[postId]                                  | Yes     |
| GetPost  | Get    | baseUrl/api/v1/post/[postId]                                  | No      |
| GetPosts | Get    | baseUrl/api/v1/post?user=USERID&category=tech&page=2&limit=10 | No      |

<br/>

## Category

| Req           | Type   | Url                                               | Private |
| ------------- | ------ | ------------------------------------------------- | ------- |
| Create        | Post   | baseUrl/api/v1/category                           | Yes     |
| Update        | Put    | baseUrl/api/v1/category/[categoryId]              | Yes     |
| Delete        | Delete | baseUrl/api/v1/category/[categoryId]              | Yes     |
| GetCategory   | Get    | baseUrl/api/v1/category/[categoryId]              | No      |
| GetCategories | Get    | baseUrl/api/v1/category?currentPage=2&pageSize=10 | No      |
