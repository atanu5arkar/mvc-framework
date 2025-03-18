import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    todos: [
        {
            task: {
                type: String,
                required: true
            },
            deadline: {
                type: Date,
                required: true
            }
        }
    ]
});

const UserModel = mongoose.model('user', userSchema, 'mvc-users');

export default UserModel;