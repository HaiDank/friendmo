import mongoose, { InferSchemaType, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../interfaces/User';

interface UserModelType extends Model<IUser> {
	findUserByCredential(email: string, password: string): Promise<IUser>;
}

const userSchema = new mongoose.Schema<IUser, UserModelType>(
	{
		name: { type: String, required: true },
		email: {
			type: String,
			unique: true,
			required: true,
			validator(value: string) {
				if (!validator.isEmail(value)) {
					throw new Error('Please enter a valid email address');
				}
			},
		},
		password: {
			type: String,
			required: true,
			validator(value: any) {
				if (value.length <= 6) {
					throw new Error('Password is too short');
				}
			},
		},
		balance: {
			type: Number,
			required: true,
			default: 0,
			min: 0
		},
		friends: [
			{ type: mongoose.Schema.ObjectId, ref: 'User', default: null },
		],
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
);

userSchema.pre('save', async function (next) {
	const user = this;
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}

	next();
});

userSchema.methods.generateToken = async function () {
	const user = this;
	const token = jwt.sign(
		{
			_id: user._id.toString(),
		},
		process.env.JWT_SECRET!
	);

	user.tokens.push({ token });
	await user.save();

	return token;
};

userSchema.statics.findUserByCredential = async function (
	email: string,
	password: string
) {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error('Unable to login');
	}

	const match = await bcrypt.compare(password, user.password);

	if (!match) {
		throw new Error('Unable to login');
	}

	return user;
};

userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;

	return userObject;
};

export const User = mongoose.model<IUser, UserModelType>('User', userSchema);
