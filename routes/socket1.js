module.exports = function(io){

  let express = require('express');
  let router = express.Router();
  let users = [];
  let Lobby = require('../classes/Lobby');
  let Game = require('../classes/Game');
  let Users = require('../classes/Users');

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
    let ship1obj = {};
    let ship2obj = {};
    let turn;
    let game = new Game();
    let lobby = new Lobby();
    let user = new Users();

    //When players connect to room
    room.on('connection', (socket)=>{
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

    //Players click ready, emit ready status
    socket.on('player-ready', (data)=>{
      ready++;

      if(ready === 1){
        room.emit('message-sent', {
          username: '<span style="color:green"><strong>SERVER</strong></span>',
          message: '<span style="color:green;"><strong>' + data.username.toUpperCase() + ' IS READY</strong></span>',
        })
      }

      if(ready === 2){

        //Push ship positions into an array
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

          //If player1 hits an enemey ship
          if(player2positions.includes(data.position)){
            let index = player2positions.indexOf(data.position);

            player2positions.splice(index, 1);

            game.getShipName(roomId, player2, data.position).then( data =>{
              let shipName = data[0].ship_type;
              shipName.toUpperCase();
 
              socket.emit('hit', {
                position: data.position,
              });
              
              room.emit('message-sent', {
                username: '<span style="color:red"><strong>GAME</strong></span>',
                message: '<span style="color:red;"><strong>' + player1.toUpperCase() + ' HITS A ' + shipName + ' </strong></span>',
              })

            })

          } else {
            socket.emit('miss', {
              position: data.position,
            });

            room.emit('message-sent', {
                username: '<span style="color:red"><strong>GAME</strong></span>',
                message: '<span style="color:red;"><strong>' + player1.toUpperCase() + ' MISSES  </strong></span>',
             })

          }

          if(player2positions.length == 0){

            game.deleteGameRoom(roomId).then(()=>{

              game.deleteShipPositions(roomId);
              user.addWin(player1);
              user.addLoss(player2);
              room.emit('game-over', {
                winner: player1,
              })

            })

            return;
          }

          room.emit('end-turn', {
            turn: player2,
          });

        //If shot is from player2
        } else {

          if(player1positions.includes(data.position)){
            let index = player1positions.indexOf(data.position);

            player1positions.splice(index, 1);

            game.getShipName(roomId, player1, data.position).then( data =>{
              let shipName = data[0].ship_type;
              shipName.toUpperCase();

              socket.emit('hit', {
                position: data.position,
              });

              room.emit('message-sent', {
                username: '<span style="color:red"><strong>GAME</strong></span>',
                message: '<span style="color:red;"><strong>' + player2.toUpperCase() + ' HITS A ' + shipName + ' </strong></span>',
              })

            })

          } else {
            socket.emit('miss', {
              position: data.position,
            });

            room.emit('message-sent', {
                username: '<span style="color:red"><strong>GAME</strong></span>',
                message: '<span style="color:red;"><strong>' + player2.toUpperCase() + ' MISSES  </strong></span>',
             })
          }

          if(player1positions.length == 0){

            game.deleteGameRoom(roomId).then(()=>{

              game.deleteShipPositions(roomId);
              user.addWin(player2);
              user.addLoss(player1);
              room.emit('game-over', {
                winner: player2,
              })

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

