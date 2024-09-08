Bunny Blog Overview
Bunny Blog is a web application built with Express.js and EJS that allows users to create, view, update, and delete posts. It features a simple interface to manage posts and comments, and a form to create new posts. The web application includes a pre-built array of mock data found in the /favorites route which includes 3 posts with a title and body, where users can click "view comments" under each post to see view page of the post and the comments associated with that specific post.

Features
View Posts: Display a list of all posts with titles and bodies.
Create Posts: Add new posts via a form on the root page.
Delete Posts: Remove posts from the list.

---

dont delete the existing posts that come from mock data as you would have to change something in the string of the mock data file to bring it back, create a test post and delete it

---

View Comments: See comments associated with each post.
Error Handling: Handles errors and provides user feedback.
Routes

POST /posts - Creates a new post with the provided title and body.
DELETE /posts/:id - Deletes a post specified by its ID.
GET /posts/:id/comments - Displays comments for a specific post.
GET /favorites - Shows a detailed view of posts and their comments.
