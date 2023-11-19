function resetBoard(generateNewLayout) {
    // Reset everything on the page

    // Call generateChess960Position to generate a new layout only if the parameter is true
    var newPositions = generateNewLayout ? generate960Position(true) : getCurrentPositions();

    // Update board and pieces
    updateBoard(newPositions);
}


function generate960Position(buttonClicked) {
    if (buttonClicked) {
        console.log("Generating Positions");
        generatingPositions = true;
    }
    // Array to represent the possible positions of the back rank pieces
    var backRankPositions = [1, 2, 3, 4, 5, 6, 7, 8];

    // Shuffle the array to get a random order
    for (let i = backRankPositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [backRankPositions[i], backRankPositions[j]] = [backRankPositions[j], backRankPositions[i]];
    }

    // bishops are on opposite-colored squares
    while ((backRankPositions.indexOf(3) % 2 === 0 && backRankPositions.indexOf(6) % 2 === 0) ||
           (backRankPositions.indexOf(3) % 2 !== 0 && backRankPositions.indexOf(6) % 2 !== 0)) {
        // Reshuffle until bishops are on opposite-colored squares
        for (let i = backRankPositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [backRankPositions[i], backRankPositions[j]] = [backRankPositions[j], backRankPositions[i]];
        }
    }
    generatingPositions = false;
    return backRankPositions;
}


function getCurrentPositions(){
    var currentPosition = {};

    // Iterate over each cell in the chessboard
   $('.cell').each(function () {
        var cellId = $(this).attr('id');
        var pieceElement = $(this).find('.piece');

        // Check if there's a piece in the cell
        if (pieceElement.length) {
            var pieceId = pieceElement.attr('id');

            // Extract row and column information from the cellId
            var row = cellId.charAt(5);
            var col = cellId.charAt(6);

            // Extract color and piece type information from the pieceId
            var color = pieceId.charAt(2) === 'w' ? 'white' : 'black';
            var type = pieceId.split('-')[2];

            // Build the current position object
            currentPosition[cellId] = {
                color: color,
                type: type,
                row: row,
                col: col
            };
        } else {
            console.warn("No piece found in cell:", cellId);
        }
    });

    return currentPosition;
}


function updateBackRank(pieceId, newPosition) {
    // Update the position of the piece with the new Chess960 position
    var cellId = "cell-" + newPosition + String.fromCharCode(65 + parseInt(pieceId.slice(-1)) - 1);
    $("#" + pieceId).parent().attr("id", cellId);
}

function updateBoard(newPositions) {
    var whitePieceIds = [
        "p-white-castle-1", "p-white-knight-1", "p-white-bishop-1", "p-white-queen",
        "p-white-king", "p-white-bishop-2", "p-white-knight-2", "p-white-castle-2"
    ];

    var blackPieceIds = [
        "p-black-castle-1", "p-black-knight-1", "p-black-bishop-1", "p-black-queen",
        "p-black-king", "p-black-bishop-2", "p-black-knight-2", "p-black-castle-2"
    ];

    // Update white pieces
    for (let i = 0; i < whitePieceIds.length; i++) {
        var pieceId = whitePieceIds[i];
        var newPosition = newPositions[i];
        updatePiece(pieceId, newPosition);
    }

    // Update black pieces
    for (let i = 0; i < blackPieceIds.length; i++) {
        var pieceId = blackPieceIds[i];
        // Chess960 layout is symmetric, so use the same newPositions array for black pieces
        var newPosition = newPositions[i];
        updatePiece(pieceId, newPosition);
    }
}

function updatePiece(pieceId, newPosition) {
    var row = String.fromCharCode(56 - parseInt(newPosition)); // Convert row number to corresponding letter
    var col = String.fromCharCode(65 + parseInt(pieceId.slice(-1)) - 1); // Convert column number to corresponding letter
    var cellId = "cell-" + (parseInt(newPosition) % 2 === 0 ? "white" : "black") + "-" + row + col;
    var pieceElement = $("#" + pieceId);
    var cellElement = $("#" + cellId);

    // Log the piece and cell IDs to the console
    console.log("Piece ID:", pieceId);
    console.log("Cell ID:", cellId);

    // Check if the elements exist
    console.log("Piece element:", pieceElement); 
    console.log("Cell element:", cellElement);  

    // Check if the elements exist
    if (pieceElement.length && cellElement.length) {
        // Update the position of the piece with the new position
        pieceElement.attr("id", cellId);

        // Update the offset of the piece based on its new position
        var offset = pieceElement.offset();
        var x = offset.left;
        var y = offset.top;
        var newOffset = cellElement.offset();

        // Calculate the new position based on the difference in offsets
        var newX = x + (newOffset.left - x);
        var newY = y + (newOffset.top - y);

        // Set the new offset
        pieceElement.offset({ left: newX, top: newY });
        
        // Update the pieceId variable with the new id
        pieceId = cellId;
    } else {
        console.error("Piece or cell element not found!", "Piece ID:", pieceId, "Cell ID:", cellId);
    }
}



// Call resetBoard to initialize the board with a random Chess960 layout
resetBoard();