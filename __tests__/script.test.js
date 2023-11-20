// chess.test.js
const {
    generateInitialPositions,
    getCurrentPositions,
    resetBoard,
    generate960Position,
    updateBackRank,
    updateBoard,
    updatePiece,
    getRandomInt,
    getRandomCell,
    isCellOccupied,
    updateOccupiedCells,
    move,
    killOppositePiece,
    calculatePos,
    createNewWhiteKing,
    createNewBlackKing,
    createNewWhiteQueen,
    createNewBlackQueen,
    createNewWhiteCastle,
    createNewBlackCastle,
    createNewBlackBishop,
    createNewWhiteBishop,
    createNewBlackPawn,
    createNewWhitePawn,
    createNewBlackKnight,
    createNewWhiteKnight,
  } = require('./chess'); // Update the path accordingly
  
  describe('Chess Functions', () => {
    //test for inital Positions
    test('generateInitialPositions should return an array', () => {
      const result = generateInitialPositions();
      expect(Array.isArray(result)).toBe(true);
    });
  
    test('getCurrentPositions should return an array', () => {
      const result = getCurrentPositions();
      expect(Array.isArray(result)).toBe(true);
    });
  
  });
  