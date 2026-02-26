const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name : String,
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : String,
    refreshToken: [String],
    skills: {
        type: [String],
        default: []
    },
    interests: {
        type: [String],
        default: []
    },
    role: {
        type: String,
        enum: ['STUDENT', 'MENTOR', 'ORGANIZATION', 'ADMIN'],
        default: 'STUDENT'
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACTIVE', 'BLOCKED'],
        default: 'ACTIVE'
    },
    // Mentor-specific fields
    expertise: {
        type: [String],
        default: []
    },
    bio: {
        type: String,
        default: ''
    },
    availability: {
        type: String,
        default: ''
    },
    // Organization-specific fields
    orgName: {
        type: String,
        default: ''
    },
    orgDescription: {
        type: String,
        default: ''
    },
    website: {
        type: String,
        default: ''
    }
},{
    timestamps : true
})


const userModel =  mongoose.model("user",userSchema)


module.exports = userModel