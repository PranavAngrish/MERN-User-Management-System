const router = require('express').Router()
const sleepController = require('../controllers/sleep')
const requireAuth = require('../middleware/requireAuth')

router.use(requireAuth)

router.route('/')
    .get(sleepController.getAll)
    .post(sleepController.create)

router.route('/:id')
    .get(sleepController.getById)
    .patch(sleepController.update)
    .delete(sleepController.delete)

module.exports = router