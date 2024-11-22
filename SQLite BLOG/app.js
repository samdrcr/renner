const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

const dbFile = "./db.json";
let db = JSON.parse(fs.readFileSync(dbFile, "utf-8"));

app.get("/users", (req, res) => {
  res.json(db.users);
});

app.get("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = db.users.find((u) => u.id === userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.post("/users/:id/posts", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = db.users.find((u) => u.id === userId);

  if (user) {
    const newPost = {
      id: user.posts.length + 1,
      title: req.body.title,
      content: req.body.content,
    };
    user.posts.push(newPost);
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
    res.json(newPost);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
