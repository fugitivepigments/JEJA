module.exports = function(sequelize, Sequelize){
	const Meme = sequelize.define('Meme', {
		// TODO: update controllers to use meme_text instead of meme_name
		meme_name: {
			type: Sequelize.STRING,
			defaultValue: "Untitled"
		},
		meme_text: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				len: [1]
			}
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

		Meme.belongsTo(models.Portfolio, {
			foreignKey: {
				allowNull: true
			}
		});

		// Meme.belongsTo(models.Artwork, {
		// 	foreignKey: {
		// 		allowNull: true
		// 	}
		// });
	};

	return Meme;
};
