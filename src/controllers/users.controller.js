export const getAllUsers = async (_req, res) => {
	// TODO: devolver usuarios con profile y sus assets con sus categories (populate) (solo admin)
	try {
		const users = await UserModel.find()
			.select('-password')
			.populate({
				path: 'assets',
				populate: { path: 'category' },
			});
		return res.status(200).json({ data: users });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: 'Error interno del servidor' });
	}
};

export const deleteUser = async (req, res) => {
	try {
		// TODO: eliminación lógica (deletedAt) (solo admin)
		const userId = req.params.id;
		const user = await UserModel.findByIdAndUpdate(
			userId,
			{ deletedAt: new Date() },
			{ new: true },
		);
		if (!user) {
			return res.status(404).json({ msg: 'Usuario no encontrado' });
		}
		return res.status(204).json({ msg: 'Usuario eliminado correctamente' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: 'Error interno del servidor' });
	}
};
