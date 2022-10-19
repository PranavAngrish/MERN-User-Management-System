const mongoose = require('mongoose')
const User = require('../models/User')
const Note = require('../models/Note')
const bcrypt = require('bcrypt')
const validator = require('validator')

exports.getAll = async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) return res.status(400).json({ error: 'No users found' })
    res.status(200).json(users)
}

exports.create = async (req, res) => {
    const { name, password, roles } = req.body

    const isNameEmpty = validator.isEmpty(name, { ignore_whitespace:true })
    const isEmailEmpty = validator.isEmpty(email, { ignore_whitespace:true })
    const isPasswordEmpty = validator.isEmpty(password, { ignore_whitespace:true })

    if (isNameEmpty || isEmailEmpty || isPasswordEmpty) return res.status(400).json({ error: 'All fields must be filled'})
    if (!validator.isEmail(email)) return res.status(400).json({ error: 'Email not valid'})
    if (!validator.isStrongPassword(password)) return res.status(400).json({ error: 'Password not strong enough'})

    const exists = await this.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec()
    if(!exists) res.status(409).json({error: "Email already in use"})

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const userWithRole = { name: name.trim(), email: email.trim(), password: hash, roles }
    const userWithoutRole = { name: name.trim(), email: email.trim(), password: hash }
    const userSetting = (!Array.isArray(roles) || !roles.length) ? userWithoutRole : userWithRole
    const user = await User.create(userSetting)

    if (user) {
        res.status(201).json({ error: `New user ${name} created` })
    } else {
        res.status(400).json({ error: 'Invalid user data received' })
    }
}

exports.update = async (req, res) => {
    const { id, name, email, password, roles, active } = req.body

    const isIdEmpty = validator.isEmpty(id, { ignore_whitespace:true })
    if (isIdEmpty) return res.status(400).json({error: 'User id required'})
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: 'No such user id found'})
    
    const checkUser = await User.findById(id).exec()
    if (!checkUser) return res.status(400).json({ error: 'User not found' })

    if(email){
        if(!validator.isEmail(email)) return res.status(400).json({ error: 'Email not valid'})

        const duplicateEmail = await User.findOne({ email: req.body?.email }).collation({ locale: 'en', strength: 2 }).lean().exec()
        if (duplicateEmail && duplicateEmail?._id.toString() !== id) return res.status(409).json({ error: 'Email already in use' })
    }

    if(password){if(!validator.isStrongPassword(password)) return res.status(400).json({ error: 'Password not strong enough'})}
    if(roles){if (!Array.isArray(roles) || !roles.length) return res.status(400).json({ error: 'Invalid data type received' })}
    if(active){if(typeof active !== 'boolean') return res.status(400).json({ error: 'Invalid data type received' })}

    const user = await User.findOneAndUpdate({_id: id}, {...req.body}).lean().exec()
    if (!user) return res.status(400).json({error: 'Something went wrong, during update'})

    // res.status(200).json(`${updatedUser.name} details updated`)
    const users = await User.find().select('-password').lean()
    res.status(200).json(users)
}

exports.delete = async (req, res) => {
    const { id } = req.params

    const isIdEmpty = validator.isEmpty(id, { ignore_whitespace:true })
    if (isIdEmpty) return res.status(400).json({error: 'User id required'})
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: 'No such user id found'})

    // const note = await Note.findOne({ user: id }).lean().exec()
    // if (note) return res.status(400).json({ error: 'User has assigned notes' })

    const user = await User.findByIdAndDelete(id).lean().exec()
    if (!user) return res.status(400).json({ error: 'User not found' })

    // const reply = `User ${user.name} with ID ${user._id} deleted`
    res.status(200).json(user)
}
