import mongoose from "mongoose";

export interface IUser {
    email: string;
    name: string;
    password: string;
    balance: number;
    friends: mongoose.Types.ObjectId[];
    tokens: { token: string }[];
    generateToken(): Promise<string>;
    toJSON(): any
}

export type UserDocument = mongoose.HydratedDocument<IUser>;