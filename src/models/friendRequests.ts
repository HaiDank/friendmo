import mongoose, { InferSchemaType, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../interfaces/User';

interface UserModelType extends Model<IUser> {
    findUserByCredential(email: string, password: string): Promise<IUser>;
}

const userSchema = new mongoose.Schema<IUser, UserModelType>({
    name: { type: String, required: true },
});

export const User = mongoose.model<IUser, UserModelType>('User', userSchema);
