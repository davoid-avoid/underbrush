// initial variables

var doom = 10
var hardwin = 0;
var interval = 0;

var caption = false;
var cardlist = true;
var doomtimer = false;
var baileyplay = false;

var unbr = {};
var unbrtut = {};

unbr.init = function(){
    unbr.click1 = 0;
    unbr.colourgrab = 0;
    unbr.elements = 0;
    unbr.ghostcount = 0;
    unbr.godcolour = 0;
    unbr.lamppercent = 1;
    unbr.lamptotal = 100;
    unbr.normselect = 0;
    unbr.score = 0;
    unbr.selectedcard = 0;
    unbr.spiritexchange = 0;
    unbr.swapselect1 = 0;
    unbr.swapselect2 = 0;

    unbr.donecheck = true;
    unbr.droppingspirit = false;
    unbr.found = false;
    unbr.gameover = false;
    unbr.ghostpresent = false;
    unbr.godpresent = false;
    unbr.playingeasy = false;
    unbr.playinghard = false;
    unbr.playingmaster = false;
    unbr.playingnormal = false;
    unbr.playingtutorial = false;
    unbr.scoringgod = false;
    unbr.sniping = false;
    unbr.spiritcolour = false;
    unbr.spiritsnipe = false;

    unbr.discard = [];
    unbr.drawdeck = [];
    unbr.hand = [];
    unbr.limbo = [];
    unbr.scoring = [];
    unbr.selected = [];
    unbr.sequence = [];    
    
    unbr.counter = doom;
};

unbrtut.init = function(){
    unbrtut.step1 = false;
    unbrtut.step2 = false;
    unbrtut.step3 = false;
    unbrtut.step4 = false;
    unbrtut.step5 = false;
    unbrtut.step6 = false;
    unbrtut.step7 = false;
    unbrtut.step8 = false;
    unbrtut.step9 = false;
    unbrtut.step10 = false;
    unbrtut.step11 = false;
    unbrtut.step12 = false;
}


// shuffles the deck

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


// this function allows for a new hand to be drawn, ensuring all gods and ghosts are shuffled back into the deck if drawn into this hand

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
        unbr.ghostpresent = false;
        unbr.godpresent = false;
        drawcard();
    }
}


// this function shuffles the limbo deck back into the draw deck

function limboshuffle() {
    if (unbr.limbo.length > 0) {
        for (var l = 0, d = (unbr.limbo.length - 1); l <= d; l++) {
            unbr.drawdeck.push(unbr.limbo[0]);
            shuffle(unbr.drawdeck);
            unbr.limbo.shift();
        }
    }
}


// this function needs to run through both the remainder of the deck, and check to see if it's just gods, and then it needs to see if the player has any spirits in hand of the same colour

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
    }
    else if (unbr.drawdeck.length === 0 && unbr.hand[0][1] === 'god' && spiritcount === 0 || unbr.drawdeck.length >= 1 && godcount == unbr.drawdeck.length && spiritcount === 0){
        loss();
    }
    else if (unbr.drawdeck.length > 0 && unbr.hand[0][1] === 'god' && spiritcount >= 1){
            for (var sh = 0; sh <= unbr.hand.length - 1; sh++){
                if (unbr.hand[sh][1] == 'spirit'){
                    if (unbr.hand[sh][0] === unbr.hand[0][0]){
                        rightSpirit = true;
                    }
                }
            }
            if (rightSpirit === false){
                loss();
            }
        }
    else if (unbr.drawdeck.length === 0 && unbr.hand[0][1] === 'god' && spiritcount >= 1){
            for (var sh = 0; sh <= unbr.hand.length - 1; sh++){
                if (unbr.hand[sh][1] == 'spirit'){
                    if (unbr.hand[sh][0] === unbr.hand[0][0]){
                        rightSpirit = true;
                    }
                }
            }
            if (rightSpirit === false){
                loss();
            }
        }
    unbr.donecheck = true;
}


// notifies the user of stuff, opens modal box

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


// this function implements the game progress status

function lampfade(){
    $("#lamp1").fadeTo("slow", unbr.lamppercent);
}

function doomreset(){
    clearInterval(interval);
    unbr.counter = doom;
    counter();
}


// this function allows the player to draw a new card unless the draw deck is empty

function drawcard() {
    cardcount(); 
    if (baileyplay === true){
        console.log("The drawdeck consists of: " + unbr.drawdeck);
    }
    if (unbr.limbo.length > 0){
        if (unbr.drawdeck.length < (5 + (8 - unbr.score))) {
            limboshuffle();
        }
    }
    if (unbr.hand.length <= 4){
        for (i = unbr.hand.length; i <= 4; i++){
            if (unbr.ghostpresent === false && unbr.godpresent === false){
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


// this function defines the win conditions and acknoledges completion

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
    if (hardwin === 1 && unbr.playingeasy === false && unbr.playingnormal === false && unbr.playingmaster === false){
        $("#cardpreviewinstruction").append("<p><b>Master Mode and Doom Timer unlocked!</b></p>");
    }
    if (unbr.playingeasy === true){
        $("#infocard").append("<br><p class='option' id='easy'>Play Again?</p>");    
    }
    if (unbr.playingnormal === true){
        $("#infocard").append("<br><p class='option' id='normal'>Play Again?</p>");    
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


// this function defines the losing conditions and terminate the game

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
    if (unbr.playingnormal === true){
        $("#infocard").append("<br><p class='option' id='normal'>Play Again?</p>");    
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


// function checks for ghost card draws

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


// function checks for spirit card in hand

function spiritcheck() { 
    spirithere = 0;
    for (i = 0, j = unbr.hand.length - 1; i <= j; i++) {
        if (unbr.hand[i][1] === 'spirit') {
            spirithere++;
        }
    }
}


// if a god card is drawn, this function checks for any spirits
// in hand and if the right colour is present offers to let
// the player trade in that spirit for an immmediate point

function godcheck() {
    for (g = 0, k = unbr.hand.length - 1; g <= k; g++){
        if (unbr.hand[g][1] == 'god'){
            unbr.godpresent = true;
            var scored = false;
            var spiritlocal = [];
            spiritcheck();
            if (spirithere > 0) {
                for (i = 0, j = unbr.hand.length - 1; i <= j; i++) {
                    if (unbr.hand[i][1] === 'spirit') {
                        spiritlocal.push(i);
                    }
                }
                unbr.godcolour = unbr.hand[0][0];
                for (s = 0, h = spiritlocal.length - 1; s <= h; s++) {
                    if (unbr.hand[spiritlocal[s]][0] === unbr.godcolour && unbr.scored !== true) {
                        unbr.spiritexchange = unbr.hand[spiritlocal[s]];
                        unbr.normselect = $('.card').index(s);
                        unbr.spiritcolour = true;
                    }
                }
            }
        }
    }
}


// finds a god in the deck, removes it, adds score

function findremovegod() {
    for (var i = 0; i <= unbr.drawdeck.length -1; i++){
        if (unbr.drawdeck[i][1] === 'god' && unbr.drawdeck[i][0] === unbr.colourgrab && unbr.found === false){
            unbr.score++;
            unbr.scoring.unshift(unbr.drawdeck[i]);
            unbr.drawdeck.splice(i, 1);
            godindicator();
            $("#infocard").append("<p>The God whisks you off to a new place in the forest.</p>");
            if (unbr.playingtutorial !== true){
                shuffle(unbr.drawdeck);
            }
            unbr.found = true;
            unbr.colourgrab = 0;
        }
    }
    unbr.found = false;
}


// the function that allows a player to discard a card, and then draw anew

function discardcard() {
    unbr.discard.unshift((unbr.hand[unbr.selected[0]]));
    unbr.hand.splice(unbr.selected[0], 1);
    $(".card").slice(unbr.normselect, unbr.normselect+1).fadeOut(200);
    $(".card").slice(unbr.normselect, unbr.normselect+1).remove();
    drawcard();

}


// discarding the players hand

function discardhand() {
    cardcount();
    unbr.discard.unshift(unbr.hand);
    unbr.hand = [];
    $("#hand div").fadeOut(200);
    $("#hand").empty();
    drawhandstart();
}


// this is where we add new cards to the sequence the player is building from their hand

function sequenceadd() {
    unbr.sequence.push(unbr.hand[unbr.selected[0]]);
    if (caption === false){
        $("#sequence").append("<div class='cardsequence " + unbr.hand[unbr.selected[0]][0] + " " + unbr.hand[unbr.selected[0]][1] + "'></div>");
    }
    if (caption === true){
        $("#sequence p:last").remove();
        if (unbr.sequence.length == 1){
            $("#sequence").append("<div class='cardsequence " + unbr.hand[unbr.selected[0]][0] + " " + unbr.hand[unbr.selected[0]][1] + "'><p>" + unbr.hand[unbr.selected[0]][0] + "</p></div>");
        } else if (unbr.sequence.length == 2){
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
    if (unbr.playingtutorial === true){
        tutorialimmediate();
    }
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
    } else if (unbr.sequence.length >= 4 ){
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


// double click event triggers auto play is possible

$(document).on('dblclick', '.card', function() {
    if (unbr.gameover === false && unbr.playingtutorial === false){
        if (unbr.droppingspirit === false && unbr.scoringgod === false){
            unbr.elements = $('.card');
            unbr.normselect = $('.card').index(this);
            unbr.selected[0] = (unbr.elements.length -unbr.elements.index(this))-1;
            unbr.selectedcard = (this);
            $("#infocard").empty();
            if (unbr.ghostpresent === false && unbr.godpresent === false){
                if (unbr.hand[unbr.selected[0]][1] === 'spirit'){
                    standardoption();
                } else {
                    if (doomtimer === true){
                        doomreset();
                    }
                    autoplay();
                }
            } else if (unbr.ghostpresent == true){
                ghostoption();
            } else if (unbr.godpresent === true){
                godoption();
            }
        }
        if (unbr.droppingspirit === true){
            unbr.elements = $('.card');
            unbr.normselect = $('.card').index(this);
            unbr.selected[0] = (unbr.elements.length -unbr.elements.index(this))-1;
            if (unbr.hand[unbr.selected[0]][1] == 'spirit'){
                unbr.discard.unshift(unbr.hand[unbr.selected[0]])
                unbr.discard.unshift(unbr.hand[0]);
                unbr.hand.splice(unbr.selected[0], 1);
                cardshift();
                unbr.ghostpresent = false;
                unbr.droppingspirit = false;
                $("#infocard").empty();
                drawcard();
                if (doomtimer === true){
                    doomreset();
                }
            } else {
                $("#infocard").empty();
                $("#infocard").append("<p>That isn't a Spirit card. Please select a Spirit card.<br></p>");
                $("#infocard").append("<p id='ghostcancel' class='option'>I changed my mind<br></p>");   
            }
        }
        if (unbr.scoringgod === true){
            unbr.elements = $('.card');
            unbr.normselect = $('.card').index(this);
            unbr.selected[0] = (unbr.elements.length -unbr.elements.index(this))-1;
            if (unbr.hand[unbr.selected[0]][1] == 'spirit' && unbr.hand[unbr.selected[0]][0] == unbr.godcolour){
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
                    doomreset();
                }
                drawcard();
            }
        }
    }
});


// gets selection from click event which can then be used to identify
// the card selected for purposes of cross examining it with hand
// also resolves special cases with gods and ghosts in selection

$(document).on('click', '.card', function() {
    if (unbr.gameover === false){
        if (unbr.droppingspirit === false && unbr.scoringgod === false){
            unbr.elements = $('.card');
            unbr.normselect = $('.card').index(this);
            unbr.selected[0] = (unbr.elements.length -unbr.elements.index(this))-1;
            unbr.selectedcard = (this);
            $("#infocard").empty();
            cardchoice();
        }
        if (unbr.droppingspirit === true){
            unbr.elements = $('.card');
            unbr.normselect = $('.card').index(this);
            unbr.selected[0] = (unbr.elements.length -unbr.elements.index(this))-1;
            if (unbr.hand[unbr.selected[0]][1] == 'spirit'){
                unbr.discard.unshift(unbr.hand[unbr.selected[0]])
                unbr.discard.unshift(unbr.hand[0]);
                unbr.hand.splice(unbr.selected[0], 1);
                cardshift();
                unbr.ghostpresent = false;
                unbr.droppingspirit = false;
                $("#infocard").empty();
                drawcard();
                if (doomtimer === true){
                    doomreset();
                }
            } else {
                $("#infocard").empty();
                $("#infocard").append("<p>That isn't a Spirit card. Please select a Spirit card.<br></p>");
                $("#infocard").append("<p id='ghostcancel' class='option'>I changed my mind<br></p>");   
            }
        }
        if (unbr.scoringgod === true){
            unbr.elements = $('.card');
            unbr.normselect = $('.card').index(this);
            unbr.selected[0] = (unbr.elements.length -unbr.elements.index(this))-1;
            if (unbr.hand[unbr.selected[0]][1] == 'spirit' && unbr.hand[unbr.selected[0]][0] == unbr.godcolour){
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
                    doomreset();
                }
                drawcard();
            }
        }
    }
});


// moves cards from hand to discard

function cardshift(){
    unbr.hand.shift();
    $(".card").slice(unbr.normselect, unbr.normselect+1).fadeOut(200);
    $(".card").slice(unbr.normselect, unbr.normselect+1).remove();
    $("#hand div:last").remove()
}


// drops next 5 unseen cards, shuffles gods or ghosts back into the deck

function dropunseen(){
    var legitCounter = 0;
    var illegalCounter = 0;
    for(i = 0; i <= 4; i++){
        if (unbr.drawdeck[0][1] === 'god' || unbr.drawdeck[0][0] === 'ghost') {
            unbr.limbo.unshift(unbr.drawdeck[0]);
            unbr.drawdeck.shift();
            console.log("not dropping " + unbr.limbo[0]);
            console.log("limbo: " + unbr.limbo);
            illegalCounter++;
        } else {
        unbr.discard.unshift(unbr.drawdeck[0]);
        unbr.drawdeck.shift();
        console.log("dropping: " + unbr.discard[0]);
        legitCounter++;
        }
    }
    $("#preview").empty();
    $("#preview").append("<div id ='cardpreviewinstruction'>Here are the cards you dropped</div><br>");
    $("#preview").append("<div class='cardPreviewHandler' id='cardPreviewHandler1'></div>")
        for (i = 0; i <= legitCounter - 1; i++){
            if (caption === false){
        $("#cardPreviewHandler1").append("<div class ='cardprev " + unbr.discard[i][0] + " " + unbr.discard[i][1] +"'></div>");
        }
        if (caption === true){
            $("#cardPreviewHandler1").append("<div class ='cardprev " + unbr.discard[i][0] + " " + unbr.discard[i][1] +"'><p>" + unbr.discard[i][0] + "</p></div>");
        }
    }
    if (illegalCounter > 0){
        console.log("limbo: " + unbr.limbo);
        $("#preview").append("<div id='carddropinstruction'>Here are the cards you could not drop</div><br>");
        $("#preview").append("<div class='cardPreviewHandler' id='cardPreviewHandler2'></div>")
        for (i = 0; i < (unbr.limbo.length); i++){
        if (caption === false){
            $("#cardPreviewHandler2").append("<div class ='cardprev " + unbr.limbo[i][0] + " " + unbr.limbo[i][1] +"'></div>");
        }
        if (caption === true){
            $("#cardPreviewHandler2").append("<div class ='cardprev " + unbr.limbo[i][0] + " " + unbr.limbo[i][1] +"'><p>" + unbr.limbo[i][0] + "</p></div>");
            }
        }
    }
    if (caption === true){
        if (illegalCounter > 0){
            $.fancybox({
            'autoSize' : false,
            'transitionIn': 'elastic',
            'transitionOut': 'elastic',
            'speedIn': 500,
            'speedOut': 300,
            'width' : 680,
            'height' : 560,
            'topRatio' : 0.85,
            'href' : '#preview',
            'closeBtn' : false,
            'modal' : false,
            'closeClick' : true
            });
        } else {
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
    } else {
        notificationcloseclick();
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
        notificationcloseclick();
    } else {
        $("#preview").append("<div class ='cardprev " + unbr.scoring[0][0] + " " + unbr.scoring[0][1] +"'><p>" + unbr.scoring[0][0] + "</p></div>");  
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


// creates the spirit power view

function spiritpower(){
    unbr.hand.splice(unbr.selected, 1);
    $(".card").slice(unbr.normselect, unbr.normselect+1).fadeOut(200);
    $(".card").slice(unbr.normselect, unbr.normselect+1).remove();
    spiritview();
}


// does the visual parts of the spirit power

function spiritview(){
    $("#preview").empty();
    $("#preview").append("<div id ='cardpreviewinstruction'>Here are the next 5 cards in the deck. You must choose 1 to discard. You may not discard Gods.</div>");
    if (unbr.drawdeck.length <= 5){
        for (c = 0; c <= unbr.drawdeck.length-1; c++){
            if (caption === true){
                $("#preview").append("<div class ='cardprev " + unbr.drawdeck[c][0] + " " + unbr.drawdeck[c][1] +"'><p>" + unbr.drawdeck[c][0] + "</p></div>");
            } else {
                $("#preview").append("<div class ='cardprev " + unbr.drawdeck[c][0] + " " + unbr.drawdeck[c][1] +"'></div>");
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
    } else {
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
}


// click selection for spirit sniper

$(document).on('click', '.cardprev', function() {
    if (unbr.sniping === true){
        unbr.elements = $('.cardprev');
        unbr.normselect = $('.cardprev').index(this);
        unbr.selected[0] = (unbr.elements.length -unbr.elements.index(this))-1;
        $('#selectedsnipe').attr('id','');
        $(this).attr('id', 'selectedsnipe');
        $('#snipeconfirm').remove();
        $("#cardpreviewinstruction").append("<div id='snipeconfirm'><p class='option'>Is this card ok to discard?</p></div>");
    }
});

// confirms card to snipe

$(document).on('click', '#snipeconfirm', function() {
    unbr.spiritsnipe = true;
    spiritsniper();
});


// lets the user kill a card in spirit view

function spiritsniper(){
    var godcount = 0;
    if (unbr.drawdeck.length <= 4){
        for (i = 0, j = unbr.drawdeck.length -1; i <= j; i++){
            if (unbr.drawdeck[i][1] === 'god'){
                godcount++;
                if (godcount === unbr.drawdeck.length){
                    loss();
                }
            }
        }
    }
    if (unbr.spiritsnipe === true && unbr.drawdeck[unbr.normselect][1] != 'god'){
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
    }
}


// click selection for spirit swapper

$(document).on('click', '.cardprev2', function() {
    if (unbr.sniping === false){
        if (unbr.click1 == 0){
            unbr.swapselect1 = $('.cardprev2').index(this);
            $(this).attr("id", "select1");
            unbr.click1 = 1;
        } else if (unbr.click1 == 1){
            unbr.swapselect2 = $('.cardprev2').index(this);
            $(this).attr("id", "select2");
            unbr.click1 = 2;
        }
        if (unbr.click1 === 2){
            swapper(unbr.drawdeck, unbr.swapselect1, unbr.swapselect2);
        }
    }
});


// swap function

function swapper(arr, indexA, indexB) {    
    if (unbr.click1 === 2){
        unbr.click1 = 0;
        var temp = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = temp;
        if (caption === true){
            $("#select1").replaceWith("<div class ='cardprev2 " + unbr.drawdeck[indexA][0] + " " + unbr.drawdeck[indexA][1] +"'><p>" + unbr.drawdeck[indexA][0] + "</p></div>")
            $("#select2").replaceWith("<div class ='cardprev2 " + unbr.drawdeck[indexB][0] + " " + unbr.drawdeck[indexB][1] +"'><p>" + unbr.drawdeck[indexB][0] + "</p></div>")  
        } else {
            $("#select1").replaceWith("<div class ='cardprev2 " + unbr.drawdeck[indexA][0] + " " + unbr.drawdeck[indexA][1] +"'></div>")
            $("#select2").replaceWith("<div class ='cardprev2 " + unbr.drawdeck[indexB][0] + " " + unbr.drawdeck[indexB][1] +"'></div>")
        }
        select1 = 0;
        select2 = 0;
    }
};


// gives the player choices of how to play their cards,
// including dealing with ghosts and gods

function cardchoice() {
    ghostcheck();
    godcheck();
    cardcount();
    if (unbr.playingtutorial === true && unbrtut.step13 !== true){
        if (unbr.ghostpresent === false && unbr.godpresent === false){
            tutorialbranches();
        } else if (unbr.godpresent === true){
            tutorialgod();
        }
    } else {
        unbrtut.step12 = false;
        if (unbr.gameover === false) {
            if (unbr.ghostpresent === false && unbr.godpresent === false){
                standardoption();
            } else if (unbr.ghostpresent === true && unbrtut.step13 === true){
                tutorialchoices();
            } else if (unbr.ghostpresent === true){
                ghostoption();
            } else if (unbr.godpresent === true){
                godoption();
            }
        }
    }
}


// checks for valid move and autoplay if possible

function autoplay(){
    $('#selectedcard').attr('id','');
    $(unbr.selectedcard).attr('id', 'selectedcard');
    unbr.selectedcard = 0;
    if (unbr.hand[unbr.selected[0]][1] === 'trap'){
        $("#infocard").append("<p>It's a trap!<br><br></p>");
        if (unbr.drawdeck.length >= 4){
            $("#infocard").append("<p id='deadend' class='option'>Discard hand</p>");
        }
    }
    if (unbr.sequence.length === 0 || unbr.hand[unbr.selected[0]][1] !== unbr.sequence[unbr.sequence.length -1][1]){
        sequenceadd();
    }
}


// play options for standard cards

function standardoption(){
    $('#selectedcard').attr('id','');
    $(unbr.selectedcard).attr('id', 'selectedcard');
    unbr.selectedcard = 0;
    if (unbr.hand[unbr.selected[0]][1] === 'trap'){
        $("#infocard").append("<p>It's a trap!<br><br></p>");
        if (unbr.drawdeck.length >= 4){
            $("#infocard").append("<p id='deadend' class='option'>Discard hand</p>");
            }
    } else {
        $("#infocard").append("<p>What would you like to do with this card?<br></p>");
        if (unbr.sequence.length === 0){
            $("#infocard").append("<p id='sequenceplay' class='option'>Play in sequence</p>");
        } else if (unbr.hand[unbr.selected[0]][1] !== unbr.sequence[unbr.sequence.length -1][1]){
            $("#infocard").append("<p id='sequenceplay' class='option'>Play in sequence</p>");
        }
        if (unbr.hand[unbr.selected[0]][1] === 'spirit'){
            $("#infocard").append("<p id='spiritplay' class='option'>Use spirit power</p>");
        }
        $("#infocard").append("<p id='discardplay' class='option'>Discard and draw new card</p>");
    }
}


// play options for ghost cards

function ghostoption(){
    $("#infocard").append("<p>Oh no! A ghost! What would you like to do?<br></p>");
    unbr.ghostcount++;
    spiritcheck();
    if (unbr.drawdeck.length <= 4 && spirithere == 0){
        loss();
    }
    if (spirithere > 0){
        $("#infocard").append("<p id='ghostspirit' class='option'>Discard a spirit card to escape<br></p>");
    }
    if (unbr.drawdeck.length > 4){
        $("#infocard").append("<p id='drophand' class='option'>Discard entire hand<br></p>"); 
    }
    if (unbr.drawdeck.length > (4 + (8 - unbr.score) + (10 - unbr.ghostcount))){
        $("#infocard").append("<p id='dropunseen' class='option'>Discard the next 5 unseen cards<br></p>");
    }
}


// play options for god cards

function godoption(){
    if (unbr.drawdeck.length < (5 + (8 - unbr.score))) {
        unbr.donecheck = false;
        endgamecheck();
    } 
    if (unbr.donecheck === true && unbr.gameover !== true) {
        $("#infocard").append("<p>A God has appeared before you<br></p>");
        if (unbr.spiritcolour === true){
           $("#infocard").append("<p id='spiritscore' class='option'>You have a spirit with you of the appropriate type. Use it to make peace with this God?<br></p>"); 
        }
        $("#infocard").append("<p id='godshuffle' class='option'>Shuffle it back into the deck and draw a new card<br></p>");
    }
}


// counts cards, updates visual totals, determines if win or loss has occured

function cardcount() {
    if (unbr.score === 8){
        win();
    }
    if (unbr.drawdeck.length < 0){
        loss();
        return;
    }
    if (unbr.gameover !== true){
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

// displays rules

$(document).on('click', '#rules', function() {
    $("#preview").empty();
    $("#preview").append("<div id='cardpreviewinstruction'><p>Welcome to the Underbrush Demo. Here are the rules of the game.<br><center><img src='img/godrules.png'></center><br>You are lost in a forest of Gods, Spirits and Ghosts. You must 'score' all 8 Gods before the deck runs out of cards.<br><center><img src='img/sequencerules.png'></center><br>To do this, you must play 3 cards of the same colour in a row, BUT, you can never play the same symbol twice in a row. Playing 3 of a colour in a row will 'score' a God of that colour. There are 2 Gods of each colour.<br><center><img src='img/spiritrules.png'></center><br>Spirit cards are your friends. With them you can see the next 5 cards that will be drawn, but you must discard one of them. You may then re-arrange the remaining cards. If you draw a God and you have a spirit of the same colour in your hand, you can immediately score that God.<br><center><img src='img/ghostrules.png'></center><br>Watch out for Ghosts! If you meet a ghost, you must either drop your whole hand, drop the next 5 cards out of the deck, or drop a spirit if you have one.<br><br>Good luck! Let me know what you think!</p></div>");
    notificationcloseclick();
});


// discards card if player opts to do so

$(document).on('click', '#discardplay', function() {
    discardcard();
    if (doomtimer === true){
        doomreset();
    }
    $("#infocard").empty();
    if (unbr.playingtutorial === true){
        tutorialimmediate();
    }
});


// runs the sequence addition functions

$(document).on('click', '#sequenceplay', function() {
    $("#infocard").empty();
    if (doomtimer === true){
        doomreset();
    }
    sequenceadd();
});


// drops hand

$(document).on('click', '#drophand', function() {
    discardhand();
    unbr.ghostpresent = false;
    if (doomtimer === true){
        doomreset();
    }
    $("#infocard").empty();
});


// allows player to avoid a ghost in exchange for a spirit

$(document).on('click', '#ghostspirit', function() {
    $("#infocard").empty();
    $("#infocard").append("<p>Choose a spirit to discard alongside the ghost<br></p>");
    unbr.droppingspirit = true;
    $("#infocard").append("<p id='ghostcancel' class='option'>I changed my mind<br></p>");
});


// cancels out of previous function

$(document).on('click', '#ghostcancel', function() {
    $("#infocard").empty();
    unbr.droppingspirit = false;
    cardchoice();
});


// selection for dropping 5 next unseen cards

$(document).on('click', '#dropunseen', function() {
    $("#hand div:last").remove()
    unbr.ghostpresent = false;
    if (doomtimer === true){
        doomreset();
    }
    $("#infocard").empty();
    dropunseen();
});


// shuffle god back into deck

$(document).on('click', '#godshuffle', function() {
    if (unbr.playingtutorial === true){
       unbr.drawdeck.push(unbr.hand[0]);
       unbr.hand.shift();
       $("#hand div:last").remove();
       $("#infocard").empty();
        unbr.godpresent = false;
        unbr.spiritcolour = false; 
        drawcard();
    } else {
        unbr.limbo.unshift(unbr.hand[0]);
        unbr.hand.shift();
        $("#hand div:last").remove()
        unbr.godpresent = false;
        unbr.spiritcolour = false;
        if (doomtimer === true){
            doomreset();
        }
        $("#infocard").empty();
        $("#infocard").append("<p>The God whisks you off to a new place in the forest.</p>");
        if (unbr.hand.length < 5){
            for (i = unbr.hand.length; i <= 5; i++){
                if (unbr.ghostpresent === false && unbr.godpresent === false){
                    drawcard();
                    ghostcheck();
                    godcheck();
                }
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
        unbr.counter = doom;
    }
    spiritpower();
});


// use a spirit to score a god

$(document).on('click', '#spiritscore', function() {
    $("#infocard").empty();
    $("#infocard").append("<p>Choose a spirit to make peace to this God with<br></p>");
    unbr.scoringgod = true;
    $("#infocard").append("<p id='godcancel' class='option'>I changed my mind<br></p>");
});


// cancels out of previous function

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
        doomreset();
    }
    drawcard();
    if (unbr.playingtutorial === true){
        tutorialimmediate();
    }
});

$(document).on('click', '#deadend', function() {
    $("#infocard").empty();
    discardhand();
});


// defines starting conditions depending on game mode chosen

function initstart(){
    $("#hand").empty();
    $("#sequence").empty();
    $("#cardsremaining").empty();
    $("#distribution").empty();
    $("#scorecard").empty();
    $("#infocard").empty();
    unbr.init();    
}

function addCards(cardType,numOfCards){
    for (var i = numOfCards; i >= 1; i--) {
        unbr.drawdeck.push(cardType);
    }
    if (cardlist === true && unbr.playingtutorial !== true){    
        $("#distribution").append("<div class='cardthumb " + cardType[0] + " " + "'></div>");
        $("#distribution").append("<div id=distribution>" + cardType[1] + " " + numOfCards);
    }
}

function normal(){
    initstart();
    unbr.playingnormal = true;

    addCards(['orange', 'leaf'],6);
    addCards(['orange', 'twig'],4);
    addCards(['orange', 'spirit'],3);
    addCards(['orange', 'god'],2);

    addCards(['green', 'leaf'],7);
    addCards(['green', 'twig'],4);
    addCards(['green', 'spirit'],3);
    addCards(['green', 'god'],2);

    addCards(['blue', 'leaf'],8);
    addCards(['blue', 'twig'],4);
    addCards(['blue', 'spirit'],3);
    addCards(['blue', 'god'],2);

    addCards(['purple', 'leaf'],9);
    addCards(['purple', 'twig'],4);
    addCards(['purple', 'spirit'],3);
    addCards(['purple', 'god'],2);

    addCards(['ghost', 'ghost'],10);
}

function easy(){    
    initstart();
    unbr.playingeasy = true;

    addCards(['orange', 'leaf'],5);
    addCards(['orange', 'twig'],4);
    addCards(['orange', 'spirit'],4);
    addCards(['orange', 'god'],2);

    addCards(['green', 'leaf'],6);
    addCards(['green', 'twig'],4);
    addCards(['green', 'spirit'],4);
    addCards(['green', 'god'],2);

    addCards(['blue', 'leaf'],7);
    addCards(['blue', 'twig'],4);
    addCards(['blue', 'spirit'],4);
    addCards(['blue', 'god'],2);

    addCards(['purple', 'leaf'],8);
    addCards(['purple', 'twig'],4);
    addCards(['purple', 'spirit'],4);
    addCards(['purple', 'god'],2);

    addCards(['ghost', 'ghost'],10);
}

function hard(){    
    initstart();
    unbr.playinghard = true;

    addCards(['orange', 'leaf'],6);
    addCards(['orange', 'twig'],4);
    addCards(['orange', 'spirit'],2);
    addCards(['orange', 'god'],2);

    addCards(['green', 'leaf'],7);
    addCards(['green', 'twig'],4);
    addCards(['green', 'spirit'],2);
    addCards(['green', 'god'],2);

    addCards(['blue', 'leaf'],8);
    addCards(['blue', 'twig'],4);
    addCards(['blue', 'spirit'],2);
    addCards(['blue', 'god'],2);

    addCards(['purple', 'leaf'],9);
    addCards(['purple', 'twig'],4);
    addCards(['purple', 'spirit'],2);
    addCards(['purple', 'god'],2);

    addCards(['yellow', 'spirit'],4);
    addCards(['ghost', 'ghost'],10);
}

function master(){    
    initstart();
    unbr.playingmaster = true;

    addCards(['orange', 'leaf'],5);
    addCards(['orange', 'twig'],4);
    addCards(['orange', 'spirit'],2);
    addCards(['orange', 'god'],2);

    addCards(['green', 'leaf'],6);
    addCards(['green', 'twig'],4);
    addCards(['green', 'spirit'],2);
    addCards(['green', 'god'],2);

    addCards(['blue', 'leaf'], 7);
    addCards(['blue', 'twig'],4);
    addCards(['blue', 'spirit'],2);
    addCards(['blue', 'god'],2);

    addCards(['purple', 'leaf'],8);
    addCards(['purple', 'twig'],4);
    addCards(['purple', 'spirit'],2);
    addCards(['purple', 'god'],2);

    addCards(['yellow', 'spirit'],3);
    addCards(['ghost', 'ghost'],10);
    addCards(['dead', 'trap'],5);
}

function tutorial(){    
    initstart();
    unbr.playingtutorial = true;

    addCards(['green', 'leaf'],6);
    addCards(['green', 'twig'],1);
    addCards(['purple', 'leaf'],1);
    addCards(['blue', 'leaf'],1);
    addCards(['blue', 'spirit'],1);
    addCards(['blue', 'twig'],1);
    addCards(['orange', 'twig'],1);
    addCards(['green', 'god'],1);
    addCards(['blue', 'god'],1);
    addCards(['purple', 'twig'],1);
    addCards(['orange', 'twig'],1);
    addCards(['green', 'spirit'],1);
    addCards(['orange', 'spirit'],1);
    addCards(['purple', 'twig'], 1);
    addCards(['green', 'twig'], 1);
    addCards(['green', 'god'],1);
    addCards(['purple', 'leaf'],1);
    addCards(['blue', 'leaf'],1);
    addCards(['purple', 'twig'],1);
    addCards(['orange', 'twig'],1);
    addCards(['ghost', 'ghost'],4);
    addCards(['purple', 'god'],1);
    addCards(['blue', 'god'],1);
    addCards(['orange', 'god'],1);
    addCards(['purple', 'leaf'],1);
    addCards(['blue', 'leaf'],1);
    addCards(['purple', 'twig'],1);
    addCards(['orange', 'twig'],1);
    addCards(['purple', 'leaf'],1);
    addCards(['blue', 'leaf'],1);
    addCards(['purple', 'twig'],1);
    addCards(['orange', 'twig'],1);
}


// defines layout and setup depending on game mode chosen

function defaultstart(){
    $("#infobox").empty();
    $("#topmenu").fadeIn(300);
    $("#lamp2").fadeIn(800);
    $("#lamp1").fadeIn(300);
    unbr.lamptotal = unbr.drawdeck.length - 5;
    unbr.lamppercent = 1;
    lampfade();
    if (doomtimer === true){
        doomreset();
    }
}

$(document).on('click', '#easy', function() {
    easy();
    defaultstart();
    shuffle(unbr.drawdeck);
    drawhandstart();
    cardcount();
});

$(document).on('click', '#normal', function() {
    normal();
    defaultstart();
    shuffle(unbr.drawdeck);
    drawhandstart();
    cardcount();
});

$(document).on('click', '#hard', function() {
    hard();
    defaultstart();
    shuffle(unbr.drawdeck);
    drawhandstart();
    cardcount();
});

$(document).on('click', '#master', function() {
    master();
    defaultstart();
    shuffle(unbr.drawdeck);
    drawhandstart();
    cardcount();
});


// defines menu options

function menuoptions(){
    $("#infocard").empty().hide();
    $("#lamp1").hide();
    $("#lamp2").hide();
    $("#distribution").empty();
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
    unbr.playingnormal = false;
    unbr.playinghard = false;
    unbr.playingmaster = false;
    unbr.playingtutorial = false;
    $("#hand").append("<center><img src='img/logo.png' style='margin-top: -60px;'></center><br><div id='title'>UNDERBRUSH</div>");
    $("#infocard").append("<p id='easy' class='option'>Easy Mode</p><p id='normal' class='option'>Normal Mode</p><p id='hard' class='option'>Hard Mode</p>");
    if (hardwin !== 0){
        $("#infocard").append("<p id='master' class='option'>Master Mode</p>");
    }
    $("#infocard").append("<p id='tutorial' class='option'>Tutorial</p><p id='rules' class='option'>Rules</p>");
    if (hardwin !== 0){
        if (doomtimer === true){
            $("#infocard").append("<p id='doomoff' class='option'>Turn Doom Timer Off</p>");
        } else {
            $("#infocard").append("<p id='doomon' class='option'>Turn Doom Timer On</p>");
        }
    }
    if (caption === true){
        $("#infocard").append("<p id='captionoff' class='option'>Turn Off Colour Description</p>");
    } else {
        $("#infocard").append("<p id='captionon' class='option'>Turn On Colour Description</p>");
    }
    if (cardlist === true){
        $("#infocard").append("<p id='cardlistoff' class='option'>Turn Off Card Distribution</p>");
    } else {
        $("#infocard").append("<p id='cardliston' class='option'>Turn On Card Distribution</p>");
    }
    $("#hand").fadeIn(800);
    $("#infocard").fadeIn(600);
}

$(document).on('click', '#menubutton', function() {
    menuoptions();
});

$(document).on('click', '#menu', function() {
    menuoptions();
});

$(document).on('click', '#captionon', function() {
    caption = true;
    $("#captionon").replaceWith("<p id='captionoff' class='option'>Turn Off Colour Description</p>");
});

$(document).on('click', '#captionoff', function() {
    caption = false;
    $("#captionoff").replaceWith("<p id='captionon' class='option'>Turn On Colour Description</p>");
});

$(document).on('click', '#cardliston', function() {
    cardlist = true;
    $("#cardliston").replaceWith("<p id='cardlistoff' class='option'>Turn Off Card Distribution</p>");
});

$(document).on('click', '#cardlistoff', function() {
    cardlist = false;
    $("#cardlistoff").replaceWith("<p id='cardliston' class='option'>Turn On Card Distribution</p>");
});

$(document).on('click', '#doomon', function() {
    doomtimer = true;
    $("#doomon").replaceWith("<p id='doomoff' class='option'>Turn Doom Timer Off</p>");
});

$(document).on('click', '#doomoff', function() {
    doomtimer = false;
    $("#doomoff").replaceWith("<p id='doomon' class='option'>Turn Doom Timer On</p>");
});


// defines the behaviour of the doom counter

function doomcount(){
    if (unbr.counter === doom && unbr.godpresent === false && unbr.ghostpresent === false && unbr.gameover === false){
        interval = setInterval(function() {
            if (unbr.godpresent === false && unbr.ghostpresent === false && unbr.gameover === false){
                ghostcheck();
                godcheck();
                unbr.counter--;
                $("#doomcount").replaceWith("<div id='doomcount'><p>" + unbr.counter + "</p></div>")
                if (unbr.counter === 0){
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
                    unbr.counter = doom;
                    doomcount();
                }
            }
        }, 1000);
    }
}

function counter(){
    if (unbr.playingeasy === true || unbr.playingnormal === true || unbr.playinghard === true || unbr.playingmaster === true){
        doomcount();
    }
}


//Tutorial stuff

$(document).on('click', '#tutorial', function() {
    tutorial();
    defaultstart();
    drawhandstart();
    cardcount();
    $("#infocard").append("<p>Hi! Welcome to Underbrush. In this game, you are lost a forest of Gods, Spirits and Ghosts. You will need to find 8 Gods before the deck runs out to win. To do this, you need to play 3 cards of the same colour in a row. The trick being that you can never play the same symbol twice in a row. The cards above are your hand. Try clicking one of them.<p>");
    unbrtut.step1 = true;
});

function tutorialchoices(){
    $('#selectedcard').attr('id','');
    $(unbr.selectedcard).attr('id', 'selectedcard');
    unbr.selectedcard = 0;
    if (unbrtut.step1 === true){
        $("#infocard").append("<p>When you select a card, you can either play it into the game sequence, or discard it. For now, let's play this card.</p>");
         $("#infocard").append("<p id='sequenceplay' class='option'>Play in sequence</p>");
    }
    if (unbrtut.step2 === true){
        $("#infocard").append("<p>Great! Now, because we cannot play two leaves in a row, and we do not have any other kinds of cards, we're going to be forced to discard something. Click a card to discard it.</p>");
    }
    if (unbrtut.step3 === true){
        $("#infocard").empty();
        $("#infocard").append("<p>What would you like to do with this card?</p>");
        $("#infocard").append("<p id='discardplay' class='option'>Discard and draw new card</p>");
    }
    if (unbrtut.step4 === true){
        unbrtut.step2 = false;
        $("#infocard").empty();
        $("#infocard").append("<p>Hey look! A twig! Let's select that and play that into our sequence. This is a legal move because it is not the same symbol as the leaf.</p>");
    }
    if (unbrtut.step5 === true  && unbr.hand[unbr.selected[0]][1] === 'twig'){
        $("#infocard").empty();
        $("#infocard").append("<p>If we play this green twig into our sequence, we will be 2/3 of the way to scoring our first God.</p>");
        $("#infocard").append("<p id='sequenceplay' class='option'>Play in sequence</p>");
    } else if (unbrtut.step5 === true  && unbr.hand[unbr.selected[0]][1] === 'twig'){
        tutoriachoices();
    }
    if (unbrtut.step6 === true){
        $("#infocard").empty();
        $("#infocard").append("<p>Great! Now we can just play another leaf to score our first God.</p>");
    }
    if (unbrtut.step7 === true){
        $("#infocard").empty();
        $("#infocard").append("<p>If we play this green leaf into our sequence, we will have scored our first God of the game.</p>");
        $("#infocard").append("<p id='sequenceplay' class='option'>Play in sequence</p>");
    }
    if (unbrtut.step8 === true){
        unbrtut.step7 = false;
        $("#infocard").empty();
        $("#infocard").append("<p>Fantastic! We've scored our first God! We need to score 8 of them, before the deck runs out of cards, to win. There are 2 of each colour. There are 4 colours in the game. We can't do much at the moment because we only have leaves. We could play a twig if we had one, even one of a different colour! But we unfortunately do not, so discard something else and maybe we will get something more useful.</p>");
    }
    if (unbrtut.step9 === true){
        $("#infocard").empty();
        $("#infocard").append("<p>What would you like to do with this card?</p>");
        $("#infocard").append("<p id='discardplay' class='option'>Discard and draw new card</p>");
    }
    if (unbrtut.step10 === true){
        $("#infocard").empty();
        $("#infocard").append("<p>Ah, we have received a very special card. This is a spirit card. It has many uses. We can play it into a sequence, as it is a symbol just like leaves and twigs are symbols, but, it also has some special powers. We can use the spirits powers if we click it.</p>");
    }
    if (unbrtut.step11 === true){
        $("#infocard").empty();
        $("#infocard").append("<p>Spirits have very special powers. They can see ahead into the future to the next 5 cards that will be drawn. They must then discard one of these cards, but they may re-arrange the remaining cards to their liking. Use this card to see into the future. You will see many twigs. Choose one to discard, and then re-arrange the rest as you prefer.</p>");
        $("#infocard").append("<p id='spiritplay' class='option'>Use spirit power</p>");
    }
    if (unbrtut.step12 === true){
        if (unbr.hand[0][1] != "god"){
            $("#infocard").empty();
            $("#infocard").append("<p>You may have seen something odd in those 5 cards. That was another God. Gods can be pulled into your hand, but if you do draw one, you must reshuffle it immediately, UNLESS you have a spirit of the same colour in your hand. If you do have one, you can actually score the God immediately without having to build a 3 colour in a row sequence. For now, just play a few more cards. You've almost learned the basics of the game.</p>");
            unbrtut.step13 = true;
        } else if (unbr.hand[0][1] == "god"){
            $("#infocard").empty();
            $("#infocard").append("<p>You seem to have found a God amongst the twigs. Gods reside in the deck like any other card. If you draw one, it must be reshuffled into the deck immediately, UNLESS you have a spirit of the same colour in your hand. If you do have one, you can actually score the God immediately without having to build a 3 colour in a row sequence. Shuffle it back in and proceed to play the remaining cards.</p>");
            $("#infocard").append("<p id='godshuffle' class='option'>Shuffle it back into the deck and draw a new card<br></p>");
            unbrtut.step13 = true;
        }
    }
    if (unbrtut.step12 !== true && unbr.godpresent === true){
        $("#infocard").append("<p>A God has appeared before you<br></p>");
        $("#infocard").append("<p id='godshuffle' class='option'>Shuffle it back into the deck and draw a new card<br></p>");
    }
    if (unbrtut.step13 === true && unbr.hand[0][0] === 'ghost'){
        $("#infocard").empty();
        $("#infocard").append("<p>Oh no! A Ghost! Ghosts roam the forest, attempting to prevent you from reaching Gods. When you encounter a Ghost, you have a few options: Discard your hand, discard the next 5 cards from the deck, or discard a spirit if you have one.</p>");
        spiritcheck();
        if (spirithere > 0){
            $("#infocard").append("<p id='donetut1' class='option donetutorial'>Discard a spirit card to escape<br></p>");
        }
        if (unbr.drawdeck.length > 4){
        $("#infocard").append("<p id='donetut2' class='option donetutorial'>Discard entire hand<br></p>"); 
        }
        if (unbr.drawdeck.length > 4){
            $("#infocard").append("<p id='donetut3' class='option donetutorial'>Discard the next 5 unseen cards<br></p>");
        }
    }
}

function tutorialgod(){
    if (unbrtut.step12 === true){
        if (unbr.hand[0][1] != "god"){
            $("#infocard").empty();
            $("#infocard").append("<p>You may have seen something odd in those 5 cards. That was another God. Gods can be pulled into your hand, but if you do draw one, you must reshuffle it immediately, UNLESS you have a spirit of the same colour in your hand. If you do have one, you can actually score the God immediately without having to build a 3 colour in a row sequence. For now, just play a few more cards. You've almost learned the basics of the game.</p>");
            unbrtut.step13 = true;
        } else if (unbr.hand[0][1] == "god"){
            $("#infocard").empty();
            $("#infocard").append("<p>You seem to have found a God amongst the twigs. Gods reside in the deck like any other card. If you draw one, it must be reshuffled into the deck immediately, UNLESS you have a spirit of the same colour in your hand. If you do have one, you can actually score the God immediately without having to build a 3 colour in a row sequence. Shuffle it back in and proceed to play the remaining cards.</p>");
            $("#infocard").append("<p id='godshuffle' class='option'>Shuffle it back into the deck and draw a new card<br></p>");
            unbrtut.step13 = true;
        }
    }
    if (unbrtut.step12 !== true && unbr.godpresent === true){
        $("#infocard").append("<p>A God has appeared before you<br></p>");
        $("#infocard").append("<p id='godshuffle' class='option'>Shuffle it back into the deck and draw a new card<br></p>");
    }
}

function tutorialbranches(){
    if (unbrtut.step13 === true){
        unbrtut.step12 = false;
        $("#infocard").append("<p>What would you like to do with this card?<br></p>");
        if (unbr.sequence.length === 0){
            $("#infocard").append("<p id='sequenceplay' class='option'>Play in sequence</p>");
        } else if (unbr.hand[unbr.selected[0]][1] !== unbr.sequence[unbr.sequence.length -1][1]){
            $("#infocard").append("<p id='sequenceplay' class='option'>Play in sequence</p>");
        }
        if (unbr.hand[unbr.selected[0]][1] === 'spirit'){
            $("#infocard").append("<p id='spiritplay' class='option'>Use spirit power</p>");
        }
        $("#infocard").append("<p id='discardplay' class='option'>Discard and draw new card</p>");
    }
    if (unbrtut.step10 === true && unbr.hand[unbr.selected[0]][1] === 'spirit'){
        unbrtut.step11 = true;
        tutorialchoices();
    } else if (unbrtut.step10 === true && unbr.hand[unbr.selected[0]][1] != 'spirit') {
        $("#infocard").empty();
        $("#infocard").append("<p>Choose the spirit card to use its power.</p>");
    }
    if (unbrtut.step8 === true){
        unbrtut.step9 = true;
        tutorialchoices();
    }
    if (unbrtut.step6 === true && unbr.hand[unbr.selected[0]][0] === 'green'){
        unbrtut.step7 = true;
        tutorialchoices();
    } else if (unbrtut.step6 === true && unbr.hand[unbr.selected[0]][0] != 'green') {
        $("#infocard").empty();
        $("#infocard").append("<p>Choose a green leaf card. We could play this purple leaf instead, but we would be giving up our green sequence so far.</p>");
    }
    if (unbrtut.step4 === true && unbr.hand[unbr.selected[0]][1] === 'twig'){
        unbrtut.step5 = true;
        tutorialchoices();
    } else if (unbrtut.step4 === true && unbr.hand[unbr.selected[0]][1] != 'twig') {
        $("#infocard").empty();
        $("#infocard").append("<p>Choose the green twig card.</p>");
    }
    if (unbrtut.step2 === true){
        unbrtut.step3 = true;
        tutorialchoices();
    }
    if (unbrtut.step1 === true){
        tutorialchoices();
    }
}

function tutorialimmediate(){
    if (unbrtut.step1 === true){
        unbrtut.step1 = false;
        unbrtut.step2 = true;
        tutorialchoices();
    }
    if (unbrtut.step3 === true){
        unbrtut.step3 = false;
        unbrtut.step4 = true;
        tutorialchoices();
    }
    if (unbrtut.step5 === true){
        unbrtut.step5 = false;
        unbrtut.step6 = true;
        unbrtut.step4 = false;
        tutorialchoices();
    }
    if (unbrtut.step7 === true){
        unbrtut.step7 = false;
        unbrtut.step8 = true;
        unbrtut.step6 = false;
        tutorialchoices();
    }
    if (unbrtut.step9 === true){
        unbrtut.step9 = false;
        unbrtut.step10 = true;
        unbrtut.step8 = false;
        tutorialchoices();
    }
    if (unbrtut.step11 === true){
        unbrtut.step11 = false;
        unbrtut.step12 = true;
        unbrtut.step10 = false;
        tutorialchoices();
    }
}

$(document).on('click', '.donetutorial', function() {
    $("#infocard").empty();
    $("#hand").empty()
    $("#sequence").empty();
    unbr.playingtutorial = false;
    unbrtut.step13 = false;
    $("#infocard").append("<p id=ending style=display:none;>And really, that's all there is to the game. Try to get 3 colours in a row, try to use spirits wisely, and try to negotiate ghosts as best as you can. Go play easy to get a feeling for how the game plays out. Have fun!");
    $("#ending").fadeIn(500);
    $("#infocard").append("<p class='option' id='menu'>Main Menu</p>");
});


$(function(){
    unbr.init();
    unbrtut.init();
});
