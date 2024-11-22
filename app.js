let posts = []; // Array to store blog posts

// Add a new post
function addPost(title, content) {
  const newPost = {
    id: posts.length + 1,
    title,
    content,
    createdAt: new Date().toLocaleString(),
  };
  posts.push(newPost);
  renderPosts(); // Refresh the posts list
}

// Render all posts
function renderPosts() {
  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = ''; // Clear previous posts
  posts.forEach(post => renderPostCard(post, postsContainer));
}

// Handle post creation
function handleCreatePost(event) {
  event.preventDefault(); // Prevent default form submission
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();

  if (title && content) {
    addPost(title, content); // Add the new post
    document.getElementById('post-form').reset(); // Clear the form
    showSection('posts-section'); // Go back to the posts list
  } else {
    alert('Please fill in all fields.');
  }
}

// Show a specific section
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = section.id === sectionId ? 'block' : 'none';
  });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  renderPosts();

  document.getElementById('create-post-button').addEventListener('click', () => {
    showSection('create-section');
  });

  document.getElementById('back-to-posts').addEventListener('click', () => {
    showSection('posts-section');
  });

  document
    .getElementById('back-to-posts-from-details')
    .addEventListener('click', () => {
      showSection('posts-section');
    });

  document.getElementById('post-form').addEventListener('submit', handleCreatePost);
});
