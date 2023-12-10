var totalHeight;
var currentHeight;
var currentHeightPercentage;

var pagesHeights = [];
var transitionBlocks = [];

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
        var randomHeight = Math.floor(Math.random() * (10000 - 2000 + 1)) + 2000;
        blocks[i].style.height = randomHeight + "px";
        transitionBlocks[i] = blocks[i];
    }
    totalHeight = document.body.scrollHeight;
}

function populateTransitionBlock(block)
{
    // const folderPath = 'Images/TransitionRandom/';
    // const imageArray = ['image1.jpg', 'image2.jpg', 'image3.jpg'];

    // var numImages = 1;

    // for (let i = 0; i < numImages; i++) 
    // {
    //     const image = document.createElement('img');

    //     const randomX = Math.floor(Math.random() * (block.getBoundingClientRect().width - 100));
    //     const randomY = Math.floor(Math.random() * (block.getBoundingClientRect().height - 100));

    //     const randomNumber = Math.floor(Math.random() * imageArray.length);
    //     image.src = folderPath + imageArray[randomNumber];

    //     image.style.position = "absolute";

    //     image.style.left = 0 + "px";
    //     image.style.top = block.offsetTop + "px";

    //     // image.style.left = randomX + "px";
    //     // image.style.top = randomY + "px";

    //     block.appendChild(image);
    // }
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
    if(!canTransition || currentBlockID == 1) return;
    canTransition = false;

    var scrollSpeed = 40;
    var startPos = pagesHeights[currentBlockID - 1];
    var endPos = pagesHeights[currentBlockID - 2];

    var contentRocket = document.getElementById("contentRocket");
    var transitionTime = 1;
    
    contentRocket.style.animation = "rocketOut " + transitionTime + "s";
    contentRocket.style.animationFillMode = "forwards";

    visuals = new TransitionVisuals(transitionBlocks[currentBlockID - 2]);

    for(var i = startPos; i > endPos; i -= scrollSpeed)
    {
        window.scrollTo(0, i);
        visuals.addVisual(i);
        visuals.updateVisuals();
         
        await new Promise(resolve => setTimeout(resolve, 10));
    }   
    visuals.destroyVisuals();

    window.scrollTo(0, endPos);
    contentRocket.style.animation = "rocketIn " + transitionTime + "s";
    canTransition = true;
}

function update()
{
    setNavRocket();
    setContentRocket();
}

class TransitionVisuals
{
    #currentBlock;
    #imageVisuals = [];
    #folderPath = 'Images/TransitionRandom/';
    #imageArray = ['image1.png', 'image2.png', 'image3.png'];

    constructor(block)
    {
        this.#currentBlock = block;
    }
    updateVisuals() 
    {
        for(var i = 0; i < this.#imageVisuals.length; i++)
        {   
            var currentTop = parseInt(this.#imageVisuals[i].style.top) || 0;
            if(currentTop > this.#currentBlock.offsetTop) 
            { 
                var size = parseInt(this.#imageVisuals[i].style.width) || 0;
                this.#imageVisuals[i].style.top = (currentTop - (size / 2)) + "px"; 
            }
            else
            {
                this.#imageVisuals[i].remove();
            }
            if(this.#imageVisuals[i].getBoundingClientRect().bottom > window.innerHeight)
            {
                this.#imageVisuals[i].remove();
            }
        }
    }
    addVisual(offset)
    {
        if(offset < this.#currentBlock.offsetTop) return;
        if(Math.floor(Math.random() * 101) < 33) return;

        var blockRect = this.#currentBlock.getBoundingClientRect();

        const image = document.createElement('img');

        const randomNumber = Math.floor(Math.random() * this.#imageArray.length);
        image.src = this.#folderPath + this.#imageArray[randomNumber];

        image.style.position = "absolute";

        var imageSize = Math.floor(Math.random() * (20 - 2 + 1) + 2);     
        image.style.width = imageSize + "px";
        image.style.height = imageSize + "px";

        var widthOffset = Math.floor(Math.random() * blockRect.width - imageSize);
        image.style.left = widthOffset + "px";
        image.style.top = offset + "px";

        this.#currentBlock.appendChild(image);
        this.#imageVisuals.push(image);
    }
    destroyVisuals()
    {
        for(var i = 0; i < this.#imageVisuals.length; i++)
        {
            this.#imageVisuals[i].remove();
        }
    }
}
