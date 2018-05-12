module.exports = function(sequelize, Sequelize){
	const User = sequelize.define('User', {
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false
		}
	});

	User.associate = function(models){
		User.hasMany(models.Meme, {
			onDelete: "cascade"
		});

		User.hasMany(models.Portfolio, {
			onDelete: "cascade"
		});
	};

	return User;
};
