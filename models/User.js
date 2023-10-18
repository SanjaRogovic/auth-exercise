import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100, 
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true

    }
}, {timestamps: true})

const User = mongoose.model("User", UserSchema)

export default User