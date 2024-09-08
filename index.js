const express = require('express');
const path = require('path');
const app = express();
const port = 4004;

// Import mock data
const { users, posts, comments } = require('./mockData');

// Set up EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON bodies and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// First custom middleware  to log requests
function logRequests(req, res, next) {
    console.log(`${req.method} request for ${req.url}`);
    next();
}

// Second custom middleware: validate post data
function validatePostData(req, res, next) {
    const { title, body } = req.body;
    if (!title || !body) {
        return res.status(400).json({ message: 'Title and body are required' });
    }
    next();
}

// Use the logging and validation middleware
app.use(logRequests);

// Routes

// Render favorites page using EJS
app.get('/favorites', (req, res) => {
    res.render('favorites', { posts });
});

// Get all posts, with optional query filtering
app.get('/posts', (req, res, next) => {
    try {
        const { userId, limit } = req.query;
        let filteredPosts = posts.slice(0, parseInt(limit, 10) || 10);

        if (userId) {
            filteredPosts = filteredPosts.filter(post => post.userId === parseInt(userId, 10));
        }

        const postsWithComments = filteredPosts.map(post => {
            const postComments = comments.filter(comment => comment.postId === post.id);
            return { ...post, comments: postComments };
        });

        res.json(postsWithComments);
    } catch (error) {
        next(error);
    }
});

// Get a specific post by ID with comments
app.get('/posts/:id', (req, res, next) => {
    try {
        const { id } = req.params;
        const post = posts.find(post => post.id === parseInt(id, 10));
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const postComments = comments.filter(comment => comment.postId === post.id);
        res.json({ ...post, comments: postComments });
    } catch (error) {
        next(error);
    }
});

// Create a new post (using validation middleware)
app.post('/posts', validatePostData, (req, res, next) => {
    try {
        const newPost = req.body;
        newPost.id = posts.length > 0 ? Math.max(...posts.map(post => post.id)) + 1 : 1;
        posts.push(newPost);
        res.status(201).json(newPost);
    } catch (error) {
        next(error);
    }
});

// Update a post by ID
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
        next(error);
    }
});

// Delete a post by ID
app.delete('/posts/:id', (req, res, next) => {
    try {
        const { id } = req.params;
        const index = posts.findIndex(post => post.id === parseInt(id, 10));

        if (index !== -1) {
            posts.splice(index, 1);
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        next(error);
    }
});

// Render comments for a specific post using EJS
app.get('/posts/:id/comments', (req, res, next) => {
    try {
        const { id } = req.params;
        const post = posts.find(post => post.id === parseInt(id, 10));

        if (!post) return res.status(404).json({ message: 'Post not found' });

        const postComments = comments.filter(comment => comment.postId === post.id);
        res.render('comments', { post, postComments });
    } catch (error) {
        next(error);
    }
});

// Get all users
app.get('/users', (req, res, next) => {
    try {
        res.json(users);
    } catch (error) {
        next(error);
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
