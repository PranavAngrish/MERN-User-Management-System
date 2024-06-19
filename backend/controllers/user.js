const mongoose = require('mongoose')
const validator = require('validator')
const Note = require('../models/Note')
const User = require('../models/user/User')
const ROLES_LIST = require('../config/rolesList')
const bcrypt = require('bcrypt')

const options = { host_whitelist: ['gmail.com', 'yahoo.com', 'outlook.com'] }

exports.getAll = async (req, res) => {
    let users
    if(req.roles == "Root"){
        users = await User.find().sort({ isOnline: -1, lastActive: -1 }).select('-password').lean()
    }else{
        // const adminItSelf = await User.findById(req.user._id).lean().exec()
        // users = await User.find({$and: [{'roles': {$ne: ROLES_LIST.Root}}, {'roles': {$ne: ROLES_LIST.Admin}}]}).sort({ isOnline: -1, lastActive: 1 }).select('-password').lean()
        // users.unshift(adminItSelf)
        const query = {
            $or: [
                { roles: ROLES_LIST.User },
                { _id: req.user._id }
            ],
            roles: { $ne: ROLES_LIST.Root }
        }
        users = await User.find(query).sort({ isOnline: -1, lastActive: -1 }).select('-password').lean()
    }
    
    if (!users?.length) return res.status(400).json({ error: 'No users found' })
    res.status(200).json(users)
}

exports.create = async (req, res) => {
    const { name, email, password, roles, active } = req.body

    const isNameEmpty = validator.isEmpty(name ?? "", { ignore_whitespace:true })
    const isEmailEmpty = validator.isEmpty(email ?? "", { ignore_whitespace:true })
    const isPasswordEmpty = validator.isEmpty(password ?? "", { ignore_whitespace:true })

    if (isNameEmpty || isEmailEmpty || isPasswordEmpty) return res.status(400).json({ error: 'All fields must be filled'})
    if (!validator.isEmail(email, options)) return res.status(400).json({ error: 'Email not valid'})
    if (!validator.isStrongPassword(password)) return res.status(400).json({ error: 'Password not strong enough'})
    if(roles){if (!Array.isArray(roles) || !roles.length) return res.status(400).json({ error: 'Invalid roles data type received' })}
    if(active){if(typeof active !== 'boolean') return res.status(400).json({ error: 'Invalid active data type received' })}

    const duplicateEmail = await User.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec()
    if(duplicateEmail) return res.status(409).json({error: "Email already in use"})

    const hashedPassword  = await bcrypt.hash(password, 10)

    if(roles == ROLES_LIST.Admin) return res.status(400).json({error: 'Not authorized to create admin'})

    const createUser = { name: name.trim(), email: email.trim(), password: { hashed: hashedPassword }, roles: roles ?? [ROLES_LIST.User], active: active ?? true}
    const user = await User.create(createUser)

    user ?  res.status(201).json({name: user.name, email, roles: user.roles, active: user.active}) : res.status(400).json({ error: 'Invalid user data received' })
}

exports.update = async (req, res) => {
    try {
        const { id, name, email, roles, active } = req.body
    
        const isIdEmpty = validator.isEmpty(id ?? "", { ignore_whitespace:true })
        const isNameEmpty = validator.isEmpty(name ?? "", { ignore_whitespace:true })
        if (isIdEmpty) return res.status(400).json({error: 'User id required'})
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: 'No such user id found'})
        
        const checkUser = await User.findById(id).exec()
        if (!checkUser) return res.status(400).json({ error: 'User not found' })
    
        const updateFields = {}
    
        if(isNameEmpty) { updateFields.name = name }
    
        if(email){
            if(!validator.isEmail(email, options)) return res.status(400).json({ error: 'Email not valid'})
            const duplicateEmail = await User.findOne({ email:email }).collation({ locale: 'en', strength: 2 }).lean().exec()
            if (duplicateEmail && duplicateEmail?._id.toString() !== id) return res.status(409).json({ error: 'Email already in use' })
            updateFields.email = email
        }
    
        if(req.body.password){
            if(!validator.isStrongPassword(req.body.password)) return res.status(400).json({ error: 'Password not strong enough' })
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            updateFields.password = { hashed: hashedPassword, errorCount: 0}
        }
    
        if(roles){
            if (!Array.isArray(roles) || !roles.length) return res.status(400).json({ error: 'Invalid roles data type received' })
            updateFields.roles = roles
        }

        if(typeof active === 'boolean'){
            active ? Object.assign(updateFields, { active: true, password: { hashed: checkUser.password.hashed, errorCount: 0 }, otp: { requests: 0, errorCount: 0 }}) : Object.assign(updateFields, { active: false, isOnline: false})
        }
    
        const rootUser = await User.findById(id).lean().exec()
        if(rootUser.roles == "Root") return res.status(400).json({error: 'Not authorized to edit this user'})
        if(req.roles == ROLES_LIST.Admin && rootUser.roles == ROLES_LIST.Admin) return res.status(400).json({error: 'Not authorized to edit this user'})

        const updatedUser = await User.findByIdAndUpdate(id, { $set: updateFields }, { new: true, runValidators: true }).lean().exec()
        if (!updatedUser) return res.status(404).send({ message: 'User not found, something went wrong, during update' })
    
        const users = await User.find().sort({ isOnline: -1, lastActive: -1 }).select('-password -otp').lean().exec()
        res.status(200).json(users)
    } catch (error) {
         res.status(400).json({error: error.message})
    }
}

exports.delete = async (req, res) => {
    const { id } = req.params

    const isIdEmpty = validator.isEmpty(id, { ignore_whitespace:true })
    if (isIdEmpty) return res.status(400).json({error: 'User id required'})
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: 'No such user id found'})

    // const note = await Note.findOne({ user: id }).lean().exec()
    // if (note) return res.status(400).json({ error: 'User has assigned notes' })

    const rootUser = await User.findById(id).lean().exec()
    if(rootUser.roles == "Root") return res.status(400).json({error: 'Not authorized to delete this user'})
    if(req.roles == ROLES_LIST.Admin && rootUser.roles == ROLES_LIST.Admin) return res.status(400).json({error: 'Not authorized to delete this user'})

    const user = await User.findByIdAndDelete(id).lean().exec()
    if (!user) return res.status(400).json({ error: 'User not found' })

    // const reply = `User ${user.name} with ID ${user._id} deleted`
    res.status(200).json(user)
}

exports.getNotAssignUser = async (req, res) => {
    const { id } = req.params
  
    const isIdEmpty = validator.isEmpty(id ?? "", { ignore_whitespace:true })
    if (isIdEmpty) return res.status(400).json({error: 'Task id required'})
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: 'No such task id found'})

    const notAssign = await User.find({
        $and: [
            {tasks: {$ne: id}},
            {roles: {$ne: ROLES_LIST.Root}},
            {roles: {$ne: ROLES_LIST.Admin}}
        ]
    }).select('_id name').lean().exec()

    if(!notAssign) return res.status(400).json({error: 'User not found'})
    res.status(200).json(notAssign)
}