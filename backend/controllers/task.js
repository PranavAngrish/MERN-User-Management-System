const mongoose = require('mongoose')
const Task = require('../models/task')
const validator = require('validator')
const ROLES_LIST = require('../config/rolesList')

exports.getAll = async (req, res) => {
  const user_id = req.user._id

  const tasks = await Task.find({user_id}).sort({createdAt: -1}).lean()
  if (!tasks?.length) return res.status(400).json({ error: 'No tasks record found' })

  res.status(200).json(tasks)
}

exports.adminGetAll = async (req, res) => {
  const admin_id = req.user._id
  const user_id = req.body.id

  if(!user_id && (admin_id == user_id)) return res.status(400).json({ error: 'User id not found' })
  if (!mongoose.Types.ObjectId.isValid(user_id)) return res.status(404).json({error: 'No such task id found'})

  const tasks = await Task.find({user_id: user_id}).sort({createdAt: -1}).lean()
  if (!tasks?.length) return res.status(400).json({ error: 'No tasks record found' })

  res.status(200).json(tasks)
}

exports.getById = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No such task id found'})

  const task = await Task.findById(id).lean().exec()
  if (!task) return res.status(404).json({error: 'No such task record found'})

  res.status(200).json(task)
}

exports.create = async (req, res) => {
  const {title, description, status} = req.body

  const isTitleEmpty = validator.isEmpty(title ?? "", { ignore_whitespace:true })
  const isDescriptionEmpty = validator.isEmpty(description ?? "", { ignore_whitespace:true })
  const isStatusEmpty = validator.isEmpty(status ?? "", { ignore_whitespace:true })
  if (isTitleEmpty || isDescriptionEmpty || isStatusEmpty) return res.status(400).json({ error: 'All fields must be filled'})

  try {
    const userId = req.user._id
    const targetUserId = req.body.id // user id that Admin use to update user record
    let idToCreate = userId
    if(targetUserId && (userId !== targetUserId) && (req.roles == ROLES_LIST.Admin)){
      idToCreate = targetUserId
    }
    const task = await Task.create({ title, description, status, user_id: idToCreate })
    res.status(201).json(task)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.update = async (req, res) => {
  const { id } = req.params
  
  const isIdEmpty = validator.isEmpty(id, { ignore_whitespace:true })
  if (isIdEmpty) return res.status(400).json({error: 'Task id required'})
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: 'No such task id found'})

  const task = await Task.findOneAndUpdate({_id: id}, {...req.body }).lean().exec()
  if (!task) return res.status(400).json({error: 'No such task record found'})
  
  //after update return new record
  const userId = req.user._id //normal record update id (user id/admin id) 
  const targetUserId = req.body.id // user id that Admin use to update user record
  let idToUpdate = userId
  if(targetUserId && (userId !== targetUserId) && (req.roles == ROLES_LIST.Admin)){
    idToUpdate = targetUserId
  }
  const updatedRecord = await Task.find({user_id: idToUpdate}).sort({createdAt: -1}).lean()
  console.log(updatedRecord)
  res.status(200).json(updatedRecord)
}

exports.delete = async (req, res) => {
  const { id } = req.params

  const isIdEmpty = validator.isEmpty(id, { ignore_whitespace:true })
  if (isIdEmpty) return res.status(400).json({error: 'Task id required'})
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: 'No such task id found'})

  const task = await Task.findByIdAndDelete(id).lean().exec()
  if(!task) return res.status(400).json({error: 'No such task record found'})

  res.status(200).json(task)
}