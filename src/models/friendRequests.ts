import mongoose from 'mongoose';

interface IFriendRequest extends Document {
	from: mongoose.Types.ObjectId;
	to: mongoose.Types.ObjectId;
	status: 'pending' | 'accepted' | 'rejected';
	createdAt: Date;
	updatedAt: Date;
}

const FriendRequestSchema = new mongoose.Schema<IFriendRequest>(
	{
		from: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: true,
		},
		to: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: true,
		},
		status: {
			type: String,
			enum: ['pending', 'accepted', 'rejected'],
			default: 'pending',
		},
	},
	{
		timestamps: true,
	}
);

export const FriendRequest = mongoose.model<IFriendRequest>(
	'FriendRequest',
	FriendRequestSchema
);
