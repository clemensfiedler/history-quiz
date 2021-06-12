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

function getNewQuestion() {
    questionIDs = getRandomInt(questionData.length, 4)

    var question = {'events': []}

    for (idx of questionIDs) {
        question.events.push(questionData[idx])
    }

    return question
}

function showQuestion(question) {
    // variable to store the HTML output
    const output = [];
    const answers = [];

    // and for each available answer...
    for (element of question.events) {

        answers.push(
            `
            <div draggable="true" class="box"
            year_start=${element.year_start} year_end=${element.year_start}>
                ${element.event}
                <div class="solution">
                    ${element.date}
                </div>
            </div>
            `
        );
    }

    output.push(
        `<div class="slide">
          <div class="question"> Question ${currentQuestion+1} </div>
          <div class="answers"> ${answers.join("")} </div>
        </div>`
    );

    quizContainer.innerHTML = output.join('');

    solutionList = document.querySelectorAll(".solution");
    solutionList.forEach(function(currentValue, currentIndex, listObj) {
        currentValue.style.display = "none"
    })

    // make dragable
    makeDragAble()
}

function validateAnswer() {

    // get current order
    items = document.querySelectorAll('.quiz-container .box');
    var lastYear = -Infinity
    var newYearStart = lastYear

    for (it of items) {
        //compare end year of next event
        newYearStart = parseInt(it.getAttribute('year_end'))
        //did it end after the other started?
        if (lastYear <= newYearStart) {
            lastYear = parseInt(it.getAttribute('year_start'))
        } else {
            it.style.color = 'red'
            return false
        }
    }
    return true
}

function submit() {
    res = validateAnswer()

    solutionList = document.querySelectorAll(".solution");
    solutionList.forEach(function(currentValue, currentIndex, listObj) {
        currentValue.style.display = "block"
    })

    // update points
    currentPoints = currentPoints + res
    pointString = `${currentPoints} / ${maxQuestion+1}`

    // deactivate submit button
    submitButton.disabled = true

    // update number of answered questions
    maxQuestion = maxQuestion + 1

    pointContainer.innerHTML = pointString;

    // stop being draggable
    document.querySelectorAll('.quiz-container .box')

    update()
}

function nextQuestion() {
    if (currentQuestion == maxQuestion-1) {
        //all questions answered
        //increment counter
        currentQuestion = currentQuestion + 1
        //get new question
        questionList.push(getNewQuestion())
        submitButton.disabled=false
    } else {
        currentQuestion = currentQuestion + 1
    }
    showQuestion(questionList[currentQuestion]);

    update()
}

function previousQuestion() {

    currentQuestion = currentQuestion-1
    showQuestion(questionList[currentQuestion]);

    update()
}

//general updates called if question changes
function update() {
    // deactivate previous Button
    if (currentQuestion<1) {
        previousButton.disabled = true
    } else {
        previousButton.disabled = false
    }
    // set submit and next button
    if (currentQuestion==maxQuestion) {
        submitButton.disabled = false
        nextButton.disabled = true
    } else {
        submitButton.disabled = true
        nextButton.disabled = false
    }
}

function reset() {
    if (confirm("Are you sure you want to reset the quiz?")) {
        location.reload()
    }
}

// define containers
const pointContainer = document.getElementById('points')
const quizContainer = document.getElementById('quiz');

// define buttons
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const submitButton = document.getElementById("submit");
const resetButton = document.getElementById("reset");

// button listeners
submitButton.addEventListener('click', submit);
nextButton.addEventListener('click', nextQuestion);
previousButton.addEventListener('click', previousQuestion);
resetButton.addEventListener('click', reset);

var currentQuestion = 0 // question being shown
var maxQuestion = 0 // last question being solved
var currentPoints = 0 // keep track of points
var numEvents = 4 // number of events to sort

//deactivate back button
previousButton.disabled = true
nextButton.disabled = true

//get first question
var questionList = []
questionList.push(getNewQuestion())
showQuestion(questionList[currentQuestion]);


