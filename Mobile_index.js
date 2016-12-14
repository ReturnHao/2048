/**
 * Created by Return on 14/12/2016.
 */

var Grid_object = document.getElementById("Grid_container"), Start_x, Start_y, documentWidth = window.screen.availWidth;

Grid_object.addEventListener('touchstart', function(event){
    Start_x = event.touches[0].pageX;
    Start_y = event.touches[0].pageY;
});

Grid_object.addEventListener('touchmove', function(event){
    event.preventDefault();
});

Grid_object.addEventListener('touchend', function(event){
    End_x = event.changedTouches[0].pageX;
    End_y = event.changedTouches[0].pageY;
    var Delta_x = End_x - Start_x, Delta_y = End_y - Start_y;
    if ((Math.abs(Delta_x) < 0.03 * documentWidth) && (Math.abs(Delta_y) < 0.03 * documentWidth)) return;
    if (Math.abs(Delta_x) >= Math.abs(Delta_y)){
        if (Delta_x > 0){
            if (Move_right()){
                setTimeout("Generate_num()", 210);
            }
        }
        else{
            if (Move_left()){
                setTimeout("Generate_num()", 210);
            }
        }
    }
    else{
        if (Delta_y > 0){
            if (Move_down()){
                setTimeout("Generate_num()", 210);
            }
        }
        else{
            if (Move_up()){
                setTimeout("Generate_num()", 210);
            }
        }
    }
    setTimeout("Is_game_over()", 300);
});
