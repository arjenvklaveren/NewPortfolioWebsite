window.onload = function() {
    //scroll to bottom of the page at startup
    var bottomElement = document.body;
    bottomElement.scrollIntoView({
        behavior: 'auto', 
        block: 'end',
        inline: 'nearest'
    });

    //set random height of transition blocks
    var elements = document.getElementsByClassName("transitionBlock");
    for (var i = 0; i < elements.length; i++) {
        var randomHeight = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
        elements[i].style.height = randomHeight + "px";
    }
};