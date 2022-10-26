const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const taskSchema = new mongoose.Schema(
    {
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        status: {
            type: String,
            required: true,
            default: "Pending"
        }
    }, {timestamps: true}
)

taskSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'taskId',
    start_seq: 888
})

module.exports = mongoose.model('Task', taskSchema)