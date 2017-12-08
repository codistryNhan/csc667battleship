
let db = require('../db');

class GameRoom{

  constructor(){}

  createRoom(){
    return db.any("INSERT INTO game_room(player1) VALUES('')");
  }

  deleteRoom(roomNumber){
    return db.any('DELETE FROM game_room WHERE id = $1', roomNumber);
  }

  getRooms(){
    return db.any('SELECT game_room.id, game_room.player1 FROM game_room');
  }

  getLastRoom(){
    return db.any('SELECT id FROM game_room ORDER BY id DESC');
  }

  joinRoomPlayer1(playerName, roomNumber){
    return db.any('UPDATE game_room SET player1 = $1 WHERE id = $2', [playerName, roomNumber]);
  }

  joinRoomPlayer2(playerName, roomNumber){
    return db.any('UPDATE game_room SET player1 = $1 WHERE id = $2', [playerName, roomNumber]);
  }

}

module.exports = GameRoom;
