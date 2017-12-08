module.exports = function(io){

  let express = require('express');
  let router = express.Router();
  let users = [];
  let GameRoom = require('../models/GameRoom');

  io.on('connection', (socket)=>{
    socket.on('lobby-connect', (data)=>{

      let user = {
        username: data.username,
        id: socket.id,
      }
      users.push(user);

      io.emit('load-users', {
        users: users,
      })
    })

    socket.on('disconnect', ()=>{
      users.forEach((user, index)=>{
        if(user.id === socket.id){
          users.splice(index,1);
        }
      })

      io.emit('load-users', {
        users: users,
      })
    })

    socket.on('message-send', (data)=>{
      io.emit('message-sent',data);
    });

    socket.on('create-room', ()=>{
      let gameroom = new GameRoom();

      gameroom.getLastRoom().then( result =>{
        let roomId = result[0].id;

        io.emit('created-room', {
          id: roomId,
        })

      })
    })
  })

  return router;
}

