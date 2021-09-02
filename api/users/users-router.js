const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
const Users = require('./users-model')
const Posts = require('../posts/posts-model')
// The middleware functions also need to be required
const { validateUserId, validateUser, validatePost } = require('../middleware/middleware')

const router = express.Router();

router.get('/', (req, res) => {
  Users.get()
    .then(users => {
      if (users.length<1) {
        res.status(500).json({
          message: "failed to get users"
        })
      } else {
        res.status(200).json(users)
      }
    })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
});

router.post('/', validateUser, (req, res, next) => {
  const { body } = req
  Users.insert(body)
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(next)
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  Users.update(req.user.id, req.body)
    .then(updatedUser => {
      res.status(200).json(updatedUser)
    })
    .catch(next)
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete('/:id', validateUserId, (req, res, next) => {
  const { id } = req.params
  Users.remove(id)
    .then(() => {
      res.status(200).json(req.user)
    })
    .catch(err => {
      next(err)
    })
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  const { id } = req.params
  Users.getUserPosts(id)
    .then(postsAmount => {
      res.status(200).json(postsAmount)
    })
    .catch(err => {
      next(err)
    })
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
});

router.post('/:id/posts', validateUserId, validatePost, (req, res, next) => {
  const { id } = req.params
  Posts.insert({
    text: req.text,
    user_id: id
  })
    .then(result => {
      res.status(201).json(result)
    })
    .catch(next)
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.use((err, req, res, next) => {
  console.log(err.message)
  res.status(err.status || 500).json({
    message: err.message,
    customMessage: "Failed to make it past the User router"
  })
})

// do not forget to export the router
module.exports = router
