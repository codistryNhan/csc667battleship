if (process.env.NODE_ENV === 'development'){
	require("dotenv").config();
}

var express = require('express');
var path = require('path');


var routes = require('./tests');

var router = express.Router();
var app = express();

app.user(express.static(path.join(__dirname, 'public')));

router.use('/', index);

app.use('/', router);

app.use(function(req, res, next){
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next){
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.render('error');
})

module.exports = app;