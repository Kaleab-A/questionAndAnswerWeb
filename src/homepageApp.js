var amountChoice = document.querySelector("#amount");
var categoryChoice = document.querySelector("#categoryChoice");
var difficultyChoice = document.querySelector("#difficultyChoice");
var typeChoice = document.querySelector("#typeChoice");


function getURL() {
    var amount = parseInt(amountChoice.value);
    var category = parseInt(categoryChoice.value);
    var difficulty = difficultyChoice.value;
    var type = typeChoice.value;

    if (amount == "" || amount <= 0 || amount > 50) {
        alert("Number of Question should be between 1 and 50.")
    } else {
        // var url =  + "&category=9&difficulty=easy&type=multiple"
        var url = "https://opentdb.com/api.php?amount=" + amount;
        if (category != 8) {
            url += "&category=" + category;
        }
        if (difficulty != "0") {
            url += "&difficulty=" + difficulty;
        }
        if (type != "0") {
            url += "&type=" + type;
        }

        // Requesting JSON
        var json;
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                json = JSON.parse(req.responseText);
            }
        };
        req.open("GET", url, false);
        req.send();

        if (json["results"].length == 0) {
            alert("There aren't any question in such configuration, Try another one!");
        } else {
            localStorage.setItem("urlSave", JSON.stringify(url));
            window.location.href = "./quiz.html";
        }
    }

}