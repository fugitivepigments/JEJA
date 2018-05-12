module.exports = function(sequelize, Sequelize){
	const Portfolio = sequelize.define('Portfolio', {
		portfolio_name: {
			type: Sequelize.STRING,
			allowNull: false
		}
	});

	Portfolio.associate = function(models){
		Portfolio.hasMany(models.Meme, {
			onDelete: "cascade"
		});

		Portfolio.belongsTo(models.User, {
			foreignKey: {
				allowNull: true
			}
		});
	};

	return Portfolio;
};