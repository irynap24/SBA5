// Function to fetch posts from the server and display them
async function fetchPosts() {
    try {
        const response = await fetch('/posts');
        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        alert('Failed to fetch posts. Please try again later.');
    }
}

// Function to display posts on the webpage
function displayPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''; // Clear existing posts

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <button onclick="deletePost(${post.id})">Delete</button>
        `;
        postsContainer.appendChild(postElement);
    });
}

// Function to delete a post
async function deletePost(postId) {
    try {
        const response = await fetch(`/posts/${postId}`, { method: 'DELETE' });
        if (response.ok) {
            alert('Post deleted successfully!');
            fetchPosts(); // Refresh the list of posts
        } else {
            alert('Failed to delete post. Please try again.');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again later.');
    }
}