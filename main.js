let startDiv = document.getElementById("start");
let startBtn = document.getElementById("startBtn");
let finalResult = document.getElementById("finalResult");
let finalCorrect = document.getElementById("finalCorrect");
let finalIncorrect = document.getElementById("finalIncorrect");
let quiz = document.getElementById("quiz");
let imgDiv = document.getElementById("imgDiv");
let options = document.getElementById("options");
let result = document.getElementById("result");
let correctAnswers = document.getElementById("correctAnswers");
let incorrectAnswers = document.getElementById("incorrectAnswers");
let countries = [];
let countryName = [];
let countryFlag = [];
let counter = 0;
let correctGuess = 0;
let incorrectGuess = 0;
let atempt = 0;

fetch("https://restcountries.com/v3.1/all")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Couldn't fetch the data.");
        }
        return response.json();
    })
    .then((data) => {
        fetchData(data);
    })
    .catch((err) => {
        console.error(err);
    });

// FETCH DATA
function fetchData(data) {
    countries = data;

    buildArray();
}

// START GAME
startBtn.addEventListener("click", () => {
    startDiv.style.display = "none";
    finalResult.style.display = "none";

    quiz.style.display = "flex";
    imgDiv.style.display = "flex";
    options.style.display = "grid";

    correctAnswers.innerHTML = "";
    incorrectAnswers.innerHTML = "";

    correctGuess = 0;
    incorrectGuess = 0;

    printData();
});

function buildArray() {
    shuffle(countries);

    countries.forEach((element) => {
        countryName.push(element.name.common);
        countryFlag.push(element.flags.svg);
    });
}

// PRINT DATA
function printData() {
    if (counter < countryName.length) {
        imgDiv.innerHTML = "";
        options.innerHTML = "";

        let op = [];
        op.push(countryName[counter]);

        // Create img element to display flag
        let img = document.createElement("img");
        img.setAttribute("id", "flagImg");
        img.setAttribute("src", countryFlag[counter]);
        imgDiv.appendChild(img);

        // Add unique options
        const seen = new Set();
        seen.add(countryName[counter]);
        while (op.length < 6) {
            const randomIndex = Math.floor(Math.random() * countryName.length);
            if (!seen.has(countryName[randomIndex])) {
                op.push(countryName[randomIndex]);
                seen.add(countryName[randomIndex]);
            }
        }

        // Shuffle option array
        shuffle(op);

        // Create button options
        op.forEach((element) => {
            let btn = document.createElement("button");
            btn.classList.add("btn");
            btn.textContent = element;

            options.appendChild(btn);
        });

        // Add event listener to option buttons
        let allBtn = document.querySelectorAll(".btn");
        allBtn.forEach((element) => {
            element.addEventListener("click", (e) => {
                checkAnswers(e.target.textContent);
            });
        });
    } else {
        endGame();
    }
}

// CHECK FOR THE ANSWERS
function checkAnswers(target) {
    let corr_inc = document.createElement("div");
    corr_inc.classList.add("corr-inc");

    let img = document.createElement("img");
    img.classList.add("imgGuess");

    let p = document.createElement("p");

    // if target option equals country name
    if (target === countryName[counter]) {
        correctGuess++;
        img.setAttribute("src", countryFlag[counter]);
        p.textContent = countryName[counter];
        corr_inc.appendChild(img);
        corr_inc.appendChild(p);
        correctAnswers.prepend(corr_inc);
        counter++;
        printData();
    }
    // if target option doesn't equals country name
    else {
        incorrectGuess++;
        img.setAttribute("src", countryFlag[counter]);
        p.textContent = countryName[counter];
        corr_inc.appendChild(img);
        corr_inc.appendChild(p);
        incorrectAnswers.prepend(corr_inc);
        counter++;
        printData();
    }
}

// CALL FUNCTION WHEN GAME ENDS
function endGame() {
    let btn = document.querySelectorAll(".btn");
    btn.forEach((element) => {
        element.disabled = true;
    });

    startDiv.style.display = "block";

    countryName = [];
    countryFlag = [];
    counter = 0;

    imgDiv.style.display = "none";
    options.style.display = "none";
    finalCorrect.textContent = correctGuess;
    finalIncorrect.textContent = incorrectGuess;
    finalResult.style.display = "block";

    buildArray();
}

// SHUFFLE ARRAYS
function shuffle(arr) {
    for (let i = 0; i < arr.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}
