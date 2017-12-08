let express = require('express');
let router = express.Router();
let Users = require('../models/Users');
let Lobby = require('../models/Lobby');

router.get('/', function(req,res){

  res.render('index');

})

router.get('/login', function(req,res){

  res.render('login');

})

router.post('/login', function(req,res){

  let username = req.body.username;
  let password = req.body.password;

  let user = new Users();

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

  let username = req.body.username;
  let email = req.body.email;
  let createPassword = req.body.createPassword;
  let confirmPassword = req.body.confirmPassword;

  let user = new Users();
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

  let lobby = new Lobby();

  lobby.getRooms().then( result => {
    res.render('lobby', {
    lobby: result,

    });

  });

})

router.post('/lobby/createRoom', (req, res)=>{

  let lobby = new Lobby();
  lobby.createRoom();
  res.sendStatus(200);

})

/*
router.get('/deleteRoom/:roomNumber', (req,res)=>{
  var roomNumber = req.params.roomNumber;

  var gameroom = new GameRoom();
  gameroom.deleteRoom(roomNumber);

})*/

router.post('/lobby/player1Join/:roomNumber', (req,res)=>{
  let username = res.locals.session.username;
  let roomNumber = req.params.roomNumber;

  let lobby = new Lobby();
  lobby.player1Join(username, roomNumber).then(()=>{
    res.sendStatus(200);
  });

})

router.post('/lobby/player2Join/:roomNumber', (req,res)=>{
  let username = res.locals.session.username;
  let roomNumber = req.params.roomNumber;

  let lobby = new Lobby();
  lobby.player2Join(username, roomNumber).then(()=>{
    res.sendStatus(200);
  })

})


router.get('/game/:gameId', (req,res)=>{
  let gameId = req.params.gameId;

  res.send(req.params.gameId);
})

router.get('/test', (req,res)=>{

  res.render('test');

})

module.exports = router;
