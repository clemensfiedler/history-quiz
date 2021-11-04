function getRandomInt(max, size) {
    var numbers = []
    max = Math.floor(max);

    while (numbers.length < size) {
        newNumber = Math.floor(Math.random() * max)
        if (numbers.includes(newNumber)) {
            continue;
        } else {
            numbers.push(newNumber)
        }
      }

    return numbers
  }

function getNewEvent() {
    do {
        idx = getRandomInt(questionData.length, 1)[0]
    }
    while (questionID.includes(idx));

    questionID.push(idx)
    new_event = questionData[idx]

    return new_event
}

function formatEvent(element) {

    event_HTML =
    `
    <div frozen="false" class="box"
    year_start=${element.year_start} year_end=${element.year_start}>
        ${element.event}
        <div reveal="false" class="solution">
            ${element.date}
        </div>
    </div>
    `
    return event_HTML
}

function appendEvent(element) {
    fmt = formatEvent(element)
    quizContainer.innerHTML = quizContainer.innerHTML + fmt
}

function updateEvents() {
    // get a new event and append it to the list
    questionList.push(getNewEvent())
    // mark all previous events as frozen
    items = document.querySelectorAll('.quiz-container .box')
    for (it of items) {
        it.setAttribute('frozen', true);
        it.getElementsByClassName('solution')[0].setAttribute('reveal', true);
    }
    // append its button
    appendEvent(questionList[questionList.length-1])
}

function validateAnswer() {
    // get current order
    items = document.querySelectorAll('.quiz-container .box');
    // initialize start and end year to negative infinity
    var lastEventStart = -Infinity
    var nextEventEnd = lastEventStart

    for (it of items) {
        //get the end year of the next event
        nextEventEnd = parseInt(it.getAttribute('year_end'))
        //did the next event end after the previous event started?
        if (lastEventStart <= nextEventEnd) {
            // take the starting year of the next event
            lastEventStart = parseInt(it.getAttribute('year_start'))
        } else {
            // the order is incompatible so return false
            return false
        }
    }
    return true
}

function submit() {

    // validate answer
    res = validateAnswer()

    solutionList = document.querySelectorAll(".solution");
    solutionList.forEach(function(currentValue, currentIndex, listObj) {
        currentValue.style.display = "block"
    })

    // update points
    currentPoints = currentPoints + res
    pointString = `${currentPoints}`
    pointContainer.innerHTML = pointString;

    if (res == true) {
        // get next event
        updateEvents()
    } else {
        //game ends
        // reveal all years
        items = document.querySelectorAll('.quiz-container .box')
        for (it of items) {
            it.getElementsByClassName('solution')[0].setAttribute('reveal', true);
        }
        submitButton.disabled = true
        stateContainer.innerHTML = "Game OVER! Total points: " + `${currentPoints}`
    }
}

function reset() {
    location.reload()
}

// define containers
const pointContainer = document.getElementById('points')
const stateContainer = document.getElementById('gamestate')
const quizContainer = document.getElementById('quiz');
const newEventContainer = document.getElementById('nextEvent')

// define buttons
const submitButton = document.getElementById("submit");
const resetButton = document.getElementById("reset");

// button listeners
submitButton.addEventListener('click', submit);
resetButton.addEventListener('click', reset);

var currentQuestion = 0 // question being shown
var maxQuestion = 0 // last question being solved
var currentPoints = 0 // keep track of points
var numEvents = 4 // number of events to sort

//get first question
var questionList = []
var questionID = []
questionList.push(getNewEvent())
appendEvent(questionList[0])
// get second event
updateEvents()

//showQuestion(questionList[currentQuestion]);
