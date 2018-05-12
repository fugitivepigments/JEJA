module.exports = function(sequelize, Sequelize){
	const Meme = sequelize.define('Meme', {
		meme_name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		devoured: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	});

	Meme.associate = function(models){
		Meme.belongsTo(models.User, {
			foreignKey: {
				allowNull: true
			}
		});
	};

	return Meme;
};