import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Interface representing the organization document
export interface OrganizationDocument extends Document {
    organizationName: string;
    organizationEmailAddress: string;
    contactPersonName: string;
    contactPersonEmailAddress: string;
    password: string;
}

const organizationSchema: Schema<OrganizationDocument> = new Schema({
    organizationName: {
        type: String,
        required: true
    },
    organizationEmailAddress: {
        type: String,
        required: true,
        minlength: 5,
    },
    contactPersonName: {
        type: String,
        required: true
    },
    contactPersonEmailAddress: {
        type: String,
        required: true,
        minlength: 5,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
});

// Virtual field for confirm password (not stored in the database)
organizationSchema.virtual('confirmPassword').get(function(this: OrganizationDocument) {
    return this.password;
}).set(function(this: OrganizationDocument, value: string) {
    this.set('confirmPassword', value);
});

// Hash the password before saving it to the database
organizationSchema.pre<OrganizationDocument>('save', async function(next) {
    const saltRounds = 10;
    if (!this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

// Compare the password with the hashed password in the database
organizationSchema.methods.comparePassword = async function(this: OrganizationDocument, candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
}

export default mongoose.model<OrganizationDocument>('Organization', organizationSchema);
