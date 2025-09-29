import { UserModel } from '../models/mongoose/user.model.js';
import bcrypt from '../helpers/bcrypt.helper.js';
import jwt from '../helpers/jwt.helper.js';

export const register = async (req, res) => {
	//TODO:  crear usuario con password hasheada y profile embebido
	try {
		const {
			username,
			email,
			password,
			role,
			employeeNumber,
			firstName,
			lastName,
			phone,
		} = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await UserModel.create({
			username,
			email,
			password: hashedPassword,
			role,
			employeeNumber,
			firstName,
			lastName,
			phone,
			profile: {
				employeeNumber,
				firstName,
				lastName,
				phone,
			},
		});
		return res.status(201).json({ msg: 'Usuario registrado correctamente', data: user });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: 'Error interno del servidor' });
	}
};

export const login = async (req, res) => {
	// TODO: buscar user, validar password, firmar JWT y setear cookie httpOnly
	try {
		const { username, password } = req.body;
		const user = await UserModel.findOne({ username });
		if (!user) {
			return res.status(401).json({ msg: 'Usuario o contraseña incorrectos' });
		}
		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) {
			return res.status(401).json({ msg: 'Usuario o contraseña incorrectos' });
		}
		const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
			expiresIn: '1d',
		});
		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 24 * 60 * 60 * 1000,
		});

		return res.status(200).json({ msg: 'Usuario logueado correctamente' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: 'Error interno del servidor' });
	}
};

export const getProfile = async (req, res) => {
	// TODO: devolver profile del user logueado actualmente
	try {
		const userId = req.user._id || req.user.id;
		const user = await UserModel.findById(userId);
		if (!user) {
			return res.status(404).json({ msg: 'Usuario no encontrado' });
		}
		return res.status(200).json({ data: user.profile });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: 'Error interno del servidor' });
	}
};

export const logout = async (_req, res) => {
	res.clearCookie('token');
	return res.status(204).json({ msg: 'Sesión cerrada correctamente' });
};
