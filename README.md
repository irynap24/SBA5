Bunny Blog Overview

Bunny Blog is a web application built with Express.js and EJS that allows users to create, view, update, and delete posts. It features a simple interface to manage posts and comments, and includes a form to create new posts. The web application also comes with mock data, including 3 posts that are always available under the /favorites route. Each post displays a title and body, with the option to view comments associated with a specific post.

Features:

View Posts: Displays a list of all posts with titles and bodies.
Create Posts: Add new posts via a form on the root page.
Delete Posts: Remove posts from the list.
NOTE:
When testing the delete functionality, create a new post and delete that instead of deleting the mock data posts, makes it
easier than restarting the server to reload the mock data.

Edit Posts: Edit existing posts by using a PATCH request. 
View Comments: See comments associated with each post.
Error Handling: Handles errors and provides user feedback.
Cancel: Exits out of post editor form.
Save Changes: Saves updated changes to post

Routes:
POST /posts: Creates a new post with the provided title and body.
DELETE /posts/
: Deletes a post specified by its ID.
PATCH /posts/
: Updates an existing post specified by its ID.
GET /posts/
/comments: Displays comments for a specific post.
GET /favorites: Shows a detailed view of posts and their com
