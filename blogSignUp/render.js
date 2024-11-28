export function baseTemplate(title, content) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 2em; line-height: 1.6; }
          h1, h2 { color: #333; }
          a { color: #007BFF; text-decoration: none; }
          a:hover { text-decoration: underline; }
          form { margin-top: 1em; }
          input, textarea { width: 100%; padding: 0.5em; margin-bottom: 1em; border: 1px solid #ddd; border-radius: 4px; }
          button { padding: 0.5em 1em; background-color: #007BFF; color: white; border: none; border-radius: 4px; cursor: pointer; }
          button:hover { background-color: #0056b3; }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>`;
  }
  
  export function loginForm() {
    return baseTemplate("Login", `
      <h1>Login</h1>
      <form action="/login" method="post">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/signup">Sign up here</a>.</p>
    `);
  }
  
  export function signupForm() {
    return baseTemplate("Signup", `
      <h1>Signup</h1>
      <form action="/signup" method="post">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <input type="email" name="email" placeholder="Email" required>
        <button type="submit">Sign Up</button>
      </form>
    `);
  }
  
  export function signupSuccess() {
    return baseTemplate("Success", `
      <h1>Signup Successful</h1>
      <p>Welcome! You can now <a href="/login">log in</a>.</p>
    `);
  }
  
  export function signupFail() {
    return baseTemplate("Signup Failed", `
      <h1>Signup Failed</h1>
      <p>Username already exists. Please try again.</p>
    `);
  }
  
  export function postList(posts, user) {
    const postItems = posts.map(post => `
      <li>
        <h2>${post.title} by <a href="/list/${post.username}">${post.username}</a></h2>
        <a href="/post/${post.id}">Read More</a>
      </li>
    `).join('');
    
    const userOptions = user
      ? `<p>Welcome, ${user.username}. <a href="/post/new">Create a Post</a> | <a href="/logout">Logout</a></p>`
      : `<p><a href="/login">Login</a> to create posts.</p>`;
  
    return baseTemplate("Posts", `
      <h1>All Posts</h1>
      ${userOptions}
      <ul>${postItems}</ul>
    `);
  }
  
  export function newPostForm() {
    return baseTemplate("New Post", `
      <h1>Create a New Post</h1>
      <form action="/post" method="post">
        <input type="text" name="title" placeholder="Post Title" required>
        <textarea name="body" placeholder="Post Content" required></textarea>
        <button type="submit">Submit</button>
      </form>
    `);
  }
  
  export function postDetails(post) {
    return baseTemplate(post.title, `
      <h1>${post.title}</h1>
      <p>By ${post.username}</p>
      <div>${post.body}</div>
      <a href="/">Back to Posts</a>
    `);
  }
  
  export function accessDenied() {
    return baseTemplate("Access Denied", `
      <h1>Access Denied</h1>
      <p>You must be logged in to view this page. <a href="/login">Login</a></p>
    `);
  }
  
  export function loginFail() {
    return baseTemplate("Login Failed", `
      <h1>Login Failed</h1>
      <p>Invalid username or password. Please try again.</p>
    `);
  }
  