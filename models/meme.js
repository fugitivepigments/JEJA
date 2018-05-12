module.exports = function(sequelize, Sequelize){
	const Meme = sequelize.define('Meme', {
		meme_name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		og_img: {
			type: Sequelize.STRING,
			allowNull: false
		},
		new_img: {
			type: Sequelize.STRING,
			allowNull: false
		},
		tags: {
			type: Sequelize.STRING
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
