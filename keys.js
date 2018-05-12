exports.config = {
	"development": {
		"username": process.env.DB_DEV_USER,
		"password": process.env.DB_DEV_PASSWORD,
		"database": process.env.DB_DEV_NAME,
		"host": process.env.DB_DEV_HOST,
		"dialect": "mysql"
	},
	"test": {
		"username": process.env.DB_TEST_USER,
		"password": process.env.DB_TEST_PASSWORD,
		"database": process.env.DB_TEST_NAME,
		"host": process.env.DB_TEST_HOST,
		"dialect": "mysql"
	},
	"production": {
		"use_env_variable": "JAWSBD_URL",
		"dialect": "mysql"
	}
};