const mongoose = require('mongoose')
const User = require('../models/user/User')
const ROLES_LIST = require('../config/rolesList')

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    // console.log('New user connected:', socket.id)

    const updateUserStatus = async (isOnline) => {
      if (!mongoose.Types.ObjectId.isValid(socket.userId)) return new Error('No such user id found')

      await User.findByIdAndUpdate(
        { _id: socket.userId },
        { $set: { isOnline, lastActive: new Date() } },
        { new: true }
      ).select('-password -otp').lean()

      const query = {
        $or: [
            { roles: ROLES_LIST.User },
            { _id: socket.adminId }
        ],
        roles: { $ne: ROLES_LIST.Root }
      }

      const users = await User.find(query).sort({ isOnline: -1, lastActive: -1 }).select('-password -otp').lean()
      updateAdminUserList(socket.adminId, users)
    }

    const updateAdminUserList = (adminId, users) => {
      socket.to(adminId.toString()).emit('adminUpdateUserList', users)
    }

    socket.on('online', async (userId) => {
      if (!mongoose.Types.ObjectId.isValid(userId)) return new Error('No such user id found')
 
      const user = await User.findById(userId).select('_id roles').lean().exec()

      if(user.roles.includes(ROLES_LIST.Admin)){
        socket.adminId = user._id
        socket.join(user._id.toString())
      }

      socket.userId = userId

      await updateUserStatus(true)
    })

    socket.on('disconnect', async () => {
      // console.log('user disconnect', socket.userId)
      await updateUserStatus(false)
    })
  })
}
  
module.exports = setupSocket