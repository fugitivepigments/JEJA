module.exports = function(sequelize, Sequelize){
	const User = sequelize.define('User', {
		user_name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		user_email: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				isEmail: true
			}
		},
		user_password: {
			type: Sequelize.STRING,
			allowNull: false
		}
	}, {
		timestamps: false
	});

	User.associate = function(models){
		User.hasMany(models.Meme, {
			onDelete: "cascade"
		});
	};

	return User;
};