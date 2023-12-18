var totalHeight;
var currentHeight;
var currentHeightPercentage;

var pagesHeights = [];
var contentPages = [];
var transitionBlocks = [];

var currentBlockID = 1;

var canTransition = true;

var currentProjectCardsPage = 1;
var maxProjectCardsPage = 1;

var hasSelectedCard;

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
    onExitProjectCard();
    currentProjectCardsPage = 1;
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
        contentPages[i] = pages[i];
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
        var randomHeight = Math.floor(Math.random() * (8000 - 4000 + 1)) + 4000;
        blocks[i].style.height = randomHeight + "px";
        transitionBlocks[i] = blocks[i];
    }
}

function setContentPageHeight()
{
    if(!isMobileDevice()) return;

    var testPage = document.getElementById('homePage');
    testPage.setAttribute('style', 'height: ' + window.innerHeight + 'px !important');

    var pages = document.getElementsByClassName("contentPage");
    for (var i = 0; i < pages.length; i++) {
        pages[i].setAttribute('style', 'height: ' + window.innerHeight + 'px !important');
    }
    document.getElementById('sideNavBarDiv').setAttribute('style', 'height: ' + window.innerHeight + 'px !important');

    setHeightValues();
}

function setNavRocket()
{
    var navRocket = document.getElementById("navRocket");

    currentHeight = Math.ceil(document.documentElement.scrollTop);

    var currentTopPageHeight = 0;
    var currentBotttomPageHeight = 0;
    
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
    var transitionTime = 2;
    
    contentRocket.style.animation = "rocketOut " + transitionTime + "s";
    contentRocket.style.animationFillMode = "forwards";

    visuals = new TransitionVisuals(transitionBlocks[currentBlockID - 2]);

    var currentWrapperDiv = contentPages[currentBlockID - 1].getElementsByClassName('contentWrapper');
    var nextWrapperDiv = contentPages[currentBlockID - 2].getElementsByClassName('contentWrapper');
    var currentFooterDiv = contentPages[currentBlockID - 1].getElementsByClassName('contentBottomBar');
    var nextFooterDiv = contentPages[currentBlockID - 2].getElementsByClassName('contentBottomBar');

    $(currentWrapperDiv).fadeOut(500, "linear"); 
    $(nextWrapperDiv).fadeOut(500, "linear");  
    $(currentFooterDiv).fadeOut(500, "linear");  
    $(nextFooterDiv).fadeOut(500, "linear"); 

    await new Promise(resolve => setTimeout(resolve, 500));

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

    await new Promise(resolve => setTimeout(resolve, 1500));
    $(currentWrapperDiv).fadeIn(500, "linear"); 
    $(nextWrapperDiv).fadeIn(500, "linear"); 
    $(currentFooterDiv).fadeIn(500, "linear"); 
    $(nextFooterDiv).fadeIn(500, "linear");

    canTransition = true;
}

function setProjectCards()
{
    if(currentBlockID != 2 || hasSelectedCard) return;

    var cardsContainer = document.getElementById('projectsCardsDiv');
    var projectCards = [];
    var maxCardsPerPage;

    projectCards = cardsContainer.getElementsByClassName('projectCard');

    //get height and width values of box and cards
    projectCards[0].style.display = "block";
    var cardHeight = projectCards[0].getBoundingClientRect().height;
    var cardWidth = outerWidth(projectCards[0]);
    var containerBox = cardsContainer.getBoundingClientRect();
    projectCards[0].style.display = "none";

    //set height of container
    cardsContainer.style.height = (document.getElementById('contentProjectWrapper').offsetHeight - document.getElementById('projectsNavDiv').offsetHeight) + "px";

    //calculate how many cards fit 
    var wrapperHorFit = Math.floor(containerBox.width / cardWidth);
    var wrapperVertFit = Math.floor(containerBox.height / cardHeight);
    var totalWrapperfit = wrapperHorFit * wrapperVertFit;

    maxCardsPerPage = totalWrapperfit;
    maxProjectCardsPage = Math.ceil(projectCards.length / maxCardsPerPage);
    
    //set visible cards based on current page
    for(var i = 0; i <= projectCards.length - 1; i++)
    {
        if(i >= (currentProjectCardsPage - 1) * maxCardsPerPage && i < maxCardsPerPage * currentProjectCardsPage)
        {
            projectCards[i].style.display = "block";
        }
        else{
            projectCards[i].style.display = "none";
        }
    }
    document.getElementById('projectsCardsPageText').innerHTML = currentProjectCardsPage + " of " + maxProjectCardsPage;  
}

function projectsNextPage()
{
    if(currentProjectCardsPage < maxProjectCardsPage) currentProjectCardsPage++;
}
function projectsPreviousPage()
{
    if(currentProjectCardsPage > 1) currentProjectCardsPage--;
}

function onClickProjectCard(cardContentID)
{
    var allProjectCardContent =  document.getElementsByClassName('projectCardContent');
    var currentSelectedCard = allProjectCardContent[cardContentID - 1];

    var contentWrapper = document.getElementById('projectsMainDiv');
    var contentWrapperBox = contentWrapper.getBoundingClientRect();

    currentSelectedCard.setAttribute('style', 'display:flex !important');
    currentSelectedCard.style.position = "absolute";
    currentSelectedCard.style.width = (contentWrapper.offsetWidth + 1) + 'px';
    currentSelectedCard.style.height = contentWrapper.offsetHeight+ 'px';;
    currentSelectedCard.style.left = contentWrapperBox.left +'px';
    currentSelectedCard.style.top = (contentWrapperBox.top - 1) + 'px';

    hasSelectedCard = true;
}
function onExitProjectCard()
{
    var allProjectCardContent = document.getElementsByClassName('projectCardContent');
    for(var i = 0; i < allProjectCardContent.length; i++)
    {
        allProjectCardContent[i].style.width = 0 + 'px';
        allProjectCardContent[i].style.height = 0 + 'px';
        allProjectCardContent[i].setAttribute('style', 'display:none !important');
    }
    hasSelectedCard = false;
}

function update()
{
    setNavRocket();
    setContentRocket();
    setProjectCards();
    setContentPageHeight();
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

function outerWidth(el) {
    var width = el.offsetWidth;
    var style = getComputedStyle(el);
  
    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
    return width + 1;
}

function isMobileDevice() {
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(navigator.userAgent);
  }
  

