const router = require('express').Router()
const usersController = require('../controllers/user')
const requireAuth = require('../middleware/requireAuth')

router.use(requireAuth)

router.route('/')
    .get(usersController.getAll)
    .post(usersController.create)
    .patch(usersController.update)

router.route('/:id')
    .delete(usersController.delete)

module.exports = router