import { DataTypes } from 'sequelize';
import { AssetModel } from './asset.model';
import { CategoryModel } from './category.model';

export const AssetCategoryModel = sequelize.define('AssetCategory', {
	id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
});

// TODO: completar relaciones muchos a muchos entre Asset y Category mediante AssetCategory.
// * N:M Asset ↔ Category through AssetCategory
// * 'categories' (Asset) y 'assets' (Category)
// ! FALTA COMPLETAR ACA (abajo esta mi desarrollo)
AssetModel.belongsToMany(CategoryModel, {
	through: AssetCategoryModel,
	as: 'categories',
	foreignKey: 'asset_id',
	otherKey: 'category_id',
});
CategoryModel.belongsToMany(AssetModel, {
	through: AssetCategoryModel,
	as: 'assets',
	foreignKey: 'category_id',
	otherKey: 'asset_id',
});
