var container = document.querySelector("#container");
var choice = document.querySelector("#choice");
var status1 = document.querySelector("#status");
var question = document.querySelector("#question");
var resultShow = document.querySelector("#result");
var correctStatus = document.querySelector("#correct");
var wrongStatus = document.querySelector("#wrong");
var finished = document.querySelector("#finished");

var url = "";
var shuffledChoice;
var currQuestion = 0;
var numberOfQuestions = 0;
var correctAns = 0;
var wrongAns = 0;
var alpha = new Map();
alpha.set(0, "A");
alpha.set(1, "B");
alpha.set(2, "C");
alpha.set(3, "D");

// Shuffles array
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

// Sleeps for xms
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var json;

function loadData() {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == 200) {
      json = JSON.parse(req.responseText)["results"];
      numberOfQuestions = json.length;
      finished.style.width = "0%";
      correctStatus.style.width = "0%";
      wrongStatus.style.width = "0%";
      previewNext();
    }
  };
  req.open("GET", url, true);
  req.send();
}

// Preview Next Question
function previewNext() {
  question.innerHTML = json[currQuestion]["question"];
  choice.innerHTML = "";
  var numberOfChoice = json[currQuestion]["incorrect_answers"].length + 1;

  // Added all choices to one array and shuffle them
  shuffledChoice = new Array();
  shuffledChoice.push(json[currQuestion]["correct_answer"]);
  json[currQuestion]["incorrect_answers"].forEach(function (item) {
    shuffledChoice.push(item);
  });
  shuffleArray(shuffledChoice);

  // Create li, Add choices to li, Add li to ul
  for (let index = 0; index < numberOfChoice; index++) {
    var li = document.createElement("LI");
    li.id = index;
    var circle = document.createElement("div");
    circle.innerHTML = alpha.get(index);
    circle.classList = ["circle"];
    li.appendChild(circle);
    li.innerHTML += shuffledChoice[index];
    choice.appendChild(li);
  }

  // Showing status and progress bar
  var id = setInterval(frame, 75);

  function frame() {
    if (parseInt(finished.style.width) >= 100 * ((currQuestion - 1) / numberOfQuestions)) {
      clearInterval(id);
    }
    finished.style.width = parseInt(finished.style.width) + 1 + "%";
  }
  status1.innerHTML = "Question " + (currQuestion + 1) + "/" + numberOfQuestions;
  currQuestion += 1;

  if (currQuestion > numberOfQuestions) {
    previewScore();
  }
}

// No more Questions, Show result 
function previewScore() {

  resultShow.style.display = "none";
  container.innerHTML = "";
  var congra = document.createElement("H1");
  congra.innerHTML = "Congratulations!";
  congra.classList.add("congra");
  container.appendChild(congra);

  var message = document.createElement("H2");
  message.innerHTML = "You have finished the quiz.";
  message.classList.add("alignCenter");
  container.appendChild(message);

  var score = document.createElement("H5");
  score.innerHTML = "Score: " + correctAns + "/" + numberOfQuestions;
  score.classList.add("alignCenter");
  score.classList.add("score");
  container.appendChild(score);

  var tryAgain = document.createElement("button");
  tryAgain.innerHTML = "Try Again";
  tryAgain.classList.add("tryAgain");
  tryAgain.addEventListener("click", function () {
    window.location.href = "./index.html";
  })
  container.appendChild(tryAgain);
}

choice.addEventListener("click", function (event) {
  if (json[currQuestion - 1]["correct_answer"] == shuffledChoice[event.target.id]) {
    correctAns++;
    // Animating the result bar if correct
    var id = setInterval(frame, 75);

    function frame() {
      if (parseInt(correctStatus.style.width) >= 100 * (correctAns / numberOfQuestions)) {
        clearInterval(id);
      } else {
        correctStatus.style.width = parseInt(correctStatus.style.width) + 1 + "%";
      }
    }
  } else {
    wrongStatus.style.paddingRight = "7px";
    wrongAns++;
    // Animating the result bar if wrong
    var id = setInterval(frame, 75);

    function frame() {
      if (parseInt(wrongStatus.style.width) >= 100 * (wrongAns / numberOfQuestions)) {
        clearInterval(id);
      } else {
        wrongStatus.style.width = parseInt(wrongStatus.style.width) + 1 + "%";
      }
    }
  }
  if (currQuestion >= numberOfQuestions) {
    var id = setInterval(frame, 75);

    function frame() {
      if (parseInt(finished.style.width) >= 100 * ((numberOfQuestions) / numberOfQuestions)) {
        clearInterval(id);
      }
      finished.style.width = parseInt(finished.style.width) + 1 + "%";
    }
    sleep(1700).then(() => {
      previewScore(); // No more Questions
    });
  } else {
    previewNext(); // Show more Questions
  }
});

document.addEventListener("DOMContentLoaded", function () {
  url = JSON.parse(localStorage.getItem("urlSave"));
  console.log(url)
  loadData();
});

/* TO-DO
  - Add animation when the progress bar increases             <-- JS                Done
  - Add a home page for choosing topic or related stuffs      <-- HTML, JS          Done
  - Add link generated from the link                          <-- JS                Done
  - Add nice background for the container                     <-- CSS               
  - Upload the code to Github                                 <-- Github Bash       


  - Link to Image: https://i.pinimg.com/originals/23/c9/a2/23c9a28599ec5b9e71d6b6c18617926a.png
  - Link to Image 1: https://i.pinimg.com/originals/f9/fa/ab/f9faab0fa78ac24c6d74bdc26a75a024.png
*/