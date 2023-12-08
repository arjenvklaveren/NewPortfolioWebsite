var totalHeight;
var currentHeight;
var currentHeightPercentage;

var pagesHeights = [];

window.onload = function() 
{
    generateTransitionBlocks();
    setHeightValues();
    scrollToBottom();
    setInterval(update, 10);
};

window.onresize = function()
{
    setHeightValues();
}

function setHeightValues()
{
    totalHeight = document.body.scrollHeight;
    var pages = document.getElementsByClassName("contentPage");
    for (var i = 0; i < pages.length; i++) {
        pagesHeights[i] = pages[i].offsetTop;
    }
}

function scrollToBottom()
{
    var bottomElement = document.body;
    bottomElement.scrollIntoView({
        behavior: 'auto', 
        block: 'end',
        inline: 'nearest'
    });
}

function generateTransitionBlocks()
{
    //set random height of transition blocks
    var blocks = document.getElementsByClassName("transitionBlock");
    for (var i = 0; i < blocks.length; i++) {
        var randomHeight = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
        blocks[i].style.height = randomHeight + "px";
    }
    totalHeight = document.body.scrollHeight;
}

function setNavRocket()
{
    var navRocket = document.getElementById("navRocket");

    var currentTopPageHeight = 0;
    var currentBotttomPageHeight = 0;
    var currentBlockID = 0; 
    
    for (var i = 0; i < 4; i++) {
        if(currentHeight >= pagesHeights[i] && currentHeight < pagesHeights[i + 1])
        {
            currentTopPageHeight = pagesHeights[i];
            currentBotttomPageHeight = pagesHeights[i + 1];
            currentBlockID = i + 1;
        }
    }
    currentHeight = document.documentElement.scrollTop;
    currentHeightPercentage = (currentHeight /  totalHeight) * 100;
    currentHeightPercentage = currentHeightPercentage.toFixed(2);

    var currentPageHeightPercentage = (currentHeight - currentTopPageHeight) / (currentBotttomPageHeight - currentTopPageHeight) * 100;
    if(currentHeight == totalHeight) { currentPageHeightPercentage = 100; currentBlockID = 3; }

    var navRocketHeight = currentPageHeightPercentage;

    var lowerPerOffset = -12.5 + (25 * currentBlockID);
    var higherPerOffset = lowerPerOffset + 25;

    navRocketHeight = ((navRocketHeight - 0) / (100 - 0)) * (higherPerOffset - lowerPerOffset) + lowerPerOffset;
    navRocket.style.top = navRocketHeight + "%";  
}

function update()
{
    setNavRocket();
}

document.addEventListener('keypress', (event) => {
    var code = event.code;
    if(code == "Space")
    {
        
    }
  }, false);

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);