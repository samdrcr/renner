import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as views from './views.js';
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";

const db = new DB("blog.db");
db.query(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    title TEXT,
    body TEXT
  )
`);
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT,
    email TEXT
  )
`);

const router = new Router();

router
  .get('/', displayPosts)
  .get('/signup', showSignupForm)
  .post('/signup', handleSignup)
  .get('/login', showLoginForm)
  .post('/login', handleLogin)
  .get('/logout', handleLogout)
  .get('/post/new', displayNewPostForm)
  .get('/post/:id', displaySinglePost)
  .post('/post', createPost)
  .get('/list/:user', displayUserPosts);

const app = new Application();
app.use(Session.initMiddleware());
app.use(router.routes());
app.use(router.allowedMethods());

function executeQuery(sql, params = []) {
  console.log("Executing SQL:", sql);
  try {
    return db.query(sql, params);
  } catch (error) {
    console.error("SQL Error:", error);
    throw error;
  }
}

function getPosts(sql, params = []) {
  const results = [];
  for (const [id, username, title, body] of executeQuery(sql, params)) {
    results.push({ id, username, title, body });
  }
  return results;
}

function getUsers(sql, params = []) {
  const results = [];
  for (const [id, username, password, email] of executeQuery(sql, params)) {
    results.push({ id, username, password, email });
  }
  return results;
}

async function parseFormData(requestBody) {
  const formData = await requestBody.form();
  const formObject = {};
  for (const [key, value] of formData) {
    formObject[key] = value;
  }
  return formObject;
}

async function showSignupForm(ctx) {
  ctx.response.body = views.signupForm();
}

async function handleSignup(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const userData = await parseFormData(body);
    const existingUsers = getUsers("SELECT * FROM users WHERE username = ?", [userData.username]);
    if (existingUsers.length === 0) {
      executeQuery(
        "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
        [userData.username, userData.password, userData.email]
      );
      ctx.response.body = views.signupSuccess();
    } else {
      ctx.response.body = views.signupFail();
    }
  }
}

async function showLoginForm(ctx) {
  ctx.response.body = views.loginForm();
}

async function handleLogin(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const userData = await parseFormData(body);
    const existingUsers = getUsers("SELECT * FROM users WHERE username = ?", [userData.username]);
    const user = existingUsers[0];
    if (user && user.password === userData.password) {
      await ctx.state.session.set("user", { username: user.username });
      ctx.response.redirect("/");
    } else {
      ctx.response.body = views.loginFail();
    }
  }
}

async function handleLogout(ctx) {
  await ctx.state.session.set("user", null);
  ctx.response.redirect("/");
}

async function displayPosts(ctx) {
  const posts = getPosts("SELECT * FROM posts");
  const currentUser = await ctx.state.session.get("user");
  ctx.response.body = views.postList(posts, currentUser);
}

async function displayNewPostForm(ctx) {
  const user = await ctx.state.session.get("user");
  if (user) {
    ctx.response.body = views.newPostForm();
  } else {
    ctx.response.body = views.accessDenied();
  }
}

async function displaySinglePost(ctx) {
  const postId = ctx.params.id;
  const posts = getPosts("SELECT * FROM posts WHERE id = ?", [postId]);
  if (posts.length === 0) {
    ctx.throw(404, "Post not found");
  }
  ctx.response.body = views.postDetails(posts[0]);
}

async function createPost(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const postData = await parseFormData(body);
    const user = await ctx.state.session.get("user");
    if (user) {
      executeQuery(
        "INSERT INTO posts (username, title, body) VALUES (?, ?, ?)",
        [user.username, postData.title, postData.body]
      );
      ctx.response.redirect("/");
    } else {
      ctx.throw(403, "Unauthorized");
    }
  }
}

async function displayUserPosts(ctx) {
  const username = ctx.params.user;
  const posts = getPosts("SELECT * FROM posts WHERE username = ?", [username]);
  const currentUser = await ctx.state.session.get("user");
  ctx.response.body = views.postList(posts, currentUser);
}

console.log("Server running at http://127.0.0.1:8000");
await app.listen({ port: 8000 });
