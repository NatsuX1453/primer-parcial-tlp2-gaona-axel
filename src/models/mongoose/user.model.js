import { model, Schema } from 'mongoose';

// TODO: completar relacion embebida y configurar el virtuals para el populate inverso con assets
const UserSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			minlength: 3,
			maxlength: 20,
		},
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: {
			type: String,
			enum: ['secretary', 'administrator'],
			default: 'secretary',
		},
		deletedAt: { type: Date, default: null },
		employeeNumber: { type: String, required: true, unique: true },
		firstName: { type: String, required: true, minlength: 2, maxlength: 50 },
		lastName: { type: String, required: true, minlength: 2, maxlength: 50 },
		phone: { type: String, default: null },
	},
	{ timestamps: true },
);
//!FALTA COMPLETAR ACA (abajo esta mi desarrollo)
UserSchema.add({
	profile: {
		employeeNumber: { type: String, required: true, unique: true },
		firstName: { type: String, required: true, minlength: 2, maxlength: 50 },
		lastName: { type: String, required: true, minlength: 2, maxlength: 50 },
		phone: { type: String, default: null },
	},
});

UserSchema.virtual('assets', {
	ref: 'Asset',
	localField: '_id',
	foreignField: 'responsible',
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

export const UserModel = model('User', UserSchema);
