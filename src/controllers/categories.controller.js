import { CategoryModel } from '../models/mongoose/category.model.js';
import { AssetModel } from '../models/mongoose/asset.model.js';

export const createCategory = async (req, res) => {
	// TODO: crear category (solo admin)
	try {
		const { name, description } = req.body;
		const category = await CategoryModel.create({ name, description });
		return res
			.status(201)
			.json({ msg: 'Categoría creada correctamente', data: category });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: 'Error interno del servidor' });
	}
};

export const getAllCategories = async (_req, res) => {
	// TODO: listar categories con sus assets (populate inverso) (solo admin)
	try {
		const categories = await CategoryModel.find().populate('assets');
		return res.status(200).json({ data: categories });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: 'Error interno del servidor' });
	}
};

export const deleteCategory = async (req, res) => {
	// TODO: eliminar category (solo admin) y actualizar assets que referencian
	try {
		const categoryId = req.params.id;
		const category = await CategoryModel.findByIdAndDelete(categoryId);
		if (!category) {
			return res.status(404).json({ msg: 'Categoría no encontrada' });
		}
		await AssetModel.updateMany(
			{ 'category._id': categoryId },
			{ $set: { category: null } },
		);
		return res.status(204).json({ msg: 'Categoría eliminada correctamente' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: 'Error interno del servidor' });
	}
};
