import mongoose from 'mongoose';

export interface ITransaction extends Document {
	_id: mongoose.Types.ObjectId;
	user: mongoose.Types.ObjectId;
	type: 'deposit' | 'withdrawal' | 'transfer';
	amount: number;
    description?: string;
    to?: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const TransactionSchema = new mongoose.Schema<ITransaction>(
	{
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: true,
		},
		type: {
			type: String,
			enum: ['deposit', 'withdrawal', 'transfer'],
			required: true,
		},
        amount: {
            type: Number,
            min:1000,
            required: true
        },
        description: {
            type: String,
            maxlength: 50
        }
        ,
        to: {
            type: mongoose.Schema.ObjectId,
			ref: 'User',
        }
	},
	{
		timestamps: true,
	}
);

export const Transaction = mongoose.model<ITransaction>(
	'Transaction',
	TransactionSchema
);
