import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    created_at: Date;
}

const userSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: true,
        lowercase: true,
        validate: [
            validator.isEmail,
            'The email address you entered is not valid',
        ],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Your password needs to be at least 8 characters long'],
        validate: {
            validator: function (value) {
                return (
                    /[a-z]/.test(value) && // at least one lowercase letter
                    /[A-Z]/.test(value) && // at least one uppercase letter
                    /\d/.test(value) // at least one digit
                );
            },
            message:
                'Password must contain at least one lowercase letter, one uppercase letter, and one digit',
        },
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
