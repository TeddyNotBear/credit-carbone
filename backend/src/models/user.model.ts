import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
    _id: string,
    email: string,
    wallet_address: string,
    role: string,
}

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String , unique: true },
    wallet_address: { type: String },
    role: { type: String },
});

userSchema.pre<IUser>('save', async function(next: any) {
    try {
        return next();
    } catch (error) {
        return next(error);
    }
});

const User = mongoose.model<IUser>('User', userSchema);

export { User }