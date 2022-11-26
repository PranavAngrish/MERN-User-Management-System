const mongoose = require('mongoose')
const Note = require('../models/Note')
const validator = require('validator')
const ROLES_LIST = require('../config/rolesList')

exports.getAll = async (req, res) => {
  const user_id = req.user._id

  const notes = await Note.find({user_id}).sort({createdAt: -1}).lean()
  if (!notes?.length) return res.status(400).json({ error: 'No notes record found' })

  res.status(200).json(notes)
}

exports.adminGetAll = async (req, res) => {
  const admin_id = req.user._id
  const user_id = req.body.id

  if(!user_id && (admin_id == user_id)) return res.status(400).json({ error: 'User id not found' })
  if (!mongoose.Types.ObjectId.isValid(user_id)) return res.status(404).json({error: 'No such note id found'})

  const notes = await Note.find({user_id: user_id}).sort({createdAt: -1}).lean()
  if (!notes?.length) return res.status(400).json({ error: 'No notes record found' })

  res.status(200).json(notes)
}

exports.getById = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No such note id found'})

  const note = await Note.findById(id).lean().exec()
  if (!note) return res.status(404).json({error: 'No such note record found'})

  res.status(200).json(note)
}

exports.create = async (req, res) => {
  const { title, text } = req.body

  try {
    const isTitleEmpty = validator.isEmpty(title ?? "", { ignore_whitespace:true })
    if (isTitleEmpty) throw Error('Title required')
    
    const isTextEmpty = validator.isEmpty(text ?? "", { ignore_whitespace:true })
    if (isTextEmpty) throw Error('Body required')

    const userId = req.user._id
    const targetUserId = req.body.id // user id that Admin use to update user record
    let idToCreate = userId
    
    if(targetUserId && (userId !== targetUserId) && (req.roles == ROLES_LIST.Admin)){
      idToCreate = targetUserId
    }

    const notes = await Note.create({ title, text, user_id: idToCreate })
    res.status(201).json(notes)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.update = async (req, res) => {
  const { id } = req.params
  const { title, text } = req.body

  const isTitleEmpty = validator.isEmpty(title ?? "", { ignore_whitespace:true })
  if (isTitleEmpty) return res.status(400).json({error: 'Title required'})

  const isTextEmpty = validator.isEmpty(text ?? "", { ignore_whitespace:true })
  if (isTextEmpty) return res.status(400).json({error: 'Body required'})
  
  const isIdEmpty = validator.isEmpty(id, { ignore_whitespace:true })
  if (isIdEmpty) return res.status(400).json({error: 'Note id required'})
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: 'No such note id found'})

  const userId = req.user._id //normal record update id (user id/admin id) 
  const targetUserId = req.body.id //user id that Admin use to update user record
  let idToUpdate = userId
  if(targetUserId && (userId !== targetUserId) && (req.roles == ROLES_LIST.Admin)){
    idToUpdate = targetUserId
  }
  
  const notes = await Note.findOneAndUpdate({_id: id}, {...req.body }).lean().exec()
  if (!notes) return res.status(400).json({error: 'No such note record found'})
  
  //after update return new record
  const updatedRecord = await Note.find({user_id: idToUpdate}).sort({createdAt: -1}).lean()
  res.status(200).json(updatedRecord)
}

exports.delete = async (req, res) => {
  const { id } = req.params

  const isIdEmpty = validator.isEmpty(id, { ignore_whitespace:true })
  if (isIdEmpty) return res.status(400).json({error: 'Note id required'})
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: 'No such note id found'})

  const note = await Note.findByIdAndDelete(id).lean().exec()
  if(!note) return res.status(400).json({error: 'No such note record found'})

  res.status(200).json(note)
}