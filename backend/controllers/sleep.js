const mongoose = require('mongoose')
const Sleep = require('../models/sleep')
const validator = require('validator')

exports.getAll = async (req, res) => {
  const user_id = req.user._id

  const sleeps = await Sleep.find({user_id}).sort({createdAt: -1}).lean()
  if (!sleeps?.length) return res.status(400).json({ error: 'No sleeps record found' })

  res.status(200).json(sleeps)
}

exports.adminGetAll = async (req, res) => {
  const admin_id = req.user._id
  const user_id = req.body.id
  const {id} = req.body

  if(!user_id && (admin_id == user_id)) return res.status(400).json({ error: 'User id not found' })
  if (!mongoose.Types.ObjectId.isValid(user_id)) return res.status(404).json({error: 'No such sleep id found'})

  const sleeps = await Sleep.find({user_id: user_id}).sort({createdAt: -1}).lean()
  if (!sleeps?.length) return res.status(400).json({ error: 'No sleeps record found' })

  res.status(200).json(sleeps)
}

exports.getById = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'No such sleep id found'})

  const sleep = await Sleep.findById(id).lean().exec()
  if (!sleep) return res.status(404).json({error: 'No such sleep record found'})

  res.status(200).json(sleep)
}

exports.create = async (req, res) => {
  const {title, load, reps} = req.body

  let emptyFields = []

  if (!title) {
    emptyFields.push('title')
  }

  if (!load) {
    emptyFields.push('load')
  }

  if (!reps) {
    emptyFields.push('reps')
  }
  
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all fields', emptyFields })
  }

  try {
    const user_id = req.user._id
    const sleep = await Sleep.create({ title, load, reps, user_id })
    res.status(201).json(sleep)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.update = async (req, res) => {
  const { id } = req.params
  
  const isIdEmpty = validator.isEmpty(id, { ignore_whitespace:true })
  if (isIdEmpty) return res.status(400).json({error: 'Sleep id required'})
  
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: 'No such sleep id found'})

  const sleep = await Sleep.findOneAndUpdate({_id: id}, {...req.body }).lean().exec()
  if (!sleep) return res.status(400).json({error: 'No such sleep record found'})
  
  // res.status(200).json(sleep)
  //after update return new record
  const user_id = req.user._id
  const updatedRecord = await Sleep.find({user_id}).sort({createdAt: -1}).lean()
  res.status(200).json(updatedRecord)
}

exports.delete = async (req, res) => {
  const { id } = req.params

  const isIdEmpty = validator.isEmpty(id, { ignore_whitespace:true })
  if (isIdEmpty) return res.status(400).json({error: 'Sleep id required'})
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: 'No such sleep id found'})

  const sleep = await Sleep.findByIdAndDelete(id).lean().exec()
  if(!sleep) return res.status(400).json({error: 'No such sleep record found'})

  res.status(200).json(sleep)
}