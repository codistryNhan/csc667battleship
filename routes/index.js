var express = require('express');
var router = express.Router();
const db = require('../db');

var title = 'Battleship';

/* GET home page. */
router.get('/', 
	function (req, res, next){
		res.render('index', {
			title: title,
			home: '/',
			register: '/register',
			login: '/login'
		})
	});

router.get('/register', 
	function (req, res, next){
		res.render('register',{
			title: title,
			home: '/',
			register: '#',
			login: '/login'
			})

	});

router.post('/register',
	function(req, res, next){
		var firstName = req.body.firstName;
		var lastName = req.body.lastName;
		var username = req.body.newUsername;
		var createPassword = req.body.createPassword;
		var confirmPassword = req.body.confirmPassword;

		console.log("First Name " + firstName);
		console.log("Last Name " + lastName);
		console.log("Username " + username);
		console.log("Create Password " + createPassword);
		console.log("Confirm Password " + confirmPassword);

		res.render('index',{
			title: title,
			home: '/',
			register: '/register',
			login: '/login'
		})
	});

router.get('/login',
	function(req, res, next){
		res.render('login', {
			title: title,
			home: '/',
			register: '/register',
			login: '#'
		})
	});

router.post('/login',
	function(req, res, next){
		var username = req.body.username;
		var password = req.body.loginPassword;

		console.log("Username " + username);
		console.log("Password " + password);

		res.render('index', {
			title: title,
			home: '/',
			register: '/register',
			login: '/login'
		})
	});


module.exports = router;
