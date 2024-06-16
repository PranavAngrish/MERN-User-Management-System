const mongoose = require('mongoose')
const User = require('../models/user/User')

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('New user connected:', socket.id)

    const updateUserStatus = async (userId, isOnline) => {
      if (!mongoose.Types.ObjectId.isValid(userId)) return new Error('No such user id found')
      
      await User.findByIdAndUpdate(
        { _id: userId },
        { $set: { isOnline, lastActive: new Date() } },
        { new: true }
      ).select('-password -otp').lean()

      const users = await User.find().sort({ isOnline: -1, lastActive: -1 }).select('-password -otp').lean()
      updateAdminUserList(users)
    }

    const updateAdminUserList = (users) => {
      io.emit('adminUpdateUserList', users)
    }

    socket.on('online', async () => {
      await updateUserStatus(socket.userId, true)
    })

    socket.on('disconnect', async () => {
      console.log("user disconnect", socket.userId)
      await updateUserStatus(socket.userId, false)
    })

    socket.on('setUserId', (userId) => {
      socket.userId = userId
    })
  })
}
  
module.exports = setupSocket