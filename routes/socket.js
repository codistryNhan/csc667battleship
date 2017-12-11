module.exports = function(io){

  let express = require('express');
  let router = express.Router();
  let users = [];
  let Lobby = require('../classes/Lobby');
  let Game = require('../classes/Game');

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

        createNamespace(roomId);

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

  //Private sockets for individual rooms
  function createNamespace(roomId){
    let room = io.of('/game/' + roomId);
    let ready = 0;
    let player1 = '';
    let player2 = '';
    let player1positions = [];
    let player2positions = [];
    let turn;

    room.on('connection', (socket)=>{
      let lobby = new Lobby();
      lobby.getPlayersName(roomId).then( result =>{
        //Set players as player1 and player2
        player1 = result[0].player1;
        player2 = result[0].player2;

        room.emit('player-connected', {
          player1: result[0].player1,
          player2: result[0].player2,
        })
      });


     socket.on('message-send', data => {

       room.emit('message-sent', {
         message: data.message,
         username: data.username
       })

     });

    socket.on('player-ready', (data)=>{
      ready++;

      if(ready === 1){
        room.emit('message-sent', {
          username: '<span style="color:green"><strong>SERVER</strong></span>',
          message: '<span style="color:green;"><strong>' + data.username.toUpperCase() + ' IS READY</strong></span>',
        })
      }

      if(ready === 2){
        let game = new Game();

        game.getShipPositions(roomId, player1).then( results =>{
          results.forEach( result =>{
            player1positions.push(result.ship_position);
          })
        }).then(()=>{

          game.getShipPositions(roomId, player2).then( results =>{
            results.forEach( result =>{
              player2positions.push(result.ship_position);
            })
          }).then(()=>{

            //Randomly pick who starts
            if( (Math.floor(Math.random() * 2) + 1) === 1){
              turn = player1;
            } else {
              turn = player2;
            }

            room.emit('start-game', {
              player1positions : player1positions,
              player2positions : player2positions,
              turn,
            });
            ready = 0;

            })

          })

        }

      }) // socket.on('ready-player') end

      //Check if selected position will hit a ship or miss
      socket.on('check-position', (data)=>{

        //If shot is from player1
        if(player1 == data.playerName){
          console.log("I am 1 " + player1positions);
          console.log("I am 1 " + data.position);

          if(player2positions.includes(data.position)){
            let index = player2positions.indexOf(data.position);

            player2positions.splice(index, 1);

            socket.emit('hit', {
              position: data.position,
            });

          } else {
            socket.emit('miss', {
              position: data.position,
            });
          }

          if(player2positions.length == 0){
            room.emit('game-over', {
              winner: player1,
            })
            return;
          }

          room.emit('end-turn', {
            turn: player2,
          });

        //If shot is from player2
        } else {
          console.log("I am 2 " + player2positions);
          console.log("I am 2 " + data.position);

          if(player1positions.includes(data.position)){
            let index = player1positions.indexOf(data.position);

            player1positions.splice(index, 1);

            socket.emit('hit', {
              position: data.position,
            });

          } else {
            socket.emit('miss', {
              position: data.position,
            });
          }

          if(player1positions.length == 0){
            room.emit('game-over', {
              winner: player2,
            })
            return;
          }

          room.emit('end-turn', {
            turn: player1,
          });

        }

      })

    }) //Room Socket end

  }

  return router;
}

