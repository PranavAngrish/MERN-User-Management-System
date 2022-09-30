const mongoose = require('mongoose')
const Sleep = require('../models/sleep')

exports.getSleeps = async (req, res) => {
  const user_id = req.user._id
  const sleeps = await Sleep.find({user_id}).sort({createdAt: -1})
  res.status(200).json(sleeps)
}

exports.getSleep = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such sleep'})
  }

  const sleep = await Sleep.findById(id)

  if (!sleep) {
    return res.status(404).json({error: 'No such sleep'})
  }

  res.status(200).json(sleep)
}

exports.createSleep = async (req, res) => {
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
    res.status(200).json(sleep)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.deleteSleep = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such sleep'})
  }

  const sleep = await Sleep.findByIdAndDelete(id)

  if(!sleep) {
    return res.status(400).json({error: 'No such sleep'})
  }

  res.status(200).json(sleep)

}

exports.updateSleep = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such sleep'})
  }

  const sleep = await Sleep.findOneAndUpdate({_id: id}, {
    ...req.body
  })

  if (!sleep) {
    return res.status(400).json({error: 'No such sleep'})
  }

  res.status(200).json(sleep)

}