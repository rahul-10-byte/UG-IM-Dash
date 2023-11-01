import { Schema, model } from 'mongoose';
export const usersSchema = new Schema({
    email: { 
        type: String, 
        required: true 
    },
    encryptedPassword: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['admin', 'restricted'], 
        required: true 
    },
});

export const Users = model('Users', usersSchema);
