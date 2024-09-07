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

// Event listener for the form to create a new post
document.getElementById('new-post-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const title = document.getElementById('post-title').value;
    const body = document.getElementById('post-body').value;

    try {
        const response = await fetch('/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, body })
        });

        if (response.ok) {
            alert('Post created successfully!');
            fetchPosts(); // Refresh the list of posts
        } else {
            alert('Failed to create post. Please try again.');
        }
    } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post. Please try again later.');
    }
});

// Initial fetch of posts when the page loads
document.addEventListener('DOMContentLoaded', fetchPosts);
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('body');

    function loadPage(url, callback) {
        fetch(url)
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error('Error:', error));
    }