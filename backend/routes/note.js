const router = require('express').Router()
const notesController = require('../controllers/note')
const requireAuth = require('../middleware/requireAuth')
const requireRoles = require('../middleware/requireRoles')
const ROLES_LIST = require('../config/rolesList')

router.use(requireAuth)
router.use(requireRoles([...Object.values(ROLES_LIST)]))

router.route('/')
    .get(notesController.getAll)
    .post(notesController.create)
    .patch(notesController.update)
    .delete(notesController.delete)

module.exports = router