const Users = require('../users/users-model')

function logger(req, res, next) {
  console.log(`Request Method: ${req.method}`)
  console.log(`Request URL: ${req.url}`)
  console.log(Date())
  next()
}

function validateUserId(req, res, next) {
  const { id } = req.params
  Users.getById(id)
    .then(user => {
      if (user) {
        req.user = user
        next()
      } else {
        next({ message: 'user not found', status: 404 })
      }
    })
    .catch(err => {
      next(err)
    })
}

function validateUser(req, res, next) {
  const { name } = req.body
  if (name.trim() !== '' && name) {
    next()
  } else {
    next({
      message: "missing required name field",
      status: 400
    })
  }
}

function validatePost(req, res, next) {
  const { text } = req.body
  if (text) {
    next()
  } else {
    next({
      message: "missing required text field",
      status: 400
    })
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}