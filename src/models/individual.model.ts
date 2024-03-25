import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Interface representing the individual document
export interface UserDocument extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
}

const individualSchema: Schema<UserDocument> = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
});

// Virtual field for confirm password (not stored in the database)
individualSchema.virtual('confirmPassword').get(function(this: UserDocument) {
    return this.password;
}).set(function(this: UserDocument, value: string) {
    this.set('confirmPassword', value);
});

// Hash the password before saving it to the database
individualSchema.pre<UserDocument>('save', async function(next) {
    const saltRounds = 10;
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

// Compare the password with the hashed password in the database
individualSchema.methods.comparePassword = async function(this: UserDocument, candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
}

const Individual = mongoose.model<UserDocument>('Individual', individualSchema);

export default Individual;