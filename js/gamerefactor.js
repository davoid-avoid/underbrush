//initial variables
var hardwin = 0;
var caption = false;
var interval = 0;
var doomtimer = false;

var unbr = {};

unbr.init = function(){
    unbr.click1 = 0;
    unbr.colourgrab = 0;
    unbr.discard = [];
    unbr.donecheck = true;
    unbr.drawdeck = [];
    unbr.droppingspirit = false;
    unbr.elements = 0;
    unbr.found = false;
    unbr.gameover = false;
    unbr.ghostpresent = false;
    unbr.godcolour = 0;
    unbr.godpresent = false;
    unbr.hand = [];
    unbr.limbo = [];
    unbr.normselect = 0;
    unbr.score = 0;
    unbr.scoring = [];
    unbr.scoringgod = false;
    unbr.selected = [];
    unbr.selectedcard = 0;
    unbr.sequence = [];
    unbr.spiritcolour = false;
    unbr.spiritexchange = 0;
    unbr.sniping = false;
    unbr.spiritsnipe = false;
    unbr.swapselect1 = 0;
    unbr.swapselect2 = 0;
    unbr.hardplay = false;
    unbr.lamppercent = 1;
    unbr.lamptotal = 100;
    unbr.playingeasy = false;
    unbr.playinghard = false;
    unbr.playingmaster = false;
    unbr.ghostcount = 0;
    unbr.counter = 6;
};


//shuffles the deck

function shuffle(array) {
    var m = array.length,
        t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

//this function allows for a new hand to be drawn, ensuring all gods and ghosts are shuffled back into the deck if drawn into this hand


function drawhandstart() {
    if (unbr.drawdeck.length > (5 + (8 - unbr.score) + (10 - unbr.ghostcount))){
    for (i = 0; i <= 4; i++) {
        unbr.hand.unshift(unbr.drawdeck[0]);
        unbr.drawdeck.shift();
        if (caption === false){
        $("#hand").append("<div class='card unrotate " + unbr.hand[0][0] + " " + unbr.hand[0][1] + "'></div>");
        }
        if (caption === true){
        $("#hand").append("<div class='card unrotate " + unbr.hand[0][0] + " " + unbr.hand[0][1] + "'><p>"+ unbr.hand[0][0] +"</p></div>");
        }
        $("#hand div:last").fadeIn(400);
        $("#hand div:last").removeClass("unrotate");
        if (unbr.hand[0][1] === 'god' || unbr.hand[0][0] === 'ghost' && unbr.drawdeck.length > 0) {
            unbr.limbo.unshift(unbr.hand[0]);
            unbr.hand.shift();
            $("#hand div:last").remove()
            i--;
        }
        }
        limboshuffle();
        } else {
            console.log("fixing ghost problem");
            unbr.ghostpresent = false;
            unbr.godpresent = false;
            drawcard();
        }
    
}

//this function shuffles the limbo deck back into the draw deck

function limboshuffle() {
    if (unbr.limbo.length > 0) {
        for (var l = 0, d = (unbr.limbo.length - 1); l <= d; l++) {
            unbr.drawdeck.push(unbr.limbo[0]);
            shuffle(unbr.drawdeck);
            unbr.limbo.shift();
        }
    }
}

//this function needs to run through both the remainder of the deck, and check to see if it's just gods, and then it needs to see if the player has any spirits in hand of the same colour

function endgamecheck() {
    var godcount = 0;
    var spiritcount = 0;
    var rightSpirit = false;
    for (i = 0, j = unbr.drawdeck.length - 1; i <= j; i++) {
        if (unbr.drawdeck[i][1] === 'god') {
            godcount++;
        }
    }
    for (s = 0, h = unbr.hand.length -1; s <= h; s++ ){
        if (unbr.hand[s][1] === 'spirit'){
            spiritcount++;
        }
    }
    if (unbr.drawdeck.length === godcount && spiritcount === 0){
        loss();
        console.log("loss condition 0");
    }
    else if (unbr.drawdeck.length === 0 && unbr.hand[0][1] === 'god' && spiritcount === 0 || unbr.drawdeck.length >= 1 && godcount == unbr.drawdeck.length && spiritcount === 0){
        loss();
        console.log("loss condition 1");
    }
    else if (unbr.drawdeck.length > 0 && unbr.hand[0][1] === 'god' && spiritcount >= 1){
            for (var sh = 0; sh <= unbr.hand.length - 1; sh++){
                if (unbr.hand[sh][1] == 'spirit'){
                    if (unbr.hand[sh][0] === unbr.hand[0][0]){
                        console.log("correct spirit detected");
                        rightSpirit = true;
                    }
                }
            }
            if (rightSpirit === false){
                loss();
                console.log("loss condition 2");
            }
        }
    else if (unbr.drawdeck.length === 0 && unbr.hand[0][1] === 'god' && spiritcount >= 1){
            for (var sh = 0; sh <= unbr.hand.length - 1; sh++){
                if (unbr.hand[sh][1] == 'spirit'){
                    if (unbr.hand[sh][0] === unbr.hand[0][0]){
                        console.log("correct spirit detected");
                        rightSpirit = true;
                    }
                }
            }
            if (rightSpirit === false){
                loss();
                console.log("loss condition 2");
            }
        }
    unbr.donecheck = true;
    console.log("done endgame check");
}

//notifies the user of stuff, opens modal box

function notificationcloseclick(){
    $.fancybox({
    'autoScale': true,
    'transitionIn': 'elastic',
    'transitionOut': 'elastic',
    'speedIn': 500,
    'speedOut': 300,
    'centerOnScroll': true,
    'href' : '#preview',
    'closeBtn' : false,
    'modal' : false,
    'closeClick' : true
    });
}

//this function allows the player to draw a new card unless the draw deck is empty

function drawcard() {
    cardcount(); 
    if (unbr.limbo.length > 0){
        if (unbr.drawdeck.length < (5 + (8 - unbr.score))) {
            limboshuffle();
        }
    }
    if (unbr.hand.length <= 4){
        for (i = unbr.hand.length; i <= 4; i++){
            if (unbr.ghostpresent == false && unbr.godpresent == false){
                unbr.hand.unshift(unbr.drawdeck[0]);
                if (caption === false){
                $("#hand").append("<div class='card unrotate " + unbr.drawdeck[0][0] + " " + unbr.drawdeck[0][1] + "'></div>");
                }
                if (caption === true){
                $("#hand").append("<div class='card unrotate " + unbr.drawdeck[0][0] + " " + unbr.drawdeck[0][1] + "'><p>"+ unbr.drawdeck[0][0] +"</p></div>");
                }
                $("#hand div:last").fadeIn(400);
                $("#hand div:last").removeClass("unrotate");
                unbr.drawdeck.shift();
                ghostcheck();
                godcheck();
            }
        }
    }
    if (unbr.limbo.length > 0){
        if (unbr.drawdeck.length >= (5 + (8 - unbr.score))) {
            limboshuffle();
        }
    }
}


function win() {
    unbr.lamppercent = 1;
    lampfade();
    $("#infocard").empty();
    $("#preview").empty();
    $("#preview").append("<div id='cardpreviewinstruction'><p>You got all 8! You won with " + unbr.drawdeck.length + " cards left in the deck.</p></div>");
    notificationcloseclick();
        unbr.gameover = true;
        if (doomtimer === true){
        $("#doomcount").empty();
        clearInterval(interval);
    }
    if (unbr.playinghard === true){
        hardwin++;
    }
    if (hardwin === 1 && unbr.playingeasy === false && unbr.playingmaster === false){
        $("#cardpreviewinstruction").append("<p><b>Master Mode and Doom Timer unlocked!</b></p>");
    }
    if (unbr.playingeasy === true){
        $("#infocard").append("<br><p class='option' id='easy'>Play Again?</p>");    
    }
    if (unbr.playinghard === true){
        $("#infocard").append("<br><p class='option' id='hard'>Play Again?</p>");   
    }
    if (unbr.playingmaster === true){
        $("#infocard").append("<br><p class='option' id='master'>Play Again?</p>");    
    }
    $("#infocard").append("<p class='option' id='menu'>Main Menu</p>");
    return;
}

function loss() {
        unbr.lamppercent = 0;
    lampfade();
    $("#infocard").empty();
    $("#preview").empty();
    $("#preview").append("<div id='cardpreviewinstruction'><p>Oh no! You lost! Try again!</p></div>");
    notificationcloseclick();
        unbr.gameover = true;
        if (doomtimer === true){
        $("#doomcount").empty();
        clearInterval(interval);
    }

    if (unbr.playingeasy === true){
        $("#infocard").append("<br><p class='option' id='easy'>Play Again?</p>");    
    }
    if (unbr.playinghard === true){
        $("#infocard").append("<br><p class='option' id='hard'>Play Again?</p>");    
    }
    if (unbr.playingmaster === true){
        $("#infocard").append("<br><p class='option' id='master'>Play Again?</p>");    
    }
    $("#infocard").append("<p class='option' id='menu'>Main Menu</p>");
    return;
}


//if a god card is drawn, this function checks for any spirits in hand, and, if the right colour is present, offers to let the player trade in that spirit for an immmediate point

function godcheck() {
    for (g = 0, k = unbr.hand.length - 1; g <= k; g++){
        if (unbr.hand[g][1] == 'god'){
            unbr.godpresent = true;
            var spirithere = 0;
            var spiritlocal = [];
            var scored = false;
            for (i = 0, j = unbr.hand.length - 1; i <= j; i++) {
                if (unbr.hand[i][1] === 'spirit') {
                    spirithere++;
                    spiritlocal.push(i);
                } else {
                }
            }
            if (spirithere > 0) {
                unbr.godcolour = unbr.hand[0][0];
                for (s = 0, h = spiritlocal.length - 1; s <= h; s++) {
                    if (unbr.hand[spiritlocal[s]][0] === unbr.godcolour && unbr.scored != true) {
                        unbr.spiritexchange = unbr.hand[spiritlocal[s]];
                        unbr.normselect = $('.card').index(s);
                        unbr.spiritcolour = true;
                    }
                }
            }
        }
    }
}

//function checks for ghost card draws

function ghostcheck() { 
    for (g = 0, k = unbr.hand.length-1; g <= k; g++){
        if (unbr.hand[g][0] == 'ghost'){
        unbr.ghostpresent = true;
        } 
        if (unbr.hand[0][0] == 'ghost'){
            unbr.ghostpresent = true;
        }
    }
}

//finds a god in the deck, removes it, adds score

function findremovegod() {
    for (var i = 0; i <= unbr.drawdeck.length -1; i++){
        if (unbr.drawdeck[i][1] === 'god' && unbr.drawdeck[i][0] === unbr.colourgrab && unbr.found === false){
            unbr.score++;
            unbr.scoring.unshift(unbr.drawdeck[i]);
            unbr.drawdeck.splice(i, 1);
            godindicator();
            $("#infocard").append("<p>The God whisks you off to a new place in the forest.</p>");
            shuffle(unbr.drawdeck);
            unbr.found = true;
            unbr.colourgrab = 0;
        }
    }
    unbr.found = false;
}

//the function that allows a player to discard a card, and then draw anew

function discardcard() {
    unbr.discard.unshift((unbr.hand[unbr.selected[0]]));
    unbr.hand.splice(unbr.selected[0], 1);
    $(".card").slice(unbr.normselect, unbr.normselect+1).fadeOut(200);
    $(".card").slice(unbr.normselect, unbr.normselect+1).remove();
    drawcard();
}

//discarding the players hand

function discardhand() {
    cardcount();
    unbr.discard.unshift(unbr.hand);
    unbr.hand = [];
    $("#hand div").fadeOut(200);
    $("#hand").empty();
    drawhandstart();
}

//this is where we add new cards to the sequence the player is building from their hand

function sequenceadd() {
    	unbr.sequence.push(unbr.hand[unbr.selected[0]]);
        if (caption === false){
    	   $("#sequence").append("<div class='cardsequence " + unbr.hand[unbr.selected[0]][0] + " " + unbr.hand[unbr.selected[0]][1] + "'></div>");
        }
        if (caption === true){
            $("#sequence p:last").remove();
             if (unbr.sequence.length == 1){
        $("#sequence").append("<div class='cardsequence " + unbr.hand[unbr.selected[0]][0] + " " + unbr.hand[unbr.selected[0]][1] + "'><p>" + unbr.hand[unbr.selected[0]][0] + "</p></div>");
    }  else if (unbr.sequence.length == 2){
        $("#sequence").append("<div class='cardsequence " + unbr.hand[unbr.selected[0]][0] + " " + unbr.hand[unbr.selected[0]][1] + "'><p>"  + unbr.sequence[0][0] + " - " + unbr.hand[unbr.selected[0]][0] + "</p></div>");
    } else if (unbr.sequence.length == 3){
        $("#sequence").append("<div class='cardsequence " + unbr.hand[unbr.selected[0]][0] + " " + unbr.hand[unbr.selected[0]][1] + "'><p>"  + unbr.sequence[0][0] + " - "  + unbr.sequence[1][0] + " - " + unbr.hand[unbr.selected[0]][0] + "</p></div>");
    } else if (unbr.sequence.length >= 4){
        $("#sequence").append("<div class='cardsequence " + unbr.hand[unbr.selected[0]][0] + " " + unbr.hand[unbr.selected[0]][1] + "'><p>"  + unbr.sequence[unbr.sequence.length-3][0] + " - "  + unbr.sequence[unbr.sequence.length-2][0] + " - " + unbr.hand[unbr.selected[0]][0] + "</p></div>");
    }
        }
    	unbr.hand.splice(unbr.selected[0], 1);
    	 $(".card").slice(unbr.normselect, unbr.normselect+1).remove();
    	sequencecheck();
    	drawcard();
}

//checks if the last 3 cards in the sequence are the same colour or not

function sequencecheck() {
    unbr.colourgrab = unbr.sequence[unbr.sequence.length - 1][0];
	if (unbr.sequence.length === 3 ){
		if (unbr.sequence[unbr.sequence.length -1][0] === unbr.sequence[unbr.sequence.length -2][0] && unbr.sequence[unbr.sequence.length - 1][0] === unbr.sequence[unbr.sequence.length - 3][0]) {
            findremovegod();
		}
	}
    if (unbr.sequence.length === 6 ){
        if (unbr.sequence[unbr.sequence.length -1][0] === unbr.sequence[unbr.sequence.length -2][0] && unbr.sequence[unbr.sequence.length - 1][0] === unbr.sequence[unbr.sequence.length - 3][0] && unbr.sequence[unbr.sequence.length - 1][0] === unbr.sequence[unbr.sequence.length - 4][0] && unbr.sequence[unbr.sequence.length - 1][0] === unbr.sequence[unbr.sequence.length - 5][0] && unbr.sequence[unbr.sequence.length - 1][0] === unbr.sequence[unbr.sequence.length - 6][0]) {
            findremovegod();
        } else if (unbr.sequence[unbr.sequence.length -1][0] === unbr.sequence[unbr.sequence.length -2][0] && unbr.sequence[unbr.sequence.length - 1][0] === unbr.sequence[unbr.sequence.length - 3][0] && unbr.sequence[unbr.sequence.length - 1][0] !== unbr.sequence[unbr.sequence.length - 4][0]) {
            findremovegod();
        }
    } 
    else if (unbr.sequence.length >= 4 ){
        if (unbr.sequence[unbr.sequence.length -1][0] === unbr.sequence[unbr.sequence.length -2][0] && unbr.sequence[unbr.sequence.length - 1][0] === unbr.sequence[unbr.sequence.length - 3][0] && unbr.sequence[unbr.sequence.length - 1][0] !== unbr.sequence[unbr.sequence.length - 4][0]) {
            findremovegod();
        }
    }
    if (unbr.sequence.length >= 7 ){
        if (unbr.sequence[unbr.sequence.length -1][0] === unbr.sequence[unbr.sequence.length -2][0] && unbr.sequence[unbr.sequence.length -1][0] === unbr.sequence[unbr.sequence.length - 3][0] && unbr.sequence[unbr.sequence.length -1][0] === unbr.sequence[unbr.sequence.length - 4][0] && unbr.sequence[unbr.sequence.length -1][0] === unbr.sequence[unbr.sequence.length - 5][0] && unbr.sequence[unbr.sequence.length - 1][0] === unbr.sequence[unbr.sequence.length - 6][0] && unbr.sequence[unbr.sequence.length - 1][0] !== unbr.sequence[unbr.sequence.length - 7][0]) {
            findremovegod();
        } else if (unbr.sequence[unbr.sequence.length -1][0] === unbr.sequence[unbr.sequence.length -2][0] && unbr.sequence[unbr.sequence.length - 1][0] === unbr.sequence[unbr.sequence.length - 3][0] && unbr.sequence[unbr.sequence.length - 1][0] !== unbr.sequence[unbr.sequence.length - 4][0]) {
            findremovegod();
        }
    }
}


//gets the selection from clicking, which can be used to identify the card clicked for purposes of cross examining it with hand. Also resolves special cases with gods and ghosts in selection

$(document).on('click', '.card', function() {
    if (unbr.gameover == false){
        if(unbr.droppingspirit == false && unbr.scoringgod == false){
	       unbr.elements = $('.card');
	       unbr.normselect = $('.card').index(this);
	       unbr.selected[0] = (unbr.elements.length -unbr.elements.index(this))-1;
            unbr.selectedcard = (this);
	       $("#infocard").empty();
	       cardchoice();
        }
        if (unbr.droppingspirit == true){
            unbr.elements = $('.card');
            unbr.normselect = $('.card').index(this);
            unbr.selected[0] = (unbr.elements.length -unbr.elements.index(this))-1;
            if(unbr.hand[unbr.selected[0]][1] == 'spirit'){
                unbr.discard.unshift(unbr.hand[unbr.selected[0]])
                unbr.discard.unshift(unbr.hand[0]);
                unbr.hand.splice(unbr.selected[0], 1);
                cardshift();
                unbr.ghostpresent = false;
                unbr.droppingspirit = false;
                $("#infocard").empty();
                drawcard();
                if (doomtimer === true){
                    clearInterval(interval);
                    unbr.counter = 6;
                    counter();
                }
            } else {
            $("#infocard").empty();
            $("#infocard").append("<p>That isn't a Spirit card. Please select a Spirit card.<br></p>");
            $("#infocard").append("<p id='ghostcancel' class='option'>I changed my mind<br></p>");   
        }
        }         if (unbr.scoringgod == true) {
            unbr.elements = $('.card');
            unbr.normselect = $('.card').index(this);
            unbr.selected[0] = (unbr.elements.length -unbr.elements.index(this))-1;
            if(unbr.hand[unbr.selected[0]][1] == 'spirit' && unbr.hand[unbr.selected[0]][0] == unbr.godcolour){
                unbr.scoring.unshift(unbr.hand[0]);
                unbr.discard.unshift(unbr.hand[unbr.selected]);
                unbr.hand.splice(unbr.selected, 1);
                $("#infocard").empty();
                cardshift();
                unbr.godpresent = false;
                unbr.spiritexchange = false;
                unbr.scoringgod = false;
                unbr.spiritcolour = false;
                unbr.score++;
                godindicator();
                if (doomtimer === true){
                    clearInterval(interval);
                    unbr.counter = 6;
                    counter();
                }
                drawcard();
            }
        }
    }
});

//moves cards from hand to discard

function cardshift(){
    unbr.hand.shift();
    $(".card").slice(unbr.normselect, unbr.normselect+1).fadeOut(200);
    $(".card").slice(unbr.normselect, unbr.normselect+1).remove();
    $("#hand div:last").remove()
}

//drops next 5 unseen cards, shuffles gods or ghosts back into the deck

function dropunseen(){
    for(i = 0; i <= 4; i++){
        if (unbr.drawdeck[0][1] === 'god' || unbr.drawdeck[0][0] === 'ghost') {
            unbr.limbo.unshift(unbr.drawdeck[0]);
            unbr.drawdeck.shift();
            i--;
        } else {
        unbr.discard.unshift(unbr.drawdeck[0]);
        unbr.drawdeck.shift();
        limboshuffle();
    }
    }
    $("#preview").empty();
    $("#preview").append("<div id ='cardpreviewinstruction'>Here are the cards you dropped</div><br>");
        for (i = 0; i <= 4; i++){
            if (caption === false){
        $("#preview").append("<div class ='cardprev " + unbr.discard[i][0] + " " + unbr.discard[i][1] +"'></div>");
        }
        if (caption === true){
            $("#preview").append("<div class ='cardprev " + unbr.discard[i][0] + " " + unbr.discard[i][1] +"'><p>" + unbr.discard[i][0] + "</p></div>");
        }
        if (caption === false){
        notificationcloseclick();
    }
        if (caption === true){
    $.fancybox({
    'autoSize' : false,
    'transitionIn': 'elastic',
    'transitionOut': 'elastic',
    'speedIn': 500,
    'speedOut': 300,
    'width' : 680,
    'height' : 260,
    'topRatio' : 0.85,
    'href' : '#preview',
    'closeBtn' : false,
    'modal' : false,
    'closeClick' : true
    });
        }
    }
    $("#infocard").empty();
    cardcount();
    unbr.discard.unshift(unbr.hand[0]);
    unbr.hand.shift();
    unbr.ghostpresent = false;
    limboshuffle();
    drawcard();   
}

function godindicator(){
    $("#preview").empty();
    $("#preview").append("<div id ='cardpreviewinstruction'>You scored a God!</div><br>");
    if (caption === false){
    $("#preview").append("<div class ='cardprev " + unbr.scoring[0][0] + " " + unbr.scoring[0][1] +"'></div>");
    }
    if (caption === true){
      $("#preview").append("<div class ='cardprev " + unbr.scoring[0][0] + " " + unbr.scoring[0][1] +"'><p>" + unbr.scoring[0][0] + "</p></div>");  
    }
    if (caption === false){
    notificationcloseclick();
    }
    if (caption === true){
        $.fancybox({
    'autoSize' : false,
    'transitionIn': 'elastic',
    'transitionOut': 'elastic',
    'speedIn': 500,
    'speedOut': 300,
    'width' : 150,
    'height' : 260,
    'topRatio' : 0.5,
    'href' : '#preview',
    'closeBtn' : false,
    'modal' : false,
    'closeClick' : true
    });
    }
}

$(document).ready(function() {
    $(".fancybox").fancybox();
});    

//creates the spirit power view

function spiritpower(){
    unbr.hand.splice(unbr.selected, 1);
    $(".card").slice(unbr.normselect, unbr.normselect+1).fadeOut(200);
    $(".card").slice(unbr.normselect, unbr.normselect+1).remove();
    spiritview();
}

//does the visual parts of the spirit power

function spiritview(){
    $("#preview").empty();
    $("#preview").append("<div id ='cardpreviewinstruction'>Here are the next 5 cards in the deck. You must choose 1 to discard. You may not discard Gods.</div>");
    if (unbr.drawdeck.length <= 5){
        for (c = 0; c <= unbr.drawdeck.length-1; c++){
            if (caption === false){
    $("#preview").append("<div class ='cardprev " + unbr.drawdeck[c][0] + " " + unbr.drawdeck[c][1] +"'></div>");
    }
    if (caption === true){
        $("#preview").append("<div class ='cardprev " + unbr.drawdeck[c][0] + " " + unbr.drawdeck[c][1] +"'><p>" + unbr.drawdeck[c][0] + "</p></div>");
    }
    }
    } else {
    for (i = 0; i <= 4; i++){
     if (caption === false){
    $("#preview").append("<div class ='cardprev " + unbr.drawdeck[i][0] + " " + unbr.drawdeck[i][1] +"'></div>");
    }
    if (caption === true){
        $("#preview").append("<div class ='cardprev " + unbr.drawdeck[i][0] + " " + unbr.drawdeck[i][1] +"'><p>" + unbr.drawdeck[i][0] + "</p></div>");
    }
    }
    }
    if (caption === false){
    $.fancybox({
    'autoSize' : true,
    'transitionIn': 'elastic',
    'transitionOut': 'elastic',
    'speedIn': 500,
    'speedOut': 300,
    'width' : 680,
    'height' : 280,
    'topRatio' : 0.85,
    'href' : '#preview',
    'closeBtn' : false,
    'modal' : true
});
}
    if (caption === true){
    $.fancybox({
    'autoSize' : false,
    'transitionIn': 'elastic',
    'transitionOut': 'elastic',
    'speedIn': 500,
    'speedOut': 300,
    'width' : 680,
    'height' : 290,
    'topRatio' : 0.85,
    'href' : '#preview',
    'closeBtn' : false,
    'modal' : true
});
  }
}

//click selection for spirit sniper

$(document).on('click', '.cardprev', function() {
    if (unbr.sniping == true){
    unbr.elements = $('.cardprev');
    unbr.normselect = $('.cardprev').index(this);
    unbr.selected[0] = (unbr.elements.length -unbr.elements.index(this))-1;
    $('#selectedsnipe').attr('id','');
    $(this).attr('id', 'selectedsnipe');
    $('#snipeconfirm').remove();
    $("#cardpreviewinstruction").append("<div id='snipeconfirm'><p class='option'>Is this card ok to discard?</p></div>");
    }
});

$(document).on('click', '#snipeconfirm', function() {
    unbr.spiritsnipe = true;
    spiritsniper();
});

//lets the user kill a card in spirit view

function spiritsniper(){
    var godcount = 0;
    if (unbr.drawdeck.length <= 4){
        for (i = 0, j = unbr.drawdeck.length -1; i <= j; i++){
            if(unbr.drawdeck[i][1] === 'god'){
                godcount++;
                if(godcount === unbr.drawdeck.length){
                    loss();
                }
            }
        }
    }
    if (unbr.spiritsnipe == true && unbr.drawdeck[unbr.normselect][1] != 'god'){
    if (unbr.drawdeck[unbr.normselect][0] == 'ghost'){
        unbr.ghostcount++;
    }
    unbr.discard.unshift(unbr.drawdeck[unbr.normselect]);
    unbr.drawdeck.splice(unbr.normselect, 1);
    $(".cardprev").slice(unbr.normselect, unbr.normselect+1).remove();
    unbr.spiritsnipe = false;
    unbr.sniping = false;
    $("#preview").empty();
    $("#preview").append("<div id ='cardpreviewinstruction'>Choose cards to swap their locations</div><div id ='okdone'><p class='option'>Ok, I'm finished.</p></div>");
    for (i = 0; i <= 3; i++){
        if (caption === false){
    $("#preview").append("<div class ='cardprev2 " + unbr.drawdeck[i][0] + " " + unbr.drawdeck[i][1] +"'></div>");
    }
    if (caption === true){
        $("#preview").append("<div class ='cardprev2 " + unbr.drawdeck[i][0] + " " + unbr.drawdeck[i][1] +"'><p>" + unbr.drawdeck[i][0] + "</p></div>");
    }
    }
    //drawcard();
    }
}

//click selection for spirit swapper

$(document).on('click', '.cardprev2', function() {
    if (unbr.sniping == false){
        if (unbr.click1 == 0){
    unbr.swapselect1 = $('.cardprev2').index(this);
    $(this).attr("id", "select1");
    unbr.click1 = 1;
    }
       else if (unbr.click1 == 1){
    unbr.swapselect2 = $('.cardprev2').index(this);
    $(this).attr("id", "select2");
    unbr.click1 = 2;
    }
    if (unbr.click1 === 2){
    swapper(unbr.drawdeck, unbr.swapselect1, unbr.swapselect2);
}
}
});


//swap function

function swapper(arr, indexA, indexB) {    
    if (unbr.click1 === 2){
        unbr.click1 = 0;
  var temp = arr[indexA];
  arr[indexA] = arr[indexB];
  arr[indexB] = temp;
  if (caption === false){
  $("#select1").replaceWith("<div class ='cardprev2 " + unbr.drawdeck[indexA][0] + " " + unbr.drawdeck[indexA][1] +"'></div>")
  $("#select2").replaceWith("<div class ='cardprev2 " + unbr.drawdeck[indexB][0] + " " + unbr.drawdeck[indexB][1] +"'></div>")
    }
    if (caption === true){
        $("#select1").replaceWith("<div class ='cardprev2 " + unbr.drawdeck[indexA][0] + " " + unbr.drawdeck[indexA][1] +"'><p>" + unbr.drawdeck[indexA][0] + "</p></div>")
  $("#select2").replaceWith("<div class ='cardprev2 " + unbr.drawdeck[indexB][0] + " " + unbr.drawdeck[indexB][1] +"'><p>" + unbr.drawdeck[indexB][0] + "</p></div>")  
    }
  select1 = 0;
  select2 = 0;
}
};


//gives the player choices of how to play their cards, including dealing with ghosts and gods

function cardchoice() {
    ghostcheck();
    godcheck();
    cardcount();
    if(unbr.gameover == false) {
	   if(unbr.ghostpresent === false && unbr.godpresent === false){
            standardoption();
        } else if(unbr.ghostpresent == true){
            ghostoption();
	    } else if (unbr.godpresent === true){
            godoption();
       }
    }
}

//play options for standard cards

function standardoption(){
    $('#selectedcard').attr('id','');
    $(unbr.selectedcard).attr('id', 'selectedcard');
    unbr.selectedcard = 0;
    if (unbr.hand[unbr.selected[0]][1] === 'end'){
    $("#infocard").append("<p>A dead end!<br><br></p>");
        if (unbr.drawdeck.length >= 4){
            $("#infocard").append("<p id='deadend' class='option'>Discard hand</p>");
        }
}
else {
    $("#infocard").append("<p>What would you like to do with this card?<br></p>");
        if (unbr.sequence.length === 0){
            $("#infocard").append("<p id='sequenceplay' class='option'>Play in sequence</p>");
        }
        else if (unbr.hand[unbr.selected[0]][1] !== unbr.sequence[unbr.sequence.length -1][1]){
            $("#infocard").append("<p id='sequenceplay' class='option'>Play in sequence</p>");
        }
        if (unbr.hand[unbr.selected[0]][1] === 'spirit'){
            $("#infocard").append("<p id='spiritplay' class='option'>Use spirit power</p>");
        }
        $("#infocard").append("<p id='discardplay' class='option'>Discard and draw new card</p>");
    }
}

//play options for ghost cards

function ghostoption(){
      $("#infocard").append("<p>Oh no! A ghost! What would you like to do?<br></p>");
      unbr.ghostcount++;
                for (var i = 0, j = unbr.hand.length - 1; i <= j; i++) {
                    if (unbr.hand[i][1] === 'spirit') {
                    var spirithere = true;
                }
            }
            if (spirithere === true){
                $("#infocard").append("<p id='ghostspirit' class='option'>Discard a spirit card to escape<br></p>");
            }
            if (unbr.drawdeck.length > 4){
            $("#infocard").append("<p id='drophand' class='option'>Discard entire hand<br></p>"); 
        } if (unbr.drawdeck.length >  (4 + (8 - unbr.score) + (10 - unbr.ghostcount))){
            $("#infocard").append("<p id='dropunseen' class='option'>Discard the next 5 unseen cards<br></p>");
        }
        if (unbr.drawdeck.length <= 4 && spirithere != true){
                loss();
            }
}

//play options for god cards

function godoption(){
    if (unbr.drawdeck.length < (5 + (8 - unbr.score))) {
        unbr.donecheck = false;
        endgamecheck();
    } 
    if (unbr.donecheck == true && unbr.gameover != true) {
        $("#infocard").append("<p>A God has appeared before you<br></p>");
        if (unbr.spiritcolour === true){
           $("#infocard").append("<p id='spiritscore' class='option'>You have a spirit with you of the appropriate type. Use it to make peace with this God?<br></p>"); 
        }
        $("#infocard").append("<p id='godshuffle' class='option'>Shuffle it back into the deck and draw a new card<br></p>");
        }
}

//counts cards, updates visual totals, determines if win or loss has occured

function cardcount() {
    if (unbr.score === 8){
        win();
    }
    if (unbr.drawdeck.length < 0){
        loss();
        return;
    }
    if (unbr.gameover != true){
        unbr.lamppercent = Math.round((unbr.drawdeck.length/unbr.lamptotal)*10)/10;
        lampfade();
    }
    $("#scorecard").empty();
    $("#cardsremaining").replaceWith("<div id=cardsremaining><p>" + unbr.drawdeck.length + " cards remaining in draw deck</p></div>");
    $("#scorecard").replaceWith("<div id=scorecard><p id='scoreindicator' style='height: 30px; float:left'>" + unbr.score + " gods scored out of 8</p></div>");
    if (unbr.scoring.length >= 1){
        for (var i = 0; i <= unbr.scoring.length -1; i++){
            if (caption === false){
            $("#scorecard").prepend("<img src='img/" + unbr.scoring[i][0] + "score.png'>");
        }
        if (caption === true){
            $("#scorecard").append("<p class='scoretext'> " + unbr.scoring[i][0] +"</p>");
        }
        }
    }
}

//displays rules

$(document).on('click', '#rules', function() {
    $("#preview").empty();
    $("#preview").append("<div id='cardpreviewinstruction'><p>Welcome to the Underbrush Demo. Here are the rules of the game.<br><center><img src='img/godrules.png'></center><br>You are lost in a forest of Gods, Spirits and Ghosts. You must 'score' all 8 Gods before the deck runs out of cards.<br><center><img src='img/sequencerules.png'></center><br>To do this, you must play 3 cards of the same colour in a row, BUT, you can never play the same symbol twice in a row. Playing 3 of a colour in a row will 'score' a God of that colour. There are 2 Gods of each colour.<br><center><img src='img/spiritrules.png'></center><br>Spirit cards are your friends. With them you can see the next 5 cards that will be drawn, but you must discard one of them. You may then re-arrange the remaining cards. If you draw a God and you have a spirit of the same colour in your hand, you can immediately score that God.<br><center><img src='img/ghostrules.png'></center><br>Watch out for Ghosts! If you meet a ghost, you must either drop your whole hand, drop the next 5 cards out of the deck, or drop a spirit if you have one.<br><br>Good luck! Let me know what you think!</p></div>");
    notificationcloseclick();
});

//discards card if player opts to do so

$(document).on('click', '#discardplay', function() {
	discardcard();
    if (doomtimer === true){
        clearInterval(interval);
        unbr.counter = 6;
        counter();
    }
	$("#infocard").empty();
});

//runs the sequence addition functions

$(document).on('click', '#sequenceplay', function() {
	$("#infocard").empty();
    if (doomtimer === true){
        clearInterval(interval);
        unbr.counter = 6;
        counter();
    }
    sequenceadd();
});

//drops hand

$(document).on('click', '#drophand', function() {
   discardhand();
   unbr.ghostpresent = false;
   if (doomtimer === true){
        clearInterval(interval);
        unbr.counter = 6;
        counter();
    }
    $("#infocard").empty();
});

//allows player to avoid a ghost in exchange for a spirit

$(document).on('click', '#ghostspirit', function() {
    $("#infocard").empty();
    $("#infocard").append("<p>Choose a spirit to discard alongside the ghost<br></p>");
    unbr.droppingspirit = true;
    $("#infocard").append("<p id='ghostcancel' class='option'>I changed my mind<br></p>");
});

//cancels out of previous function

$(document).on('click', '#ghostcancel', function() {
    $("#infocard").empty();
    unbr.droppingspirit = false;
    cardchoice();
});

//selection for dropping 5 next unseen cards

$(document).on('click', '#dropunseen', function() {
    $("#hand div:last").remove()
    unbr.ghostpresent = false;
    if (doomtimer === true){
        clearInterval(interval);
        unbr.counter = 6;
        counter();
    }
    $("#infocard").empty();
    dropunseen();
});

//shuffle god back into deck

$(document).on('click', '#godshuffle', function() {
    unbr.limbo.unshift(unbr.hand[0]);
    unbr.hand.shift();
    $("#hand div:last").remove()
    unbr.godpresent = false;
    unbr.spiritcolour = false;
    if (doomtimer === true){
        clearInterval(interval);
        unbr.counter = 6;
        counter();
    }
    $("#infocard").empty();
    $("#infocard").append("<p>The God whisks you off to a new place in the forest.</p>");
    if (unbr.hand.length < 5){
        for (i = unbr.hand.length; i <= 5; i++){
            if (unbr.ghostpresent == false && unbr.godpresent == false){
                drawcard();
                ghostcheck();
                godcheck();
            }
        }
    }
});

//begins spirit power

$(document).on('click', '#spiritplay', function() {
    $("#infocard").empty();
    unbr.sniping = true;
    if (doomtimer === true){
        clearInterval(interval);
        unbr.counter = 6;
    }
    spiritpower();
});

//use a spirit to score a god

$(document).on('click', '#spiritscore', function() {
    $("#infocard").empty();
    $("#infocard").append("<p>Choose a spirit to make peace to this God with<br></p>");
    unbr.scoringgod = true;
    $("#infocard").append("<p id='godcancel' class='option'>I changed my mind<br></p>");
});

//cancels out of previous function

$(document).on('click', '#godcancel', function() {
    $("#infocard").empty();
    unbr.scoringgod = false;
    cardchoice();
});

$(document).on('click', '#okdone', function() {
    $.fancybox.close();
    unbr.swapselect1 = 0;
    unbr.swapselect2 = 0;
    unbr.click1 = 0;
    if (doomtimer === true){
        clearInterval(interval);
        unbr.counter = 6;
        counter();
    }
    drawcard();
});

$(document).on('click', '#deadend', function() {
    $("#infocard").empty();
    discardhand();
});


function hard(){
    $("#hand").empty();
    $("#sequence").empty();
    $("#cardsremaining").empty();
    $("#scorecard").empty();
    $("#infocard").empty();
    
    unbr.init();
    unbr.hardplay = true;
    function addCards(cardType,numOfCards){
        for (var i = numOfCards; i >= 1; i--) {
            unbr.drawdeck.push(cardType);
        };
    }

    addCards(['blue', 'leaf'], 7);
    addCards(['blue', 'twig'],4);
    addCards(['blue', 'spirit'],2);
    addCards(['blue', 'god'],2);

    addCards(['purple', 'leaf'],8);
    addCards(['purple', 'twig'],4);
    addCards(['purple', 'spirit'],2);
    addCards(['purple', 'god'],2);

    addCards(['green', 'leaf'],9);
    addCards(['green', 'twig'],4);
    addCards(['green', 'spirit'],2);
    addCards(['green', 'god'],2);

    addCards(['orange', 'leaf'],6);
    addCards(['orange', 'twig'],4);
    addCards(['orange', 'spirit'],2);
    addCards(['orange', 'god'],2);

    addCards(['yellow', 'spirit'],4);

    addCards(['ghost', 'bad'],10);

}

function easy(){
    $("#hand").empty();
    $("#sequence").empty();
    $("#cardsremaining").empty();
    $("#scorecard").empty();
    $("#infocard").empty();
    
    unbr.init();
    unbr.hardplay = false;
    function addCards(cardType,numOfCards){
        for (var i = numOfCards; i >= 1; i--) {
            unbr.drawdeck.push(cardType);
        };
    }

    addCards(['blue', 'leaf'], 7);
    addCards(['blue', 'twig'],4);
    addCards(['blue', 'spirit'],4);
    addCards(['blue', 'god'],2);

    addCards(['purple', 'leaf'],8);
    addCards(['purple', 'twig'],4);
    addCards(['purple', 'spirit'],4);
    addCards(['purple', 'god'],2);

    addCards(['green', 'leaf'],9);
    addCards(['green', 'twig'],4);
    addCards(['green', 'spirit'],4);
    addCards(['green', 'god'],2);

    addCards(['orange', 'leaf'],6);
    addCards(['orange', 'twig'],4);
    addCards(['orange', 'spirit'],4);
    addCards(['orange', 'god'],2);

    addCards(['ghost', 'bad'],10);

}

function master(){
    $("#hand").empty();
    $("#sequence").empty();
    $("#cardsremaining").empty();
    $("#scorecard").empty();
    $("#infocard").empty();
    
    unbr.init();

    function addCards(cardType,numOfCards){
        for (var i = numOfCards; i >= 1; i--) {
            unbr.drawdeck.push(cardType);
        };
    }

    addCards(['blue', 'leaf'], 6);
    addCards(['blue', 'twig'],4);
    addCards(['blue', 'spirit'],2);
    addCards(['blue', 'god'],2);

    addCards(['purple', 'leaf'],7);
    addCards(['purple', 'twig'],4);
    addCards(['purple', 'spirit'],2);
    addCards(['purple', 'god'],2);

    addCards(['green', 'leaf'],8);
    addCards(['green', 'twig'],4);
    addCards(['green', 'spirit'],2);
    addCards(['green', 'god'],2);

    addCards(['orange', 'leaf'],5);
    addCards(['orange', 'twig'],4);
    addCards(['orange', 'spirit'],2);
    addCards(['orange', 'god'],2);

    addCards(['yellow', 'spirit'],3);

    addCards(['dead', 'end'],6);

    addCards(['ghost', 'bad'],10);

}

$(document).on('click', '#easy', function() {
    $("#infobox").empty();
    $("#topmenu").fadeIn(300);
    $("#lamp2").fadeIn(800);
    $("#lamp1").fadeIn(300);
    easy();
    unbr.playingeasy = true;
    if (doomtimer === true){
        clearInterval(interval);
        unbr.counter = 6;
        counter();
    }
    shuffle(unbr.drawdeck);
    unbr.lamptotal = unbr.drawdeck.length - 5;
    unbr.lamppercent = 1;
    lampfade();
    drawhandstart();
});

$(document).on('click', '#hard', function() {
    $("#infobox").empty();
    $("#topmenu").fadeIn(300);
    $("#lamp2").fadeIn(800);
    $("#lamp1").fadeIn(300);
    hard();
    unbr.playinghard = true;
    if (doomtimer === true){
        clearInterval(interval);
        unbr.counter = 6;
        counter();
    }
    shuffle(unbr.drawdeck);
    unbr.lamptotal = unbr.drawdeck.length - 5;
    unbr.lamppercent = 1;
    lampfade();
    drawhandstart();
});

$(document).on('click', '#master', function() {
    $("#infobox").empty();
    $("#topmenu").fadeIn(300);
    $("#lamp2").fadeIn(800);
    $("#lamp1").fadeIn(300);
    master();
    unbr.playingmaster = true;
    if (doomtimer === true){
        clearInterval(interval);
        unbr.counter = 6;
        counter();
    }
    shuffle(unbr.drawdeck);
    unbr.lamptotal = unbr.drawdeck.length - 5;
    unbr.lamppercent = 1;
    lampfade();
    drawhandstart();
});

$(document).on('click', '#menubutton', function() {
    $("#infocard").empty().hide();
    $("#lamp2").hide();
    $("#lamp1").hide();
    $("#sequence").empty();
    $("#hand").empty();
    $("#hand").hide();
    $("#preview").empty();
    $("#topmenu").hide();
    if (doomtimer === true){
        $("#doomcount").empty();
        clearInterval(interval);
    }
    unbr.playingeasy = false;
    unbr.playinghard = false;
    unbr.playingmaster = false;
    $("#hand").append("<center><img src='img/logo.png' style='margin-top: -60px;'></center><br><div id='title'>UNDERBRUSH</div>");
    if (hardwin === 0){
        $("#infocard").append("<p id='easy' class='option'>Easy Mode</p><p id='hard' class='option'>Hard Mode</p><p id='rules' class='option'>Rules</p>");
    } else {
        $("#infocard").append("<p id='easy' class='option'>Easy Mode</p><p id='hard' class='option'>Hard Mode</p><p id='master' class='option'>Master Mode</p><p id='rules' class='option'>Rules</p>");
    }
    if (doomtimer === false && hardwin >= 1){
        $("#infocard").append("<p id='doomon' class='option'>Turn Doom Timer On</p>");
    }
    if (doomtimer === true && hardwin >= 1){
        $("#infocard").append("<p id='doomoff' class='option'>Turn Doom Timer Off</p>");
    }
    if (caption === false){
        $("#infocard").append("<p id='captionon' class='option'>Turn On Colour Description</p>");
    }
    if (caption === true){
        $("#infocard").append("<p id='captionoff' class='option'>Turn Off Colour Description</p>");
    }
    $("#hand").fadeIn(800);
    $("#infocard").fadeIn(600);
});

$(document).on('click', '#menu', function() {
    $("#infocard").empty().hide();
    $("#lamp2").hide();
    $("#lamp1").hide();
    $("#sequence").empty();
    $("#hand").empty();
    $("#hand").hide();
    $("#preview").empty();
    $("#topmenu").hide();
    if (doomtimer === true){
        $("#doomcount").empty();
        clearInterval(interval);
    }
    unbr.playingeasy = false;
    unbr.playinghard = false;
    unbr.playingmaster = false;
    $("#hand").append("<center><img src='img/logo.png' style='margin-top: -60px;'></center><br><div id='title'>UNDERBRUSH</div>");
    if (hardwin === 0){
        $("#infocard").append("<p id='easy' class='option'>Easy Mode</p><p id='hard' class='option'>Hard Mode</p><p id='rules' class='option'>Rules</p>");
    } else {
        $("#infocard").append("<p id='easy' class='option'>Easy Mode</p><p id='hard' class='option'>Hard Mode</p><p id='master' class='option'>Master Mode</p><p id='rules' class='option'>Rules</p>");
    }
    if (doomtimer === false && hardwin >= 1){
        $("#infocard").append("<p id='doomon' class='option'>Turn Doom Timer On</p>");
    }
    if (doomtimer === true && hardwin >= 1){
        $("#infocard").append("<p id='doomoff' class='option'>Turn Doom Timer Off</p>");
    }
    if (caption === false){
        $("#infocard").append("<p id='captionon' class='option'>Turn On Colour Description</p>");
    }
    if (caption === true){
        $("#infocard").append("<p id='captionoff' class='option'>Turn Off Colour Description</p>");
    }
    $("#hand").fadeIn(800);
    $("#infocard").fadeIn(600);
});

function lampfade(){
    $("#lamp1").fadeTo("slow", unbr.lamppercent);
}

$(document).on('click', '#captionon', function() {
    caption = true;
    $("#captionon").replaceWith("<p id='captionoff' class='option'>Turn Off Colour Description</p>");
});

$(document).on('click', '#captionoff', function() {
    caption = false;
    $("#captionoff").replaceWith("<p id='captionon' class='option'>Turn On Colour Description</p>");
});

$(document).on('click', '#doomon', function() {
    doomtimer = true;
    $("#doomon").replaceWith("<p id='doomoff' class='option'>Turn Doom Timer Off</p>");
});

$(document).on('click', '#doomoff', function() {
    doomtimer = false;
    $("#doomoff").replaceWith("<p id='doomon' class='option'>Turn Doom Timer On</p>");
});

function doomcount(){
    if (unbr.counter === 6 && unbr.godpresent == false && unbr.ghostpresent == false && unbr.gameover === false){
        interval = setInterval(function() {
        if (unbr.godpresent === false && unbr.ghostpresent === false && unbr.gameover === false){
        ghostcheck();
        godcheck();
        unbr.counter--;
        $("#doomcount").replaceWith("<div id='doomcount'><p>" + unbr.counter + "</p></div>")
        if (unbr.counter === 0) {
            if (unbr.hand[4][0] === "dead") {
                discardhand();
            } else {
            unbr.discard.unshift(unbr.hand[4]);
            unbr.hand.splice(4, 1);
            $(".card").slice(0, 1).fadeOut(200);
            $(".card").slice(0, 1).remove();
            $("#infocard").empty();
            }
            drawcard();
            clearInterval(interval);
            unbr.counter = 6;
            doomcount();
        }
        }
}, 1000);
}
}

function counter(){
if (unbr.playingeasy === true || unbr.playinghard === true || unbr.playingmaster === true){
    doomcount();
}
}


$(function(){
    unbr.init();
});