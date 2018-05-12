module.exports = function(sequelize, Sequelize){
	const Artwork = sequelize.define('Artwork', {
		author: {
			type: Sequelize.STRING,
			allowNull: false
		},
		born_died: {
			type: Sequelize.STRING,
			allowNull: false
		},
		title: {
			type: Sequelize.STRING,
			allowNull: false
		},
		date: {
			type: Sequelize.STRING,
			allowNull: false
		},
		technique: {
			type: Sequelize.STRING,
			allowNull: false
		},
		location: {
			type: Sequelize.STRING,
			allowNull: false
		},
		img_url: {
			type: Sequelize.STRING,
			allowNull: false
		},
		form: {
			type: Sequelize.STRING,
			allowNull: false
		},
		type: {
			type: Sequelize.STRING,
			allowNull: false
		},
		school: {
			type: Sequelize.STRING,
			allowNull: false
		},
		timeframe: {
			type: Sequelize.STRING,
			allowNull: false
		}
	}, {
		timestamps: false
	});

	return Artwork;
};