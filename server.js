const express = require('express');
const path = require('path');
const app = express();
const port = 4000;

// Mock data for users, posts, and comments
const users = [
    { id: 1, name: 'Sunny ', email: 'sunny@apples.com' },
    { id: 2, name: 'Cloud ', email: 'cloud@bananas.com' },
    { id: 3, name: 'Casper ', email: 'casper@parsley.com' }
];

const posts = [
    {
        id: 1, userId: 1, title: 'Attempted Grooming', body: 'Today, my human tried to GRAB me. I was peacefully napping when all of a sudden, I feel hands on me! I cant believe she would ever attempt such a thing! Id rather be hopping around or munching on treats, not sitting still for a brushing!🍏🌟 #GroomingGrump #FluffyStruggles'
    },
    { id: 2, userId: 1, title: 'Carrot Dreams and Cozy Naps', body: 'Hello, bunny buddies! 🥕✨ Ever dream of a giant carrot just for you? I do! But until then, lets enjoy our cozy burrows and a good nap. Sweet dreams, and may your day be as delightful as a sunny patch of clover! 🌸💤 #BunnyDreams #CozyCuddles' },
    {
        id: 3, userId: 2, title: 'Parsley, my love', body: 'Hello, herb enthusiasts! 🐰🥳 Todays treat: PARSLEY! Its not just a garnish—its a bunnys delight! Crunchy, fresh, and oh-so-green, parsley is packed with nutrients and makes for a pawsitively delicious snack. Just a nibble here and there, and were hopping with joy! 🥗✨ #ParsleyLove #BunnyBites'
    },
];

const comments = [
    { id: 1, postId: 1, body: 'I cant believe this!!!😠✂️' },
    { id: 2, postId: 2, body: 'Sweet dreams and crunchy snacks!😴💚' },
    { id: 3, postId: 3, body: '🐰💚 #ParsleyParty.' },
];

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.static('public')); // Serve static files from the 'public' directory

// Custom middleware to log requests
function logRequests(req, res, next) {
    console.log(`${req.method} request for ${req.url}`);
    next();
}

// Use the logging middleware for all routes
app.use(logRequests);


// Favorites page route to display all posts and create new posts
app.get('/favorites', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Favorites Page</title>
            <link rel="stylesheet" href="/favorites.css">
        </head>
        <body>
            <h1>All Posts</h1>
            <ul>
                ${posts.map(post => `
                    <li>
                        <h2>${post.title}</h2>
                        <p>${post.body}</p>
                        <a href="/posts/${post.id}/comments">View Comments</a>
                    </li>
                `).join('')}
            </ul>
            <h2>Create a New Post</h2>
            <form action="/posts" method="POST">
                <label for="title">Title:</label>
                <input type="text" id="title" name="title" required>
                <br>
                <label for="body">Body:</label>
                <textarea id="body" name="body" required></textarea>
                <br>
                <button type="submit">Create Post</button>
            </form>
            <a href="/">Back to Home Page</a>
        </body>
        </html>
    `);
});

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

// Comments route to view comments for a specific post
app.get('/posts/:id/comments', (req, res, next) => {
    try {
        const { id } = req.params;
        const postId = parseInt(id, 10); // Convert ID to integer
        const post = posts.find(post => post.id === postId);

        if (post) {
            const postComments = comments.filter(comment => comment.postId === postId);
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Post Comments</title>
                    <link rel="stylesheet" href="/styles.css">
                </head>
                <body>
                    <h1>Comments for Post ${postId}</h1>
                    <h2>${post.title}</h2>
                    <p>${post.body}</p>
                    <ul>
                        ${postComments.map(comment => `
                            <li>${comment.body}</li>
                        `).join('')}
                    </ul>
                    <a href="/">Back to Home Page</a>
                </body>
                </html>
            `);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
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