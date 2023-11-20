
// Variable to store the initial positions
var initialPositions;

// Function to generate the initial positions
function generateInitialPositions() {
    // Call generate960Position to generate initial layout
    return generate960Position();
}

// Function to get the current positions
function getCurrentPositions() {
    // If initialPositions is not defined, generate it
    if (!initialPositions) {
        initialPositions = generateInitialPositions();
    }

    // Return a copy of the initial positions
    return [...initialPositions];
}
function resetBoard(generateNewLayout) {
    // Reset everything on the page

    // Call generate960Position to generate a new layout only if the parameter is true
    var newPositions = generateNewLayout ? generate960Position(true) : getCurrentPositions();

    // Update board and pieces
    if (generateNewLayout) {
        updateBoard(newPositions);
    }}


function generate960Position(buttonClicked) {
    if (buttonClicked) {
        console.log("Generating Positions");
        // Set initialPositions to null to force regeneration
        initialPositions = null;
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

    return backRankPositions;
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
    } else {
        console.error("Piece or cell element not found!", "Piece ID:", pieceId, "Cell ID:", cellId);
    }
}


// Call resetBoard to initialize the board with a random Chess960 layout
resetBoard();