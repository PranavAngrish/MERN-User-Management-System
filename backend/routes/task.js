const router = require('express').Router()
const tasksController = require('../controllers/task')
const requireAuth = require('../middleware/requireAuth')
const requireRoles = require('../middleware/requireRoles')
const ROLES_LIST = require('../config/rolesList')

router.use(requireAuth)
router.use(requireRoles([...Object.values(ROLES_LIST)]))

router.route('/')
    .get(tasksController.getAll)
    .post(requireRoles([ROLES_LIST.Root, ROLES_LIST.Admin]), tasksController.create)

router.route('/:id')
    .get(tasksController.getById)
    .patch(requireRoles([ROLES_LIST.Root, ROLES_LIST.Admin]), tasksController.update)
    .delete(requireRoles([ROLES_LIST.Root, ROLES_LIST.Admin]), tasksController.delete)

module.exports = router