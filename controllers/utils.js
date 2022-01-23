const Sequelize = require("sequelize");

module.exports = {
    Sequelize: Sequelize,
    Op: Sequelize.Op,
    fs: require("fs"),
    User: require("../models").User,
    Meme: require("../models").Meme,
    Portfolio: require("../models").Portfolio,
    Artwork: require("../models").Artwork,
    ARTWORK_COUNT: 5280
};