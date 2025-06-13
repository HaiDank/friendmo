import mongoose from 'mongoose';

export interface IUser {
	email: string;
	name: string;
	password: string;
	balance: number;
	friends: mongoose.Types.ObjectId[];
	tokens: { token: string }[];
	friendRequests: mongoose.Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
	generateToken(): Promise<string>;
	toJSON(): any;
}

export type UserDocument = mongoose.HydratedDocument<IUser>;
