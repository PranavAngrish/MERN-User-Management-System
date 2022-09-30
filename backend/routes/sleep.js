const router = require('express').Router()
const sleepController = require('../controllers/sleep')
const requireAuth = require('../middleware/requireAuth')

router.use(requireAuth)
router.get('/', sleepController.getSleeps)
router.get('/:id', sleepController.getSleep)
router.post('/', sleepController.createSleep)
router.delete('/:id', sleepController.deleteSleep)
router.patch('/:id', sleepController.updateSleep)

module.exports = router