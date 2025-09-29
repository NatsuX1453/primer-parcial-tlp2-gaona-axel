import { model, Schema } from 'mongoose';
import { ProfileModel } from '../sequelize/profile.model';
import { userRoutes } from '../../routes/users.routes';

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
UserSchema.pre('findOneAndDelete', async function (next) {
	const filter = this.getFilter();
	const user = await this.model.findOne(filter);
	if (user) await ProfileModel.deleteMany({ user: user._id });
	next();
});

export const UserModel = model('User', UserSchema);
