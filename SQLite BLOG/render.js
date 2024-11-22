document.addEventListener("DOMContentLoaded", () => {
    const userSelect = document.getElementById("user-select");
    const postList = document.getElementById("post-list");
    const createPostForm = document.getElementById("create-post-form");
    const userHeading = document.getElementById("user-heading");
  
    fetch("/users")
      .then((res) => res.json())
      .then((users) => {
        users.forEach((user) => {
          const option = document.createElement("option");
          option.value = user.id;
          option.textContent = user.name;
          userSelect.appendChild(option);
        });
      });
  
    userSelect.addEventListener("change", () => {
      const userId = userSelect.value;
  
      if (userId) {
        fetch(`/users/${userId}`)
          .then((res) => res.json())
          .then((user) => {
            userHeading.textContent = `Posts for ${user.name}`;
            postList.innerHTML = "";
  
            if (user.posts.length === 0) {
              postList.innerHTML = `<p>You have 0 posts!</p>`;
            } else {
              user.posts.forEach((post) => {
                const postItem = document.createElement("div");
                postItem.className = "post";
                postItem.innerHTML = `<h3>${post.title}</h3><p>${post.content}</p>`;
                postList.appendChild(postItem);
              });
            }
          });
      }
    });

    createPostForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userId = userSelect.value;
      const title = document.getElementById("title").value;
      const content = document.getElementById("content").value;
  
      fetch(`/users/${userId}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      })
        .then((res) => res.json())
        .then(() => {
          userSelect.dispatchEvent(new Event("change"));
          createPostForm.reset();
        });
    });
  });
  