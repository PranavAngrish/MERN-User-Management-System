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

router.route('/:id')
    .get(notesController.getById)
    .patch(notesController.update)
    .delete(notesController.delete)

router.route('/admin')
    .post(requireRoles([ROLES_LIST.Root, ROLES_LIST.Admin]), notesController.adminGetAll)

module.exports = router