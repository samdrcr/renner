// Render a single post card
function renderPostCard(post, container) {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.innerHTML = `
      <h3>${post.title}</h3>
      <p>Created at: ${post.createdAt}</p>
      <button onclick="viewPost(${post.id})">View</button>
    `;
    container.appendChild(postCard);
  }
  
  // Render a single post's details
  function renderPostDetails(post) {
    const postDetails = document.getElementById('post-details');
    postDetails.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.content}</p>
      <p><em>Created at: ${post.createdAt}</em></p>
    `;
  }
  
  // View a post by its ID
  function viewPost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
      renderPostDetails(post);
      showSection('post-details-section');
    }
  }
  