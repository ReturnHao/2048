/**
 * Created by Return on 12/12/2016.
 */

var Board = [], Score = 0, Max_score = 0, Disp_score, Alerted, Cur_disp, Has_collide = [];
var Cell_side_length = 100;
var Cell_space = 15;

function Rand_Block(){
    var Seed = Math.random();
    if (Seed < 0.0455) return "X";
    else if (Seed < 0.0909) return "?";
         else return (Seed < 0.6)?(2):(4);
}

function Judge(x, y){
    return ((x >= 0) && (x <= 3) && (y >= 0) && (y <= 3));
}

function Spl(x){
    return ((x == "X") || (x == "?"));
}

function Can_merge(x, y){
    return ((x == y) || (Spl(x)) || (Spl(y)));
}

function Can_vertical(x, Adj){
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++)
            if ((Judge(i, j)) && (Judge(i + Adj, j))) {
                if (x[i][j] != 0) {
                    if ((x[i + Adj][j] == 0) || (Can_merge(x[i + Adj][j], x[i][j]))) return true;
                }
            }
    }
    return false;
}

function Can_horizontal(x, Adj){
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++)
            if ((Judge(i, j)) && (Judge(i, j + Adj))) {
                if (x[i][j] != 0) {
                    if ((x[i][j + Adj] == 0) || (Can_merge(x[i][j + Adj], x[i][j]))) return true;
                }
            }
    }
    return false;
}

function No_space(x){
    for (var i = 0; i < 4; i++){
        for (var j = 0; j < 4; j++){
            if (x[i][j] == 0) return false;
        }
    }
    return true;
}

function No_move(x){
    return !((Can_vertical(Board, -1)) || (Can_vertical(Board, 1)) || (Can_horizontal(Board, -1)) || (Can_horizontal(Board, 1)));
}

function Is_game_over(){
    if (((No_space(Board)) && (No_move(Board))) || (Score == 1)){
        if (!Alerted) {
            Alerted = 1;
            alert("Game Over ! :(");
            Max_score = Score;
        }
    }
}

function Get_background_color(x){
    switch(x){
        case 2: return "#eee4da"; break;
        case 4: return "#ede0c8"; break;
        case 8: return "#f2b179"; break;
        case 16: return "#f59563"; break;
        case 32: return "#f67c5f"; break;
        case 64: return "#f65e3b"; break;
        case 128: return "#edcf72"; break;
        case 256: return "#edcc61"; break;
        case 512: return "#9c0"; break;
        case 1024: return "#33b5e5"; break;
        case 2048: return "#09c"; break;
        case 4096: return "#a6c"; break;
        case 8192: return "#93c"; break;
    }
    return "black";
}

function Get_number_color(x){
    if (x <= 4){
        return '#776a65';
    }
    return "white";
}

function Get_number_size(x){
    if (x == "?") return 60;
    if (x == "X") return 55;
    if (x <= 64) return 60;
    else
        if (x <= 512) return 55;
        else
            if (x <= 8192) return 43;
    return 35;
}

function Get_length(x){
    return Cell_space + x * (Cell_side_length + Cell_space);
}

function Draw_canvas(){
    for (var i = 0; i < 4; i++){
        for (var j = 0; j < 4; j++){
            var cell = document.getElementById('grid_cell_' + i + '_' + j);
            cell.style.top = Get_length(i) + "px";
            cell.style.left = Get_length(j) + "px";
            cell.style.margin = "27px";
        }
    }
}

function Draw_board(){
    $(".number_cell").remove();
    for (var i = 0; i < 4; i++){
        for (var j = 0; j < 4; j++){
            $("#Grid_container").append('<div class="number_cell" id="number_cell_' + i + '_' + j + '"></div>');
            var Current = $('#number_cell_' + i + '_' + j);
            if (Board[i][j] == 0){
                Current.css({
                    'width':'0px',
                    'height':'0px',
                    'top': Get_length(i) + 0.5 * Cell_side_length,
                    'left': Get_length(j) + 0.5 * Cell_side_length
                })
            }
            else{
                Current.css({
                    'width': Cell_side_length,
                    'height': Cell_side_length,
                    'top': Get_length(i),
                    'left': Get_length(j),
                    'margin' : 27,
                    'background-color': Get_background_color(Board[i][j]),
                    'color': Get_number_color(Board[i][j]),
                    'font-size': Get_number_size(Board[i][j])
                }).text(Board[i][j]);
            }
            Has_collide[i][j] = false;
        }
    }
}

function Draw_number(x, y, num){
    var Current = $("#number_cell_" + x + "_" + y);
    Current.css({
        'background': Get_background_color(num),
        'color': Get_number_color(num),
        'font-size': Get_number_size(num)
    }).text(num);
    Current.animate({
        width: Cell_side_length,
        height: Cell_side_length,
        top: Get_length(x),
        left: Get_length(y),
        margin: 27
    }, 50);
}

function Draw_moving(x1, y1, x2, y2){
    var Current = $("#number_cell_" + x1 + "_" + y1);
    Current.animate({
        top: Get_length(x2),
        left: Get_length(y2)
    }, 200);
}

function Update_score(x){
    var Display_score = document.getElementById("score");
    Display_score.innerText = x;
}

function No_block_horizontal(row, start, end){
    if (start > end) { var tmp = start; start = end; end = tmp; }
    for (var i = start + 1; i < end; i++)
        if (Board[row][i] != 0) return false;
    return true;
}

function No_block_vertical(col, start, end){
    if (start > end) { var tmp = start; start = end; end = tmp; }
    for (var i = start +1; i < end; i++)
        if (Board[i][col] != 0) return false;
    return true;
}

function Upload_horizontal(i, j, k){
    if ((Board[i][k] == 0) && No_block_horizontal(i, k, j)){
        Draw_moving(i, j, i, k);
        Board[i][k] = Board[i][j];
        Board[i][j] = 0;
    }
    else{
        if ((Can_merge(Board[i][k], Board[i][j])) && (No_block_horizontal(i, k, j)) && (!Has_collide[i][k])){
            if ((Board[i][k] != "?") && (Board[i][j] != "?")) Draw_moving(i, j, i, k);
            if ((Spl(Board[i][k])) && (Spl(Board[i][j]))){
                Board[i][k] = "X";
                Board[i][j] = 0;
                Has_collide[i][k] = true;
                return;
            }
            var Bomb = Math.random(), Ref = 0;
            if ((Board[i][k] == "?") || (Board[i][j] == "?")){
                if (Bomb < 0.2){
                    Ref = 1;
                    Board[i][k] = 0;
                    if (Judge(i - 1, k)) Board[i - 1][k] = 0;
                    if (Judge(i + 1, k)) Board[i + 1][k] = 0;
                    if (Judge(i, k - 1)) Board[i][k - 1] = 0;
                    if (Judge(i, k + 1)) Board[i][k + 1] = 0;
                }
            }
            if (Spl(Board[i][k])){
                if (Board[i][k] == "X"){
                    Board[i][k] = 2 * Board[i][j];
                    Score += Board[i][j];
                }
            }
            else{
                if (Board[i][j] == "X"){
                    Board[i][k] = 2 * Board[i][k];
                    Score += Board[i][k];
                }
                else
                    if (Board[i][j] != "?"){
                        Board[i][k] = 2 * Board[i][k];
                        Score += Board[i][k];
                    }
            }
            if (Board[i][j] != "?") Board[i][j] = 0;
            else if (Ref == 1) Board[i][j] = 0;
            Update_score(Score);
            Has_collide[i][k] = true;
        }
    }
}

function Upload_vertical(i, j, k){
    if ((Board[k][j] == 0) && No_block_vertical(j, k, i)){
        Draw_moving(i, j, k, j);
        Board[k][j] = Board[i][j];
        Board[i][j] = 0;
    }
    else{
        if ((Can_merge(Board[k][j], Board[i][j])) && (No_block_vertical(j, k ,i)) && (!Has_collide[k][j])){
            if ((Board[k][j] != "?") && (Board[i][j] != "?")) Draw_moving(i, j, k, j);
            if ((Spl(Board[k][j])) && (Spl(Board[i][j]))){
                Board[k][j] = "X";
                Board[i][j] = 0;
                Has_collide[k][j] = true;
                return;
            }
            var Bomb = Math.random(), Ref = 0;
            if ((Board[k][j] == "?") || (Board[i][j] == "?")){
                if (Bomb < 0.2){
                    Ref = 1;
                    Board[k][j] = 0;
                    if (Judge(k - 1, j)) Board[k - 1][j] = 0;
                    if (Judge(k + 1, j)) Board[k + 1][j] = 0;
                    if (Judge(k, j - 1)) Board[k][j - 1] = 0;
                    if (Judge(k, j + 1)) Board[k][j + 1] = 0;
                }
            }
            if (Spl(Board[k][j])){
                if (Board[k][j] == "X"){
                    Board[k][j] = 2 * Board[i][j];
                    Score += Board[i][j];
                }
            }
            else{
                if (Board[i][j] == "X"){
                    Board[k][j] = 2 * Board[k][j];
                    Score += Board[k][j];
                }
                else
                    if (Board[i][j] != "?"){
                        Board[k][j] = 2 * Board[k][j];
                        Score += Board[k][j];
                    }
            }
            if (Board[i][j] != "?") Board[i][j] = 0;
            else if (Ref == 1) Board[i][j] = 0;
            Update_score(Score);
            Has_collide[k][j] = true;
        }
    }
}

function Move_left(){
    if (!Can_horizontal(Board, -1)) return false;
    for (var i = 0; i < 4; i++){
        for (var j = 0; j < 4; j++){
            if (Board[i][j] != 0){
                for (var k = 0; k < j; k++){
                    Upload_horizontal(i, j, k);
                }
            }
        }
    }
    setTimeout("Draw_board()", 200);
    return true;
}

function Move_right(){
    if (!Can_horizontal(Board, 1)) return false;
    for (var i = 0; i < 4; i++){
        for (var j = 2; j >= 0; j--){
            if (Board[i][j] != 0){
                for (var k = 3; k > j; k--){
                    Upload_horizontal(i, j, k);
                }
            }
        }
    }
    setTimeout("Draw_board()", 200);
    return true;
}

function Move_up(){
    if (!Can_vertical(Board, -1)) return false;
    for (var i = 1; i < 4; i++){
        for (var j = 0; j < 4; j++){
            if (Board[i][j] != 0){
                for (var k = 0; k < i; k++){
                    Upload_vertical(i, j, k);
                }
            }
        }
    }
    setTimeout("Draw_board()", 200);
    return true;
}

function Move_down(){
    if (!Can_vertical(Board, 1)) return false;
    for (var i = 2; i >= 0; i--){
        for (var j = 0; j < 4; j++){
            if (Board[i][j] != 0){
                for (var k = 3; k > i; k--){
                    Upload_vertical(i, j, k);
                }
            }
        }
    }
    setTimeout("Draw_board()", 200);
    return true;
}

$(document).keydown(function(event){
    switch (event.keyCode){
        case 37:
            event.preventDefault();
            if (Move_left()){
                setTimeout("Generate_num()", 210);
            }
            break;
        case 38:
            event.preventDefault();
            if (Move_up()){
                setTimeout("Generate_num()", 210);
            }
            break;
        case 39:
            event.preventDefault();
            if (Move_right()){
                setTimeout("Generate_num()", 210);
            }
            break;
        case 40:
            event.preventDefault();
            if (Move_down()){
                setTimeout("Generate_num()", 210);
            }
            break;
        default:
            break;
    }
    setTimeout("Is_game_over()", 300);
});

function Modify(x){
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) {
            if ((x == 0.5) && (Board[i][j] == 2)) continue;
            Board[i][j] *= x;
        }
}

function Tiger_Mode(){
    if ((Alerted != 1) && (Score != 0)){
        Score = parseInt(Score / 2);
        Update_score(Score);
        setTimeout("Is_game_over()", 300);
        if (Math.random() < 0.2) Modify(2);
        else Modify(0.5);
        Draw_board();
    }
}

function Init(){
    Alerted = 0;
    for (var i = 0; i < 4; i++){
        Board[i] = new Array();
        Has_collide[i] = new Array();
        for (var j = 0; j < 4; j++){
            Board[i][j] = Has_collide[i][j] = 0;
        }
    }
    Draw_board();
    Score = 0;
    Update_score(Score);
}

function Generate_num(){
    if (No_space(Board)) return false;
    var Rand_x = parseInt(Math.floor(Math.random() * 4)),
        Rand_y = parseInt(Math.floor(Math.random() * 4)),
        Rand_num = Rand_Block();
    while (true){
        if (Board[Rand_x][Rand_y] == 0) break;
        Rand_x = parseInt(Math.floor(Math.random() * 4));
        Rand_y = parseInt(Math.floor(Math.random() * 4));
    }
    Board[Rand_x][Rand_y] = Rand_num;
    Draw_number(Rand_x, Rand_y, Rand_num);
}

function High_score(){
    var Score_button = document.getElementById("High_score");
    if (Disp_score == 1){
        Cur_disp = "High score!";
        Disp_score = 0;
    }
    else{
        Cur_disp = Max_score;
        Disp_score = 1;
    }
    Score_button.innerHTML = Cur_disp;
    /*if (Disp_score == 1){
        Score_button.style.fontFamily = "DIN Alternate";
        Score_button.style.fontSize = "20px";
    }
    else{
        Score_button.style.fontFamily = "Microsoft YaHei";
        Score_button.style.fontSize = "15px";
    }*/
}

function New_game(){
    Init();
    Generate_num();
    Generate_num();
}

function Start() {
    Draw_canvas();
    New_game();
}

Start();
