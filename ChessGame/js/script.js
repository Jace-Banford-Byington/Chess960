/**
 * Created by Pahansith on 4/3/2017.
 */

var arrMovedWhitePawnList = [];
var arrMovedBlackPawnList = [];

var arrMovedWhiteBishopList = [];
var arrMovedBlackBishopList = [];

var arrMovedWhiteKnightList = [];
var arrMovedBlackKnightList = [];

var arrMovedBlackCastleList = [];
var arrMovedWhiteCastleList = [];

var blackQueen = null;
var whiteQueen = null;

var blackKing = null;
var whiteKing = null;

var selectedPiece = null;
var previousMovedPiece = null;

// Add a list to keep track of occupied cells
var occupiedCells = [];

// Function to check if a cell is occupied
function isCellOccupied(cellID) {
    return occupiedCells.includes(cellID);
}

// Function to update the occupied cells list
function updateOccupiedCells(piece, cell) {
    // Remove the piece from its previous cell if it exists
    if (piece.currentPosition) {
        occupiedCells = occupiedCells.filter(cell => cell !== piece.currentPosition);
    }

    // Add the piece to the new cell
    occupiedCells.push(cell);
}



/**-------------------Receives click events-------------**/
$(document).on("click", function (event) {
    var x = event.pageX;
    var y = event.pageY;
    var clickedElement = document.elementFromPoint(x, y);
    var id = $(clickedElement).attr('id');

    if (id !== undefined && id.includes("cell")) { //if clicked an empty cell
        if (selectedPiece !== null && selectedPiece.id !== id) { //if one piece selected & then select other cell
            refreshCells(selectedPiece);
        }
        move(selectedPiece, clickedElement); //if previously selected a piece and now select a cell then selected piece move to selected cell

    } else if (id !== undefined && id.includes("p")) { //if clicked a piece
        if (selectedPiece !== null && selectedPiece.id !== id) { //if one piece selected & then select other piece
            refreshCells(selectedPiece);
        }
        calculatePos(id);
        killOppositePiece(selectedPiece, clickedElement);

    }
});

function calculatePos(pieceId) {
    var cellID = $("#" + pieceId).parent('div').attr('id').replace(/\0/g, '');

    if (previousMovedPiece !== null && pieceId.includes(previousMovedPiece.type)) {
        return;
    }

    if (pieceId.includes("pawn")) {
        if (pieceId.includes("black")) {
            var pawn = createNewBlackPawn(pieceId, cellID);
            calculatePathAhead(pawn);

        } else if (pieceId.includes("white")) {
            var pawn = createNewWhitePawn(pieceId, cellID);
            calculatePathAhead(pawn);
        }

    } else if (pieceId.includes("castle")) {
        if (pieceId.includes("black")) {
            var castle = createNewBlackCastle(pieceId, cellID);
            calculatePathTop(castle);

        } else if (pieceId.includes("white")) {
            var castle = createNewWhiteCastle(pieceId, cellID);
            calculatePathTop(castle);
        }

    } else if (pieceId.includes("knight")) {
        if (pieceId.includes("black")) {
            var knight = createNewBlackKnight(pieceId, cellID);
            calculatePathTopLeft(knight);

        } else if (pieceId.includes("white")) {
            var knight = createNewWhiteKnight(pieceId, cellID);
            calculatePathTopLeft(knight);
        }

    } else if (pieceId.includes("bishop")) {
        if (pieceId.includes("black")) {
            var bishop = createNewBlackBishop(pieceId, cellID);//Factory Methods
            calculatePathTopLeft(bishop);

        } else if (pieceId.includes("white")) {
            var bishop = createNewWhiteBishop(pieceId, cellID);//Factory Methods
            calculatePathTopLeft(bishop);
        }

    } else if (pieceId.includes("queen")) {
        if (pieceId.includes("black")) {
            var queen = createNewBlackQueen(pieceId, cellID);
            calculatePathTop(queen);
            calculatePathTopLeft(queen);

        } else if (pieceId.includes("white")) {
            var queen = createNewWhiteQueen(pieceId, cellID);
            calculatePathTop(queen);
            calculatePathTopLeft(queen);
        }

    } else if (pieceId.includes("king")) {
        if (pieceId.includes("black")) {
            var king = createNewBlackKing(pieceId, cellID);
            calculatePathTop(king);
            calculatePathTopLeft(king);

        } else if (pieceId.includes("white")) {
            var king = createNewWhiteKing(pieceId, cellID);
            calculatePathTop(king);
            calculatePathTopLeft(king);
        }
    }
}

/**
 *
 King Factory
 */

function createNewWhiteKing(pieceId, cellID) {
    if (whiteKing === null) {
        whiteKing = new Piece(pieceId, "white", cellID);
    }
    return whiteKing;
}

function createNewBlackKing(pieceId, cellID) {
    if (blackKing === null) {
        blackKing = new Piece(pieceId, "black", cellID);
    }
    return blackKing;
}

/**
 *
 Queen Factory
 */

function createNewWhiteQueen(pieceId, cellID) {
    if (whiteQueen === null) {
        whiteQueen = new Piece(pieceId, "white", cellID);
    }
    return whiteQueen;
}

function createNewBlackQueen(pieceId, cellID) {
    if (blackQueen === null) {
        blackQueen = new Piece(pieceId, "black", cellID);
    }
    return blackQueen;
}

/**
 *
 Castle Factory
 */

function createNewWhiteCastle(pieceId, cellID) {
    for (var i = 0; i < arrMovedWhiteCastleList.length; i++) {
        var castle = arrMovedWhiteCastleList[i];

        if (castle.id === pieceId) {
            return castle;
        }
    }

    castle = new Piece(pieceId, "white", cellID);
    arrMovedWhiteCastleList.push(castle);
    return castle;
}

function createNewBlackCastle(pieceId, cellID) {
    for (var i = 0; i < arrMovedBlackCastleList.length; i++) {
        var castle = arrMovedBlackCastleList[i];

        if (castle.id === pieceId) {
            return castle;
        }
    }

    castle = new Piece(pieceId, "black", cellID);
    arrMovedBlackCastleList.push(castle);
    return castle;
}


/**
 *
 Bishop Factory
 */
function createNewBlackBishop(pieceId, cellID) {

    for (var i = 0; i < arrMovedBlackBishopList.length; i++) {
        var bishop = arrMovedBlackBishopList[i];

        if (bishop.id === pieceId) {
            return bishop;
        }
    }

    bishop = new Piece(pieceId, "black", cellID);
    arrMovedBlackBishopList.push(bishop);
    return bishop;
}

function createNewWhiteBishop(pieceId, cellID) {

    for (var i = 0; i < arrMovedWhiteBishopList.length; i++) {
        var bishop = arrMovedWhiteBishopList[i];

        if (bishop.id === pieceId) {
            return bishop;
        }
    }

    bishop = new Piece(pieceId, "white", cellID);
    arrMovedWhiteBishopList.push(bishop);
    return bishop;
}

/**
 *
 Pawn Factory
 */

function createNewBlackPawn(pieceId, cellID) {
    for (var i = 0; i < arrMovedBlackPawnList.length; i++) {
        var pawn = arrMovedBlackPawnList[i];
        if (pawn.id === pieceId) {
            return pawn;
        }
    }
    pawn = new Piece(pieceId, "black", cellID);
    arrMovedBlackPawnList.push(pawn);
    return pawn;
}

function createNewWhitePawn(pieceId, cellID) {
    for (var i = 0; i < arrMovedWhitePawnList.length; i++) {
        var pawn = arrMovedWhitePawnList[i];
        
        if (pawn.id === pieceId) {
            return pawn;
        }
    }
    pawn = new Piece(pieceId, "white", cellID);
    arrMovedWhitePawnList.push(pawn);
    return pawn;
}

/**
 *
 Knight Factory
 */

function createNewBlackKnight(pieceId, cellID) {
    for (var i = 0; i < arrMovedBlackKnightList.length; i++) {
        var knight = arrMovedBlackKnightList[i];

        if (knight.id === pieceId) {
            return knight;
        }
    }
    knight = new Piece(pieceId, "black", cellID);
    arrMovedBlackKnightList.push(knight);
    return knight;
}

function createNewWhiteKnight(pieceId, cellID) {
    for (var i = 0; i < arrMovedWhiteKnightList.length; i++) {
        var knight = arrMovedWhiteKnightList[i];
        if (knight.id === pieceId) {
            return knight;
        }
    }
    knight = new Piece(pieceId, "white", cellID);
    arrMovedWhiteKnightList.push(knight);
    return knight;
}

/**-----------------------Piece Object-----------------------**/
class Piece {
    constructor(id, type, currentPosition) {
        this.id = id;
        this.type = type;
        this.currentPosition = currentPosition;

        this.isFirstMove = true;
        this.positionsToBeMoved = [];
        this.obstaclesCanBeKilled = [];
    }
}

//Pawn
function calculatePathAhead(obj) {
    console.log("Object:", obj);

    selectedPiece = obj;
    colorPawnKillCell(obj);
    if (obj.type === "white") {
        var offset = $("#" + obj.currentPosition).offset();
        var x = offset.left;
        var y = offset.top - 65;

        var nextCell = document.elementFromPoint(x, y);
        if (!isObstaclesFound(obj, nextCell)) {
            colorCells(obj, nextCell);
            if (obj.isFirstMove) {
                y -= 65;
                nextCell = document.elementFromPoint(x, y);
                if (!isObstaclesFound(obj, nextCell)) {
                    colorCells(obj, nextCell);
                }
            }
        }

    } else if (obj.type === "black") {
        var offset = $("#" + obj.currentPosition).offset();
        var x = offset.left;
        var y = offset.top + 65;

        var nextCell = document.elementFromPoint(x, y);


        if (!isObstaclesFound(obj, nextCell)) {
            colorCells(obj, nextCell);
            if (obj.isFirstMove) {
                y += 65;
                nextCell = document.elementFromPoint(x, y);
                if (!isObstaclesFound(obj, nextCell)) {
                    colorCells(obj, nextCell);
                }
            }
        }
    }
}

//bishop, queen, king and Knight
function calculatePathTopLeft(obj) {
    console.log("Object:", obj);

    selectedPiece = obj;
    var offset = $("#" + obj.currentPosition).offset();
    var x = offset.left - 65;
    var y = offset.top - 65;

    var nextCell = document.elementFromPoint(x, y);

    if (obj.id.includes("king")) {
        if (!isObstaclesFound(obj, nextCell)) {
            colorCells(obj, nextCell);
        }
    } else if (obj.id.includes("bishop") || obj.id.includes("queen")) {
        while (!isObstaclesFound(obj, nextCell)) {
            colorCells(obj, nextCell);
            offset = $(nextCell).offset();
            x = offset.left - 65;
            y = offset.top - 65;
            nextCell = document.elementFromPoint(x, y);
        }
    } else if (obj.id.includes("knight")) {
        var nextCell1 = document.elementFromPoint(x - 65, y);
        var nextCell2 = document.elementFromPoint(x, y - 65);
        if (!isObstaclesFound(obj, nextCell1)) {
            colorCells(obj, nextCell1);
        }
        if (!isObstaclesFound(obj, nextCell2)) {
            colorCells(obj, nextCell2);
        }
    }
    calculatePathTopRight(obj);

}

function calculatePathTopRight(obj) {
    console.log("Object:", obj);

    selectedPiece = obj;
    var offset = $("#" + obj.currentPosition).offset();
    var x = offset.left + 65;
    var y = offset.top - 65;

    var nextCell = document.elementFromPoint(x, y);

    if (obj.id.includes("king")) {
        if (!isObstaclesFound(obj, nextCell)) {
            colorCells(obj, nextCell);
        }
    } else if (obj.id.includes("bishop") || obj.id.includes("queen")) {
        while (!isObstaclesFound(obj, nextCell)) {
            colorCells(obj, nextCell);
            offset = $(nextCell).offset();
            x = offset.left + 65;
            y = offset.top - 65;
            nextCell = document.elementFromPoint(x, y);
        }
    } else if (obj.id.includes("knight")) {
        var nextCell1 = document.elementFromPoint(x + 65, y);
        var nextCell2 = document.elementFromPoint(x, y - 65);
        if (!isObstaclesFound(obj, nextCell1)) {
            colorCells(obj, nextCell1);
        }
        if (!isObstaclesFound(obj, nextCell2)) {
            colorCells(obj, nextCell2);
        }
    }
    calculatePathBottomLeft(obj);

}

function calculatePathBottomLeft(obj) {
    console.log("Object:", obj);

    selectedPiece = obj;
    var offset = $("#" + obj.currentPosition).offset();
    var x = offset.left - 65;
    var y = offset.top + 65;

    var nextCell = document.elementFromPoint(x, y);

    if (obj.id.includes("king")) {
        if (!isObstaclesFound(obj, nextCell)) {
            colorCells(obj, nextCell);
        }
    } else if (obj.id.includes("bishop") || obj.id.includes("queen")) {
        while (!isObstaclesFound(obj, nextCell)) {
            colorCells(obj, nextCell);
            offset = $(nextCell).offset();
            x = offset.left - 65;
            y = offset.top + 65;
            nextCell = document.elementFromPoint(x, y);
        }
    } else if (obj.id.includes("knight")) {
        var nextCell1 = document.elementFromPoint(x - 65, y);
        var nextCell2 = document.elementFromPoint(x, y + 65);
        if (!isObstaclesFound(obj, nextCell1)) {
            colorCells(obj, nextCell1);
        }
        if (!isObstaclesFound(obj, nextCell2)) {
            colorCells(obj, nextCell2);
        }
    }

    calculatePathBottomRight(obj);
}

function calculatePathBottomRight(obj) {
    console.log("Object:", obj);

    selectedPiece = obj;
    var offset = $("#" + obj.currentPosition).offset();
    var x = offset.left + 65;
    var y = offset.top + 65;

    var nextCell = document.elementFromPoint(x, y);

    if (obj.id.includes("king")) {
        if (!isObstaclesFound(obj, nextCell)) {
            colorCells(obj, nextCell);
        }
    } else if (obj.id.includes("bishop") || obj.id.includes("queen")) {
        while (!isObstaclesFound(obj, nextCell)) {
            colorCells(obj, nextCell);
            offset = $(nextCell).offset();
            x = offset.left + 65;
            y = offset.top + 65;
            nextCell = document.elementFromPoint(x, y);
        }
    } else if (obj.id.includes("knight")) {
        var nextCell1 = document.elementFromPoint(x + 65, y);
        var nextCell2 = document.elementFromPoint(x, y + 65);
        if (!isObstaclesFound(obj, nextCell1)) {
            colorCells(obj, nextCell1);
        }
        if (!isObstaclesFound(obj, nextCell2)) {
            colorCells(obj, nextCell2);
        }
    }

}

//for castle queen and king
function calculatePathTop(obj) {
    console.log("Object:", obj);
    selectedPiece = obj;
    var offset = $("#" + obj.currentPosition).offset();
    var x = offset.left;
    var y = offset.top - 65;

    var nextCell = document.elementFromPoint(x, y);

    if (obj.id.includes("king")) {
        if (!isObstaclesFound(obj, nextCell)) {
            colorCells(obj, nextCell);
        }
    } else {
        while (!isObstaclesFound(obj, nextCell)) {
            colorCells(obj, nextCell);
            offset = $(nextCell).offset();
            x = offset.left;
            y = offset.top - 65;
            nextCell = document.elementFromPoint(x, y);
        }
    }
    calculatePathRight(obj);
}

function calculatePathRight(obj) {
    console.log("Object:", obj);

    selectedPiece = obj;
    var offset = $("#" + obj.currentPosition).offset();
    var x = offset.left + 65;
    var y = offset.top;

    var nextCell = document.elementFromPoint(x, y);

    if (obj.id.includes("king")) {
        if (!isObstaclesFound(obj, nextCell)) {
            colorCells(obj, nextCell);
        }
    } else {
        while (!isObstaclesFound(obj, nextCell)) {
            colorCells(obj, nextCell);
            offset = $(nextCell).offset();
            x = offset.left + 65;
            y = offset.top;
            nextCell = document.elementFromPoint(x, y);
        }
    }
    calculatePathLeft(obj);

}

function calculatePathLeft(obj) {
    console.log("Object:", obj);

    selectedPiece = obj;
    var offset = $("#" + obj.currentPosition).offset();
    var x = offset.left - 65;
    var y = offset.top;

    var nextCell = document.elementFromPoint(x, y);

    if (obj.id.includes("king")) {
        if (!isObstaclesFound(obj, nextCell)) {
            colorCells(obj, nextCell);
        }
    } else {
        while (!isObstaclesFound(obj, nextCell)) {
            colorCells(obj, nextCell);
            offset = $(nextCell).offset();
            x = offset.left - 65;
            y = offset.top;
            nextCell = document.elementFromPoint(x, y);
        }
    }
    calculatePathBottom(obj);
}

function calculatePathBottom(obj) {
    console.log("Object:", obj);

    selectedPiece = obj;
    var offset = $("#" + obj.currentPosition).offset();
    var x = offset.left;
    var y = offset.top + 65;

    var nextCell = document.elementFromPoint(x, y);

    if (obj.id.includes("king")) {
        if (!isObstaclesFound(obj, nextCell)) {
            colorCells(obj, nextCell);
        }
    } else {
        while (!isObstaclesFound(obj, nextCell)) {
            colorCells(obj, nextCell);
            offset = $(nextCell).offset();
            x = offset.left;
            y = offset.top + 65;
            nextCell = document.elementFromPoint(x, y);
        }
    }
}
// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to get a random cell ID on the board
function getRandomCell() {
    // Assuming your board has rows from 1 to 8 and columns from A to H
    var randomRow = getRandomInt(1, 8);
    var randomCol = String.fromCharCode(getRandomInt(65, 72)); // A to H

    return "cell-" + (randomCol + randomRow);
}

/**All pieces**/
function move(obj, cell) {
  // Check if the cell is occupied
  if (isCellOccupied($(cell).attr('id'))) {
    // Find a new random cell that is not occupied
    var newCell;
    do {
        newCell = getRandomCell();

    }while (isCellOccupied(newCell));

    // Update the occupied cells list
    updateOccupiedCells(obj, newCell);

    // Move the piece to the new cell
    $("#" + obj.id).appendTo(newCell);
    refreshCells(obj);
    obj.currentPosition = newCell;
    previousMovedPiece = obj;
    obj.isFirstMove = false;
} else {
    // Update the occupied cells list
    updateOccupiedCells(obj, $(cell).attr('id'));

    // Move the piece to the selected cell
    $("#" + obj.id).appendTo(cell);
    refreshCells(obj);
    obj.currentPosition = $(cell).attr('id');
    previousMovedPiece = obj;
    obj.isFirstMove = false;
}

obj.positionsToBeMoved = [];
// isKingChecked(obj.type === "white" ? "black" : "white");
}

function killOppositePiece(obj, clickedPiece) {
    //clickedPiece is opposite side piece can be killed
    //obstaclesCanBeKilled has pieces of opposite side that can be killed by bishop
    var cell = $(clickedPiece).parent('div');
    for (var i = 0; i < obj.obstaclesCanBeKilled.length; i++) {
        if ($(clickedPiece).attr('id') === obj.obstaclesCanBeKilled[i].attr('id')) {
            $(clickedPiece).remove();
            $("#" + obj.id).appendTo(cell);
            refreshCells(obj);
            obj.currentPosition = $(cell).attr('id');
            previousMovedPiece = obj;
        }
    }
}

function colorCells(obj, elem) {
    obj.positionsToBeMoved.push(elem);
    $(elem).addClass("color-path");
    $("html").removeClass("color-path");
}

function colorKillCell(cell) {
    $(cell).addClass("color-path");
}

function colorPawnKillCell(obj) {
    var cell1;
    var cell2;
    var offset = $("#" + obj.currentPosition).offset();

    if (obj.type === "white") {
        cell1 = document.elementFromPoint(offset.left - 65, offset.top - 65);
        cell2 = document.elementFromPoint(offset.left + 65, offset.top - 65);
    } else if (obj.type === "black") {
        cell1 = document.elementFromPoint(offset.left - 65, offset.top + 65);
        cell2 = document.elementFromPoint(offset.left + 65, offset.top + 65);
    }

    var kill1 = $(cell1).children('span').attr('id');
    var kill2 = $(cell2).children('span').attr('id');

    if (kill1 !== undefined && !kill1.includes(obj.type)) {
        obj.obstaclesCanBeKilled.push($(cell1).children('span'));
        colorKillCell(cell1);
    }
    if (kill2 !== undefined && !kill2.includes(obj.type)) {
        obj.obstaclesCanBeKilled.push($(cell2).children('span'));
        colorKillCell(cell2);
    }
}

function refreshCells(obj) {
    for (var i = 0; i < obj.positionsToBeMoved.length; i++) {
        $(obj.positionsToBeMoved[i]).removeClass("color-path");
    }

    for (var i = 0; i < obj.obstaclesCanBeKilled.length; i++) {
        $(obj.obstaclesCanBeKilled[i]).parents('div').removeClass("color-path");
    }
}

function isObstaclesFound(obj, nextCell) {
    var child = $(nextCell).children('span');
    if (obj.id.includes("pawn")) { //if the object is a pawn
        if (child.attr('id') === undefined) {
            return false;
        }
        return true;
    }
    //rest of other objects
    if (child.attr('id') === undefined) {
        var id = $(nextCell).attr('id');
        if (id !== undefined && id.includes("cell")) {
            return false;
        }
    } else {
        if (!child.attr('id').includes(obj.type)) {
            obj.obstaclesCanBeKilled.push(child);
            colorKillCell(nextCell);
        }
    }
    return true;
}

/*function isKingChecked(type) {
    var pos;
    if (type === "white") {
        pos = whiteKing.currentPosition;
    } else {
        pos = blackKing.currentPosition;
    }

    var offset = $("#" + pos).offset();
    var x = offset.left;
    var y = offset.top - 65;

    var nextCell = document.elementFromPoint(x, y);

    var id;
    while ((id = inspectNextCell(nextCell)) === undefined) {
        offset = $(nextCell).offset();
        x = offset.left;
        y = offset.top - 65;
        nextCell = document.elementFromPoint(x, y);
    }
    if (!id.includes(type) && id.includes("castle") || id.includes("queen")) {
        alert("King Check");
    }
}

function inspectNextCell(nextCell) {
    return $(nextCell).children('span').attr('id');
}*/