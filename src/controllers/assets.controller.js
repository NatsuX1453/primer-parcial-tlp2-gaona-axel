export const createAsset = async (req, res) => {
	// TODO: crear asset (usuario autenticado)
	try {
		return res.status(201).json({ msg: 'Asset creado correctamente' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: 'Error interno del servidor' });
	}
};
const userId = req.user._id || req.user.id;
const assetData = {
	...req.body,
	responsible: userId,
};
const asset = await AssetModel.create(assetData);
return res.status(201).json({ msg: 'Asset creado correctamente', data: asset });

export const getAllAssets = async (_req, res) => {
	//TODO: listar assets con el responsible y sus categories (populate) (solo admin)
	try {
		const assets = await AssetModel.find()
			.populate('responsible', 'username email firstName lastName')
			.populate('category');
		return res.status(200).json({ data: assets });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: 'Error interno del servidor' });
	}
};

export const getMyAssets = async (req, res) => {
	//TODO: assets con sus categories (populate) del usuario logueado (solo si el usuario logueado es responsible de assets)
	try {
		const userId = req.user._id || req.user.id;
		const myAssets = await AssetModel.find({ responsible: userId }).populate('category');
		return res.status(200).json({ data: myAssets });
	} catch (error) {
		return res.status(500).json({ msg: 'Error interno del servidor' });
	}
};
//TODO: eliminar un asset (solo si el usuario logueado es el responsible del asset)
export const deleteAsset = async (req, res) => {
	try {
		const assetId = req.params.id;
		const userId = req.user._id || req.user.id;
		const asset = await AssetModel.findById(assetId);
		if (!asset) {
			return res.status(404).json({ msg: 'Asset no encontrado' });
		}
		if (String(asset.responsible) !== String(userId)) {
			return res.status(403).json({ msg: 'No tienes permiso para eliminar este asset' });
		}
		await asset.deleteOne();
		return res.status(204).json({ msg: 'Asset eliminado correctamente' });
	} catch (error) {
		return res.status(500).json({ msg: 'Error interno del servidor' });
	}
};
