const router = require('express').Router()
const notesController = require('../controllers/note')
const requireAuth = require('../middleware/requireAuth')

router.use(requireAuth)

router.route('/')
    .get(notesController.getAll)
    .post(notesController.create)
    .patch(notesController.update)
    .delete(notesController.delete)

module.exports = router