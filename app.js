require('dotenv').config();

module.exports = {
	"development"L{
		"use_env_variable": "DATABASE_URL",
		"dialect": "postgres"
	},
	"test": {
		"use_env_variable": "DATABASE_URL",
		"dialect": "postgres"
	},
	"production": {
		"use_env_variable": "DATABASE_URL",
		"dialect": "postgres"
	}
}

if (process.env.NODE_ENV === 'development'){
	require("dotenv").config();
}