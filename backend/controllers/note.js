const mongoose = require('mongoose')
const Note = require('../models/Note')
const User = require('../models/User')
const validator = require('validator')

exports.getAll = async (req, res) => {
    const notes = await Note.find().lean()
    if (!notes?.length) return res.status(400).json({ error: 'No notes found' })

    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, name: user.name }
    }))

    res.status(201).json(notesWithUser)
}

exports.create = async (req, res) => {
    const { user, title, text } = req.body

    const isTitleEmpty = validator.isEmpty(title, { ignore_whitespace:true })
    const isTextEmpty = validator.isEmpty(text, { ignore_whitespace:true })

    if (!user || isTitleEmpty || isTextEmpty) return res.status(400).json({ error: 'All fields must be filled' })

    const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()
    if (duplicate) return res.status(409).json({ error: 'Duplicate note title' })

    const note = await Note.create({ user, title, text })

    if (note) {
        return res.status(201).json({ error: 'New note created' })
    } else {
        return res.status(400).json({ error: 'Invalid note data received' })
    }

}

exports.update = async (req, res) => {
    const { id, user, title, text, completed } = req.body

    const isIdEmpty = validator.isEmpty(id, { ignore_whitespace:true })
    const isTitleEmpty = validator.isEmpty(title, { ignore_whitespace:true })
    const isTextEmpty = validator.isEmpty(text, { ignore_whitespace:true })

    // Confirm data
    if (isIdEmpty || !user || isTitleEmpty || isTextEmpty || typeof completed !== 'boolean'){
        return res.status(400).json({ error: 'All fields must be filled' })
    }
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: 'No such note id found'})

    const note = await Note.findById(id).exec()
    if (!note) return res.status(400).json({ error: 'Note not found' })

    const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()
    if (duplicate && duplicate?._id.toString() !== id) return res.status(409).json({ error: 'Duplicate note title' })

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()
    res.status(201).json(`${updatedNote.title} updated`)
}

exports.delete = async (req, res) => {
    const { id } = req.body

    const isIdEmpty = validator.isEmpty(id, { ignore_whitespace:true })
    if (isIdEmpty) return res.status(400).json({error: 'Note id required'})
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: 'No such note id found'})

    const note = await Note.findByIdAndDelete(id).lean().exec()
    if (!note) return res.status(400).json({ error: 'Note not found' })

    const reply = `Note '${result.title}' with ID ${result._id} deleted`
    res.status(201).json(reply)
}