var totalHeight;
var currentHeight;
var currentHeightPercentage;

var pagesHeights = [];

var currentBlockID = 4;

var canTransition = true;

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
window.onbeforeunload = function () 
{
    window.scrollTo(0, 999999);
};

function setHeightValues()
{
    totalHeight = document.body.scrollHeight;
    var pages = document.getElementsByClassName("contentPage");
    for (var i = 0; i < pages.length; i++) {
        pagesHeights[i] = pages[i].offsetTop;
    }
    pagesHeights[4] = 999999999;
}

function scrollToBottom()
{
    var bottomElement = document.body;
    bottomElement.scrollIntoView({
        behavior: 'auto', 
        block: 'end',
        inline: 'nearest'
    });
    
    window.scrollTo(0, 99999);
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
    
    currentHeight = Math.ceil(document.documentElement.scrollTop);
    currentHeightPercentage = (currentHeight /  totalHeight) * 100;
    currentHeightPercentage = currentHeightPercentage.toFixed(2);

    for (var i = 0; i < 4; i++) {
        if(currentHeight >= pagesHeights[i] && currentHeight < pagesHeights[i + 1])
        {
            currentTopPageHeight = pagesHeights[i];
            currentBotttomPageHeight = pagesHeights[i + 1];
            currentBlockID = i + 1;
        }
    }

    //console.log(currentHeight + " | " + currentBlockID);
    //if(currentBlockID == 3) console.log(pagesHeights[3]);

    var currentPageHeightPercentage = (currentHeight - currentTopPageHeight) / (currentBotttomPageHeight - currentTopPageHeight) * 100;

    var navRocketHeight = currentPageHeightPercentage;

    var lowerPerOffset = -12.5 + (25 * currentBlockID);
    var higherPerOffset = lowerPerOffset + 25;

    navRocketHeight = ((navRocketHeight - 0) / (100 - 0)) * (higherPerOffset - lowerPerOffset) + lowerPerOffset;
    navRocket.style.top = navRocketHeight + "%"; 
}

function setContentRocket()
{
    
    var myElement = document.getElementsByClassName("contentTopBarMainCentre");
    var contentRocket = document.getElementById("contentRocket");
    var rect = myElement[currentBlockID - 1].getBoundingClientRect();

    contentRocket.style.left = rect.left + "px";
    contentRocket.style.top = rect.top + "px";
    contentRocket.style.width = rect.width + "px";
    contentRocket.style.height = rect.height + "px";
}

function goToNavPage(pageID)
{
    window.scrollTo(0, pagesHeights[pageID]);
}

async function scrollToNextPage()
{
    if(!canTransition) return;
    canTransition = false;

    var scrollSpeed = 30;
    var startPos = pagesHeights[currentBlockID - 1];
    var endPos = pagesHeights[currentBlockID - 2];

    var contentRocket = document.getElementById("contentRocket");
    var transitionTime = 1;
    
    contentRocket.style.animation = "rocketOut " + transitionTime + "s";
    contentRocket.style.animationFillMode = "forwards";

    for(var i = startPos; i > endPos; i -= scrollSpeed)
    {
        window.scrollTo(0, i);
        await new Promise(resolve => setTimeout(resolve, 10));
    }   

    window.scrollTo(0, endPos);
    contentRocket.style.animation = "rocketIn " + transitionTime + "s";
    canTransition = true;
}

function update()
{
    setNavRocket();
    setContentRocket();
}

document.addEventListener('keypress', (event) => {
    var code = event.code;
    if(code == "Space")
    {
        window.scrollTo(0, 999999);
    }
  }, false);

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);