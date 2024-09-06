const express = require('express');
const path = require('path');
const app = express();
const port = 5000;

// Mock data for users, posts, and comments
const users = [
    { id: 1, name: 'Granny Smith', email: 'green.apple@example.com' },
    { id: 2, name: 'Honey Crisp', email: 'jane.smith@example.com' },
    { id: 3, name: 'Cosmic Crisp', email: 'baked.apple@example.com' }
];

const posts = [
    {
        id: 1, userId: 1, title: 'A', body: 'Msfdfsdfsn.'
    },
    { id: 2, userId: 1, title: 'Another Post by Apple', body: '!!!!!!!!.' },
    {
        id: 3, userId: 2, title: 'Am', body: 'cnvdfI'
    },
    {
        id: 4, userId: 3, title: '?', body: ' fsmdf,nsdf'
    }
];

const comments = [
    { id: 1, postId: 1, body: 'Great post!' },
    { id: 2, postId: 2, body: 'Very informative, thanks!' },
    { id: 3, postId: 3, body: 'I learned a lot from this.' },
    { id: 4, postId: 4, body: 'Interesting perspective.' }
];

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Custom middleware to log requests
function logRequests(req, res, next) {
    console.log(`${req.method} request for ${req.url}`);
    next();
}

// Use the logging middleware for all routes
app.use(logRequests);

// Helper function to get random posts
function getRandomPosts(num) {
    const shuffled = [...posts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}


// Posts routes
app.get('/posts', (req, res, next) => {
    try {
        const { userId, limit } = req.query;
        let filteredPosts = posts.slice(0, parseInt(limit, 10) || 10); // Limit the number of posts

        if (userId) {
            filteredPosts = filteredPosts.filter(post => post.userId === parseInt(userId, 10));
        }

        // Add comments to posts
        const postsWithComments = filteredPosts.map(post => {
            const postComments = comments.filter(comment => comment.postId === post.id);
            return { ...post, comments: postComments };
        });

        res.json(postsWithComments);
    } catch (error) {
        next(error); // Pass errors to the error-handling middleware
    }
});

app.get('/posts/:id', (req, res, next) => {
    try {
        const { id } = req.params;
        const post = posts.find(post => post.id === parseInt(id, 10));
        if (post) {
            const postComments = comments.filter(comment => comment.postId === post.id);
            res.json({ ...post, comments: postComments });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        next(error); // Pass errors to the error-handling middleware
    }
});

app.post('/posts', (req, res, next) => {
    try {
        const newPost = req.body;
        // Ensure the new post has a unique ID
        const newId = posts.length > 0 ? Math.max(...posts.map(post => post.id)) + 1 : 1;
        newPost.id = newId; // Assign a unique ID

        posts.push(newPost); // Add the new post to the array
        res.status(201).json(newPost);
    } catch (error) {
        next(error); // Pass errors to the error-handling middleware
    }
});

app.patch('/posts/:id', (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedPost = req.body;
        const index = posts.findIndex(post => post.id === parseInt(id, 10));
        if (index !== -1) {
            posts[index] = { ...posts[index], ...updatedPost };
            res.json(posts[index]);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        next(error); // Pass errors to the error-handling middleware
    }
});

app.delete('/posts/:id', (req, res, next) => {
    try {
        const { id } = req.params;
        const postId = parseInt(id, 10); // Convert ID to integer

        // Find and delete the post
        const index = posts.findIndex(post => post.id === postId);
        if (index !== -1) {
            posts.splice(index, 1); // Remove the post
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error deleting post:', error); // Log the error
        next(error); // Pass errors to the error-handling middleware
    }
});

// Users routes
app.get('/users', (req, res, next) => {
    try {
        res.json(users); // Serve mock user data
    } catch (error) {
        next(error); // Pass errors to the error-handling middleware
    }
});

app.get('/users/:id', (req, res, next) => {
    try {
        const { id } = req.params;
        const user = users.find(user => user.id === parseInt(id, 10));
        if (user) {
            const userPosts = posts.filter(post => post.userId === user.id);
            const userPostsWithComments = userPosts.map(post => {
                const postComments = comments.filter(comment => comment.postId === post.id);
                return { ...post, comments: postComments };
            });

            res.json({ ...user, posts: userPostsWithComments });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error); // Pass errors to the error-handling middleware
    }
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});