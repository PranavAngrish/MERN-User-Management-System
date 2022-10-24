const router = require('express').Router()
const tasksController = require('../controllers/task')
const requireAuth = require('../middleware/requireAuth')
const requireRoles = require('../middleware/requireRoles')
const ROLES_LIST = require('../config/rolesList')

router.use(requireAuth)
router.use(requireRoles([...Object.values(ROLES_LIST)]))

router.route('/')
    .get(tasksController.getAll)
    .post(tasksController.create)
    .patch(tasksController.update)
    .delete(tasksController.delete)

module.exports = router