
class Game {

  constructor(){
    this.username;
    this.gameId;
    this.socket;
    this.shipColor = '#4b535b';
    this.oceanColor = '#00a9ff';
    this.shotColor = '#d80000';
    this.turn;
  }

  setUsername(username){
    this.username = username;
  }

  getUsername(){
    return this.username;
  }

  setGameId(gameId){
    this.gameId = gameId;
  }

  getGameId(){
    return this.gameId;
  }

  setSocket(socket){
    this.socket = socket;
  }

  getSocket(){
    return this.socket;
  }

  setTurn(turn){
    this.turn = turn;
  }

  getTurn(){
    return this.turn;
  }

  // PHASE 1 OF GAME
  initializeGame() {
    let socket = this.socket;
    this.createGameBoard(10);
    let ships = [];
    let positionsAll = [];

    /* SHIP BUTTONS */
    // Destroyer
    let destroyerHorizontal = document.getElementById('destroyer-horizontal');
    destroyerHorizontal.addEventListener('click', () => {
      destroyerHorizontal.setAttribute('data-orientation', 'horizontal');
      destroyerHorizontal.setAttribute('data-ship', 'destroyer');
      destroyerHorizontal.setAttribute('data-selected', '');
    });

    let destroyerVertical = document.getElementById('destroyer-vertical');
    destroyerVertical.addEventListener('click', () => {
      destroyerHorizontal.setAttribute('data-orientation', 'vertical');
      destroyerHorizontal.setAttribute('data-ship', 'destroyer');
      destroyerHorizontal.setAttribute('data-selected', '');
    });

    //Submarine
    let submarineHorizontal = document.getElementById('submarine-horizontal');
    submarineHorizontal.addEventListener('click', () => {
      submarineHorizontal.setAttribute('data-orientation', 'horizontal');
      submarineHorizontal.setAttribute('data-ship', 'submarine');
      submarineHorizontal.setAttribute('data-selected', '');
    })

    let submarineVertical = document.getElementById('submarine-vertical');
    submarineVertical.addEventListener('click', () => {
      submarineVertical.setAttribute('data-orientation', 'vertical');
      submarineVertical.setAttribute('data-ship', 'submarine');
      submarineVertical.setAttribute('data-selected', '');
    })

    //Cruiser
    let cruiserHorizontal = document.getElementById('cruiser-horizontal');
    cruiserHorizontal.addEventListener('click', () => {
      cruiserHorizontal.setAttribute('data-orientation', 'horizontal');
      cruiserHorizontal.setAttribute('data-ship', 'cruiser');
      cruiserHorizontal.setAttribute('data-selected', '');
    })

    let cruiserVertical = document.getElementById('cruiser-vertical');
    cruiserVertical.addEventListener('click', () => {
      cruiserVertical.setAttribute('data-orientation', 'vertical');
      cruiserVertical.setAttribute('data-ship', 'cruiser');
      cruiserVertical.setAttribute('data-selected', '');
    })

    //Battleship
    let battleshipHorizontal = document.getElementById('battleship-horizontal');
    battleshipHorizontal.addEventListener('click', () => {
      battleshipHorizontal.setAttribute('data-orientation', 'horizontal');
      battleshipHorizontal.setAttribute('data-ship', 'battleship');
      battleshipHorizontal.setAttribute('data-selected', '');
    })

    let battleshipVertical = document.getElementById('battleship-vertical');
    battleshipVertical.addEventListener('click', () => {
      battleshipVertical.setAttribute('data-orientation', 'vertical');
      battleshipVertical.setAttribute('data-ship', 'battleship');
      battleshipVertical.setAttribute('data-selected', '');
    })

    //Carrier
    let carrierHorizontal = document.getElementById('carrier-horizontal');
    carrierHorizontal.addEventListener('click', () => {
      carrierHorizontal.setAttribute('data-orientation', 'horizontal');
      carrierHorizontal.setAttribute('data-ship', 'carrier');
      carrierHorizontal.setAttribute('data-selected', '');
    })

    let carrierVertical = document.getElementById('carrier-vertical');
    carrierVertical.addEventListener('click', () => {
      carrierVertical.setAttribute('data-orientation', 'vertical');
      carrierVertical.setAttribute('data-ship', 'carrier');
      carrierVertical.setAttribute('data-selected', '');
    })

    /* SHIP BUTTONS END */

    /* SELECTING POSITIONS */

    let cells = document.getElementsByClassName("cell");

    [].forEach.call(cells, (cell) => {
      cell.addEventListener('click', (e) => {
        if (!(document.querySelector('[data-selected]') === null)) {
          let selected = document.querySelector('[data-selected]');
          let shipOrientation = selected.getAttribute('data-orientation');
          let shipType = selected.getAttribute('data-ship');
          let currentPosition = parseInt(cell.getAttribute('data-position'));
          let shipLength = 0;
          let shipObj = {};
          let positions = [];

          shipObj.shipType = shipType;


          switch (shipType) {
            case 'destroyer':
              shipLength = 2;
              break;

            case 'submarine':
              shipLength = 3;
              break;

            case 'cruiser':
              shipLength = 3;
              break;

            case 'battleship':
              shipLength = 4;
              break;

            case 'carrier':
              shipLength = 5;
              break;
            default:
          }

          switch (shipOrientation) {
            case 'horizontal':

              for (let i = 0; i < shipLength; i++) {
                cells[currentPosition].style.backgroundColor = this.shipColor;
                positions.push(currentPosition);
                positionsAll.push(currentPosition);
                currentPosition++;
              }
              selected.removeAttribute('data-selected');
              $(function(){
                let ship = '#' + shipType;
                $(ship + '-container').slideUp(250);
              });

              break;

            case 'vertical':
              for (let i = 0; i < shipLength; i++) {
                cells[currentPosition].style.backgroundColor = this.shipColor;
                positions.push(currentPosition);
                positionsAll.push(currentPosition);
                currentPosition += 10;
              }
              selected.removeAttribute('data-selected');
              $(function(){
                let ship = '#' + shipType;
                $(ship + '-container').slideUp(250);
              });

              break;
          }

          shipObj.positions = positions;
          ships.push(shipObj);
        }

      });

      /* SELECTING POSITIONS END */

      /* GAMEBOARD HOVER OVER EFFECT */

      cell.addEventListener('mouseover', () => {
        if (!(document.querySelector('[data-selected]') === null)) {
          let selected = document.querySelector('[data-selected]');
          let shipOrientation = selected.getAttribute('data-orientation');
          let shipType = selected.getAttribute('data-ship');
          let currentPosition = parseInt(cell.getAttribute('data-position'));
          let shipLength = 0;

          switch (shipType) {
            case 'destroyer':
              shipLength = 2;
              break;

            case 'submarine':
              shipLength = 3;
              break;

            case 'cruiser':
              shipLength = 3;
              break;

            case 'battleship':
              shipLength = 4;
              break;

            case 'carrier':
              shipLength = 5;
              break;
            default:
          }

          switch (shipOrientation) {
            case 'horizontal':

              for (let i = 0; i < shipLength; i++) {
                if (cells[currentPosition] != undefined) {
                  cells[currentPosition].style.backgroundColor = this.shipColor;
                }
                currentPosition++;
              }

              break;

            case 'vertical':
              for (let i = 0; i < shipLength; i++) {
                if (cells[currentPosition] != undefined) {
                  cells[currentPosition].style.backgroundColor = this.shipColor;
                }
                currentPosition += 10;
              }

              break;
          }
        }

        cell.addEventListener('mouseout', () => {
          if (!(document.querySelector('[data-selected]') === null)) {
            let selected = document.querySelector('[data-selected]');
            let shipOrientation = selected.getAttribute('data-orientation');
            let shipType = selected.getAttribute('data-ship');
            let currentPosition = parseInt(cell.getAttribute('data-position'));
            let shipLength = 0;

            switch (shipType) {
              case 'destroyer':
                shipLength = 2;
                break;

              case 'submarine':
                shipLength = 3;
                break;

              case 'cruiser':
                shipLength = 3;
                break;

              case 'battleship':
                shipLength = 4;
                break;

              case 'carrier':
                shipLength = 5;
                break;
              default:
            }

            switch (shipOrientation) {
              case 'horizontal':

                for (let i = 0; i < shipLength; i++) {
                  if (!positionsAll.includes(currentPosition)) {
                    if (cells[currentPosition] != undefined) {
                      cells[currentPosition].style.backgroundColor = this.oceanColor;
                    }
                  }
                  currentPosition++;
                }

                break;

              case 'vertical':
                for (let i = 0; i < shipLength; i++) {
                  if (!positionsAll.includes(currentPosition)) {
                    if (cells[currentPosition] != undefined) {
                      cells[currentPosition].style.backgroundColor = this.oceanColor;
                    }
                  }
                  currentPosition += 10;
                }

                break;
            }
          }

        });
      });
    });
    /* GAMEBOARD HOVER EFFECT END */

    /* RESET BUTTON */
    let resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', () => {
      positionsAll = [];
      ships = [];

      [].forEach.call(cells, (cell) => {
        cell.style.backgroundColor = this.oceanColor;
      })

      $(function(){
        $('#destroyer-container').slideDown();
        $('#cruiser-container').slideDown();
	$('#submarine-container').slideDown();
	$('#battleship-container').slideDown();
	$('#carrier-container').slideDown();
      })
    })
    /* RESET BUTTON END */

    /* READY BUTTON */
    
    let readyButton = document.getElementById('ready-button');

    readyButton.addEventListener('click', () => {
      let username = this.username;
      let gameId = this.gameId;

      fetch('/game/setPositions', {
        method: 'post',
        credentials: 'include',
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          ships: ships,
          username: username,
          gameId: gameId,
        }),

      }).then(()=>{
        $(function(){
          $('#ready-container').slideUp(250);
        })

        socket.emit('player-ready', {
          username: username,
        });

      })

    })

  }
  

  /* CREATES GAMEBOARD */
  //Creates a gameboard of input size
  //Each cell has of a class of 'cell' and 'data-position'
  createGameBoard(size) {
    let main = document.getElementById('gameboard');
    let count = 0;
    let gameboard = document.createElement('table');
    gameboard.setAttribute('class', 'gameboard');

    //creates the letters on top of game board A -> J
    let firstRow = document.createElement('tr');
    let emptyCell = document.createElement('th');
    firstRow.appendChild(emptyCell);
    let alphaIndex = 65;

    for (let i = 0; i < 10; i++) {
      let letterList = document.createElement('th');
      letterList.setAttribute('class', 'text-center');
      letterList.innerHTML = '&#' + alphaIndex++;
      firstRow.appendChild(letterList);
      gameboard.appendChild(firstRow);
    }

    // creates the numbers on side and cells
    for (let i = 0; i < size; i++) {
      let row = document.createElement('tr');
      let numList = document.createElement('th');
      let index = i + 1;
      numList.innerHTML = index;
      row.appendChild(numList);

      for (let k = 0; k < size; k++) {
        let cell = document.createElement('td');
        cell.setAttribute('data-position', count++);
        cell.setAttribute('class', 'cell');
        cell.style.backgroundColor = this.oceanColor;
        row.appendChild(cell);
      }

      gameboard.appendChild(row);
    }

    main.appendChild(gameboard);
  }
  // PHASE 1 END //


  //PHASE 2 OF GAME //
  startGame(positions){
    let shipColor = this.shipColor;
    let oceanColor = this.oceanColor;
    let shotColor = this.shotColor;
    let socket = this.socket;
    let username = this.username;
    let turn = this.turn;

    let main = document.getElementById('main');

    while(main.firstChild){
      main.removeChild(main.firstChild);
    }

    /* LOAD GAME BOARDS */
    let playerGameBoard = createGameBoard('player');
    let playerBoard = document.createElement('div');
    playerBoard.setAttribute('class', 'col');
    playerBoard.setAttribute('id', 'player-board');
    playerBoard.appendChild(playerGameBoard);

    let yourBoardLabel = document.createElement('div');
    yourBoardLabel.className += 'text-center';
    yourBoardLabel.innerHTML = 'YOU';
    playerBoard.appendChild(yourBoardLabel);

    let opponentGameBoard = createGameBoard('opponent');
    let opponentBoard = document.createElement('div');
    opponentBoard.setAttribute('class', 'col');
    opponentBoard.setAttribute('id', 'opponent-board');
    opponentBoard.appendChild(opponentGameBoard);

    let opponentBoardLabel = document.createElement('div');
    opponentBoardLabel.className += 'text-center';
    opponentBoardLabel.innerHTML = "OPPONENT";
    opponentBoard.appendChild(opponentBoardLabel);

    let waitingGameBoard = createGameBoard('waiting');
    let waitingBoard = document.createElement('div');
    waitingBoard.setAttribute('class', 'col');
    waitingBoard.setAttribute('id', 'waiting-board');
    waitingBoard.appendChild(waitingGameBoard);


    //Create Div to under board
    let rowB = document.createElement('div');
    rowB.className = 'row';
    let buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container col text-center';
    buttonContainer.id = 'button-container';
    rowB.appendChild(buttonContainer);

    //Create button to submit position
    let submitPosition = document.createElement('button');
    submitPosition.id = 'submit-position';
    submitPosition.innerHTML = 'End Turn';

    //Create opponent waiting box
    let waitingOpponent = document.createElement('button');
    waitingOpponent.id = 'waiting-opponent';
    waitingOpponent.innerHTML = "Waiting on opponent...";

    //Attach both boards on to page
    let rowA = document.createElement('div');
    rowA.className = "row";
    rowA.appendChild(playerBoard);
    rowA.appendChild(opponentBoard);
    rowA.appendChild(waitingBoard);
    main.appendChild(rowA);

    loadShips(positions);
    mainGameLoop();


    function mainGameLoop(){
      let positionHistory = [];
      let selectOpponentPosition;
      let opponentCells = document.getElementsByClassName('opponent-cell');
      let opponentBoard = document.getElementById('opponent-board');
      let waitingBoard = document.getElementById('waiting-board');

      [].forEach.call(opponentCells, cell =>{
        let currentPosition = parseInt(cell.getAttribute('data-opponent-position'));

        cell.addEventListener('click', ()=>{
          //selectOpponentPosition = parseInt(cell.getAttribute('data-opponent-position'));
          selectOpponentPosition = currentPosition;
          cell.style.backgroundColor = 'red';
          positionHistory.push(currentPosition);
        });

        cell.addEventListener('mouseover', ()=>{

          if( !(positionHistory.includes(currentPosition)) ){
            cell.style.backgroundColor = 'red';
          }

        })

        cell.addEventListener('mouseout', ()=>{

          if( !(positionHistory.includes(currentPosition)) ){
            cell.style.backgroundColor = 'white';
          }

        })
      })

      //Add event listener to submit to check position
      submitPosition.addEventListener('click', ()=>{

        socket.emit('check-position', {
          playerName: username,
          position: selectOpponentPosition,
        })

      })

      //If it is the player's turn, they will have the "end turn" button
      //Else "Waiting for opponent" will display
      if(turn === username){
        buttonContainer.appendChild(submitPosition);
        main.appendChild(buttonContainer);

        opponentBoard.style.display = "block";
        waitingBoard.style.display = "none";
      } else {
        buttonContainer.appendChild(waitingOpponent);
        main.appendChild(buttonContainer);

        opponentBoard.style.display = "none";
        waitingBoard.style.display = "block";
      }

      socket.on('end-turn', (data)=>{
        turn = data.turn;

        if(turn === username){
          buttonContainer.removeChild(buttonContainer.firstChild);
          buttonContainer.appendChild(submitPosition);
          main.appendChild(buttonContainer);

          opponentBoard.style.display = "block";
          waitingBoard.style.display = "none";
        } else {
          buttonContainer.removeChild(buttonContainer.firstChild);
          buttonContainer.appendChild(waitingOpponent);
          main.appendChild(buttonContainer);

          opponentBoard.style.display = "none";
          waitingBoard.style.display = "block";
        }
      })

      socket.on('hit', (data)=>{
        opponentCells[data.position].style.backgroundColor = shotColor;
      })

      socket.on('miss', (data)=>{
        opponentCells[data.position].style.backgroundColor = oceanColor;
      })

      socket.on('game-over', (data)=>{
        let message = data.winner.toUpperCase() + " has won the match!";
        $(function(){
          $('#game-over-message').html(message);
          $('#game-over').show();
        });

      })

    }


    function loadShips(positions){
      let playerCells = document.getElementsByClassName('player-cell');

      [].forEach.call(playerCells, (cell)=>{
        let cellPosition = parseInt(cell.getAttribute('data-player-position'));

        positions.forEach( position => {

          if(cellPosition == position){
            cell.style.backgroundColor = shipColor;
          }

        })
      })
    }

    function createGameBoard(name) {
      let count = 0;
      let gameboard = document.createElement('table');
      gameboard.setAttribute('class', 'gameboard');

      //creates the letters on top of game board A -> J
      let firstRow = document.createElement('tr');
      let emptyCell = document.createElement('th');
      firstRow.appendChild(emptyCell);
      let alphaIndex = 65;

      for (let i = 0; i < 10; i++) {
        let letterList = document.createElement('th');
        letterList.setAttribute('class', 'text-center');
        letterList.innerHTML = '&#' + alphaIndex++;
        firstRow.appendChild(letterList);
        gameboard.appendChild(firstRow);
      }

      // creates the numbers on side and cells
      for (let i = 0; i < 10; i++) {
        let row = document.createElement('tr');
        let numList = document.createElement('th');
        let index = i + 1;
        numList.innerHTML = index;
        row.appendChild(numList);

        for (let k = 0; k < 10; k++) {
          let cellName = 'data-' + name + '-position';
          let cell = document.createElement('td');
          cell.setAttribute(cellName, count++);
          cell.setAttribute('class', name + '-cell');

          if(name == 'player'){
            cell.style.backgroundColor = oceanColor; 
          } else {
            cell.style.backgroundColor = 'white';
          }

          row.appendChild(cell);
        }

        gameboard.appendChild(row);
      }

      return gameboard;
    }
  }

  // PHASE 2 END //
}
