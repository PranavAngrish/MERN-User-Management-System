const router = require('express').Router()
const sleepController = require('../controllers/sleep')
const requireAuth = require('../middleware/requireAuth')

router.use(requireAuth)

router.route('/')
    .get(sleepController.getSleeps)
    .post(sleepController.createSleep)

router.route('/:id')
    .get(sleepController.getSleep)
    .delete(sleepController.deleteSleep)
    .patch(sleepController.updateSleep)

module.exports = router