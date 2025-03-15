import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    walletAddress: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    walletAddress: { type: String, required: true },
});

UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
