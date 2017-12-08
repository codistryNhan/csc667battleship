var express = require('express');
var router = express.Router();
var Users = require('../models/Users');
var GameRoom = require('../models/GameRoom');

router.get('/', function(req,res){

  res.render('index');

})

router.get('/login', function(req,res){

  res.render('login');

})

router.post('/login', function(req,res){

  var username = req.body.username;
  var password = req.body.password;

  var user = new Users();

  user.login(username, password)
  .then( result => {

    if(result){
      res.locals.session.username = username;
      res.render('index');
    } else {
      res.render('login');
    }

  })

})

router.get('/register', function(req,res){

  res.render('register');

})

router.post('/register', function(req,res){

  var username = req.body.username;
  var email = req.body.email;
  var createPassword = req.body.createPassword;
  var confirmPassword = req.body.confirmPassword;

  var user = new Users();
  user.register(username, confirmPassword, email)
    .then( () => {
      res.render('success');
    });

})

router.get('/signout', function(req,res){

  res.local.session.destroy( ()=> {
    res.redirect('/');
  });

})

router.get('/lobby', function(req,res){

  var gameroom = new GameRoom();

  gameroom.getRooms().then( result => {
    res.render('lobby', {
    gameRoom: result,

    });

  });

})

router.post('/lobby/createRoom', (req, res)=>{

  var gameroom = new GameRoom();
  gameroom.createRoom();

})

router.get('/deleteRoom/:roomNumber', (req,res)=>{
  var roomNumber = req.params.roomNumber;

  var gameroom = new GameRoom();
  gameroom.deleteRoom(roomNumber);

})

router.post('/joinRoomPlayer1/:roomNumber', (req,res)=>{
  var username = res.locals.session.username;
  var roomNumber = req.params.roomNumber;

  var gameroom = new GameRoom();
  return gameroom.joinRoomPlayer1(username, roomNumber);

})

router.get('/game', (req,res)=>{
  res.render('game');
})

router.get('/test', (req,res)=>{

  res.render('test');

})

module.exports = router;
