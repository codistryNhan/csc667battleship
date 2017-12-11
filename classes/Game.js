let db = require('../db');

class Game{

  constructor(){}

  getShipPositions(roomId, username){
    return db.any('SELECT ship_position, ship_type FROM ship_positions WHERE room_id = $1 and player = $2', [roomId, username]);
  }

}

module.exports = Game;
