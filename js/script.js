// 
//Blackjack
//by Steven Hall

// Card variables for unicode
// let unicodePrefix = "&#x1F0",
//     cardSuits = ["A", "D", "B", "C"],
//     cardValue = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "D", "E"];

// Card variables for svg
let cardSuits = ["club", "diamond", "heart", "spade"],
    cardValue = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];


// DOM variables  
let textArea = document.getElementById('textArea'),
    beginGameButton = document.getElementById('beginGameButton'),
    newGameButton = document.getElementById('newGameButton'),
    hitButton = document.getElementById('hitButton'),
    stayButton = document.getElementById('stayButton'),
    gameBoard = document.getElementById('gameBoard'),
    dealerHand = document.getElementById('dealerHand'),
    playerHand = document.getElementById('playerHand'),
    dealerTotal = document.getElementById('dealerTotal'),
    playerTotal = document.getElementById('playerTotal');

// Game variables
let gameStarted = false,
    gameOver = false,
    playerWon = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];

gameBoard.style.display = 'none';
hitButton.style.display = 'none';
stayButton.style.display = 'none';
newGameButton.style.display = 'none';
beginGameButton.style.display = 'inline';

showStatus();

beginGameButton.addEventListener('click', function () {
    newGame();
});

newGameButton.addEventListener('click', function () {
    newGame();
});

hitButton.addEventListener('click', function () {
    playerCards.push(getNextCard());
    checkForEndOfGame();
    showStatus();
});

stayButton.addEventListener('click', function () {
    gameOver = true;
    checkForEndOfGame();
    showStatus();
});

function newGame() {
    gameStarted = true;
    gameOver = false;
    playerWon = false;
    tieGame = false;

    deck = createDeck();
    shuffleDeck(deck);
    dealerCards = [getNextCard(), getNextCard()];
    playerCards = [getNextCard(), getNextCard()];

    beginGameButton.style.display = 'none';
    newGameButton.style.display = 'none';
    hitButton.style.display = 'inline';
    stayButton.style.display = 'inline';
    gameBoard.style.display = 'block';
    checkForEndOfGame();
    showStatus();
}

function createDeck() {
    let deck = [];
    for (let suitIdx = 0; suitIdx < cardSuits.length; suitIdx++) {
        for (let valueIdx = 0; valueIdx < cardValue.length; valueIdx++) {
            let cardColor = 'black';
            if (cardSuits[suitIdx] === 'B' || cardSuits[suitIdx] === 'C') {
                cardColor = 'red';
            } else {
                cardColor = 'black';
            }
            let card = {
                // prefix: unicodePrefix,
                suit: cardSuits[suitIdx],
                value: cardValue[valueIdx],
                color: cardColor
            };
            deck.push(card);
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = 0; i < deck.length; i++) {
        let swapIdx = Math.trunc(Math.random() * deck.length);
        let tmp = deck[swapIdx];
        deck[swapIdx] = deck[1];
        deck[1] = tmp;
    }
}

function getCardString(card, hand, pos) {
    // return '<span class="' + card.color + '">' + card.prefix + card.suit + card.value + ';</span>'; // unicode
    return '<svg id="' + hand + '_' + pos + '" class="playingCards"><use xlink:href="#' + card.suit + '_' + card.value + '"></use></svg>';
}

function getNextCard() {
    return deck.shift();
}

function getCardNumericValue(card) {
    switch (card.value) {
        case '1':
            return 1;
        case '2':
            return 2;
        case '3':
            return 3;
        case '4':
            return 4;
        case '5':
            return 5;
        case '6':
            return 6;
        case '7':
            return 7;
        case '8':
            return 8;
        case '9':
            return 9;
        default:
            return 10;
    }
}

function getScore(cardArray) {
    let score = 0;
    let hasAce = false;
    for (let i = 0; i < cardArray.length; i++) {
        let card = cardArray[i];
        score += getCardNumericValue(card);
        if (card.value === '1') {
            hasAce = true;
        }
    }
    if (hasAce && score + 10 <= 21) {
        return score + 10;
    }
    return score;
}

function updateScores() {
    dealerScore = getScore(dealerCards);
    playerScore = getScore(playerCards);
}

function checkForEndOfGame() {
    updateScores();

    if (gameOver) {
        // Allow the dealer to take cards
        while (dealerScore < playerScore && playerScore <= 21 && dealerScore <= 21) {
            dealerCards.push(getNextCard());
            updateScores();
        }
    }
    if (playerScore > 21) {
        playerWon = false;
        gameOver = true;
    } else if (dealerScore > 21) {
        playerWon = true;
        gameOver = true;
    } else if (dealerScore === 21 && playerScore < 21) {
        playerWon = false;
        gameOver = true;
    } else if (gameOver) {
        if (playerScore > dealerScore) {
            playerWon = true;
        } else if (dealerScore === playerScore) {
            tieGame = true;
            playerWon = false;
        } else {
            playerWon = false;
        }
    }
}

function showStatus() {
    if (!gameStarted) {
        textArea.innerHTML = '&nbsp;';
        return;
    }
    let dealerCardString = '';
    for (let i = 0; i < dealerCards.length; i++) {
        dealerCardString += getCardString(dealerCards[i], 'dealer', i) + '\n';
    }
    let playerCardString = '';
    for (let i = 0; i < playerCards.length; i++) {
        playerCardString += getCardString(playerCards[i], 'player', i) + '\n';
    }

    updateScores();

    dealerHand.innerHTML = dealerCardString;
    dealerTotal.innerHTML = 'Score: ' + dealerScore;

    playerHand.innerHTML = playerCardString;
    playerTotal.innerHTML = 'Score: ' + playerScore;

    textArea.innerHTML = '&nbsp;';

    if (gameOver) {
        if (playerWon) {
            textArea.innerHTML = "YOU WIN! &#129297";
        } else if (tieGame) {
            textArea.innerHTML = "PUSH! &#128566";
        } else {
            textArea.innerHTML = "Dealer wins &#129324";
        }
        // newGameButton.style.visibility = 'visible';
        newGameButton.style.display = 'inline';
        hitButton.style.display = 'none';
        stayButton.style.display = 'none';
    }
}

document.addEventListener("DOMContentLoaded", function () {
    var checkbox = document.querySelector("#INPUT1");
    checkbox.addEventListener('change', function () {
        var cal = document.querySelector("#calendar1");
        if (!this.checked) {
            cal.disabled = true;
            cal.nextElementSibling.style.visibility = 'hidden';
        } else {
            cal.disabled = false;
            cal.nextElementSibling.style.visibility = 'visible';
        }
    });
});


var cal = document.getElementById("calendar1");
if (document.form.parCCalendar.checked) {
    cal.disabled = false;
    cal.nextElementSibling.style.visibility = 'visible';
}
else {
    cal.disabled = true;
    cal.nextElementSibling.style.visibility = 'hidden';
}