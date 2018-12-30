// Mathematical constants.

const sin60 = Math.sqrt(3) / 2; // sin(PI / 3)
const cos60 = 1 / 2;            // cos(PI / 3)

function randInt(a, b) { // Produces a random integer value in [a,b).
    return floor(a + (b - a) * Math.random());
}


// Canvas constants.

var canvas = {};
const size   = 500;      // The side length of the square canvas.
const centre = size / 2; // The x- and y-coordinate of the centre of the canvas.
const fps    = 60;       // The frame rate of the canvas.


// Layout constants.

var tiles = new Array(19); // Contains the 19 hexagonal tiles that make up the
                           //  board.
const space      = 8; // The width of the gap between adjacent tiles.
const sideLength = 50; // The default length of the side of each hexagonal tile.

/*
      x   a   b   c   d   e
    y +----------------------
    a |          10
    b |      11      09
    c |  12      02      08
    d |      03      01
    e |  13      00      07
    f |      04      06
    g |  14      05      18
    h |      15      17
    i |          16
*/

const col = { // col.label is the x-coordinate of the centres of the tiles in
              //   the column with that label in the above diagram.
    a: centre - sideLength * 3 - space * sin60 * 2,
    b: centre - sideLength * 1.5 - space * sin60,
    c: centre,
    d: centre + sideLength * 1.5 + space * sin60,
    e: centre + sideLength * 3 + space * sin60 * 2};
const x = [ // x[n] is the x-coordinate of the centre of the tile numbered n in
            //   the above diagram.
    col.c, col.d, col.c, col.b, col.b, col.c, col.d, col.e, col.e, col.d,
    col.c, col.b, col.a, col.a, col.a, col.b, col.c, col.d, col.e];

const row = { // row.label is the y-coordinate of the centres of the tiles in
              //   the row with that label in the above diagram.
    a: centre - sideLength * sin60 * 4 - space * 2,
    b: centre - sideLength * sin60 * 3 - space * 1.5,
    c: centre - sideLength * sin60 * 2 - space,
    d: centre - sideLength * sin60 - space * 0.5,
    e: centre,
    f: centre + sideLength * sin60 + space * 0.5,
    g: centre + sideLength * sin60 * 2 + space,
    h: centre + sideLength * sin60 * 3 + space * 1.5,
    i: centre + sideLength * sin60 * 4 + space * 2};
const y = [ // y[n] is the y-coordinate of the centre of the tile numbered n in
            //   the above diagram.
    row.e, row.d, row.c, row.d, row.f, row.g, row.f, row.e, row.c, row.b,
    row.a, row.b, row.c, row.e, row.g, row.h, row.i, row.h, row.g];

const adjacent = [ // (i,j) is listed in this array iff:
                   // - 0 <= i < j <= 18
                   // - The tiles numbered i and j in the above diagram share an
                   //   edge.
    [ 0,  1], [ 0,  2], [ 0,  3], [ 0,  4], [ 0,  5], [ 0,  6],
    [ 1,  2], [ 1,  6], [ 1,  7], [ 1,  8], [ 1,  9],
    [ 2,  3], [ 2,  9], [ 2, 10], [ 2, 11],
    [ 3,  4], [ 3, 11], [ 3, 12], [ 3, 13],
    [ 4,  5], [ 4, 13], [ 4, 14], [ 4, 15],
    [ 5,  6], [ 5, 15], [ 5, 16], [ 5, 17],
    [ 6,  7], [ 6, 17], [ 6, 18],
    [ 7,  8], [ 7, 18],
    [ 8,  9],
    [ 9, 10],
    [10, 11],
    [11, 12],
    [12, 13],
    [13, 14],
    [14, 15],
    [15, 16],
    [16, 17],
    [17, 18]];

function full() { // Whether or not every tile is nonempty.
    return tiles.every(n => (n.value != 0));
}

function stuck() { // If full(), whether or not no moves are possible.
    return adjacent.every(p => (tiles[p[0]].value != tiles[p[1]].value));
}

function unmoved() { // Whether or not the last player input moved any tiles.
    return tiles.every(n => (n.id === n.target));
}


// Style constants.

const font = 'Calibri'; // The original 2048 game uses 'Clear Sans'. Since p5
                        //   does not seem to handle that font, Calibri is a
                        //   close and web-safe alternative.

// Unfortunately, color(...) is not accessible outside of the setup() and draw()
//   methods.
var bgColour = {}; // color(187, 173, 160), the fill colour of the canvas.
var colours  = []; // Contains the 21 (counting duplicates) possible fill
                   //   colours of the hexagonal tiles on the board. colours[n]
                   //   is the colour of all tiles displaying the value 2^n, or
                   //   the colour of the empty tile when n = 0. The greatest
                   //   possible tile value achievable on the board is 2^20.
// I intend to change the colour scheme to the one that can be seen at
// https://nicosai.wordpress.com/2014/10/31/10-things-i-learned-from-2048/
/*
    colours = [
        color(205, 193, 180),  // empty
        color(238, 228, 218),  //       2
        color(238, 225, 201),  //       4
        color(243, 178, 122),  //       8
        color(246, 150, 100),  //      16
        color(247, 124,  95),  //      32
        color(247,  95,  59),  //      64
        color(237, 208, 115),  //     128
        color(237, 204,  98),  //     256
        color(237, 201,  80),  //     512
        color(237, 197,  63),  //    1024
        color(237, 194,  46),  //    2048
        color(146, 223,  99),  //    4096
        color(132, 226,  72),  //    8192
        color(135, 228,  49),  //   16384
        color(107, 228,  21),  //   32768
        color(107, 154,  88),  //   65536
        color(107,  87, 161),  //  131072
        color(107,  87, 161),  //  262114
        color(107,  87, 161),  //  524288
        color(107,  87, 161)]; // 1048576
*/


// Internal variables.
const initialSpawn = 4; // The number of tiles spawned at the beginning of each
                        //   game.
var moveFrames = 0;     // The number of frames remaining in the tile-sliding
                    //   animation following a move.
var lose   = false; // Whether or not the player can move.
var score  = 0;     // The player's score.
