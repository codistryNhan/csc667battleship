module.exports = function(io){

  let express = require('express');
  let router = express.Router();
  let users = [];
  let Lobby = require('../models/Lobby');

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
      let lobby = new Lobby();

      lobby.getLastRoom().then( result =>{
        let roomId = result[0].id;

        io.emit('created-room', {
          id: roomId,
        })

      })
    })

    socket.on('player1-click-join', (data)=>{
      let lobby = new Lobby();
      let roomId = data.roomId;

      lobby.getPlayer1Name(roomId).then((result)=>{
        io.emit('player1-join', {
          roomId: roomId,
          player1name: result[0].player1,
        })
      });
    })

    socket.on('player2-click-join', (data)=>{
      let lobby = new Lobby();
      let roomId = data.roomId;

      lobby.getPlayer2Name(roomId).then((result)=>{
        io.emit('player2-join', {
          roomId: roomId,
          player2name: result[0].player2,
        })
      });
    })


  })

  function createNamespace(roomId){

  }

  return router;
}

