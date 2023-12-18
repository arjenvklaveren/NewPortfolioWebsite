$(document).ready(function(){
  loadCards();
});

function loadCards()
{
    $("#projectsCardsDiv").load("cards.html");
}