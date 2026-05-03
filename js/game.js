console.log("game mode");
const audio = document.getElementById("song");
const lyricsDiv = document.getElementById("lyrics-div");
const btnStampf = document.getElementById("stampf");
const btnKlatsch = document.getElementById("klatsch");
const btnRestart = document.getElementById("restart");
const finalScore = document.getElementById("final-score");
const btns = document.getElementById("buttons");
const volumeIcon = document.getElementById("volumeIcon");
const volumeSlider = document.getElementById("volume");
const clockIcon = document.getElementById("clockIcon");
const playbackSlider = document.getElementById("playbackSlider");
const tutorialDiv = document.getElementById("tutorial-div");
const btnTutorial = document.getElementById("tutorial");
const nextTutorial = document.getElementById("nextPage");
const InstructionTutorial = document.getElementById("tutorialInstruction");
const endTutorial = document.getElementById("cancelTutorial");


let imgText = document.getElementsByClassName("text_tutorial");
let imagesTutorial = document.getElementsByClassName("img");


let currentWord = null;
let animationId;
let score = 0;
let practise = false;
let currentPractice = null;


const sounds = {
  stampf: new Audio("media/stampf.ogg"),
  klatsch: new Audio("media/klatsch.ogg")
};

const feedbackSounds = {
  correct: new Audio("media/correct.mp3"),
  wrong: new Audio("media/wrong.mp3")
};


function restartGame() {
  score = 0;
  currentWord = null;

  lyrics.forEach(line => {
    line.words.forEach(word => word.solved = false);
  });
  finalScore.classList.add("hidden");
  btnRestart.textContent = "▶ Hrát";
  audio.currentTime = 11;
  audio.play();
  btnRestart.classList.add("hidden");
  lyricsDiv.classList.remove("hidden");
  btns.classList.remove("hidden");
  updateLyrics();
}

function correctWord(word) {
    if (word.img) { 
      if (word.img.includes("stampf")) return "stampf";
      if (word.img.includes("klatsch")) return "klatsch";
    }
    return null;
}

function updateLyrics() {
  const currentTime = audio.currentTime;
  lyricsDiv.innerHTML = '';
  currentWord = null;

  for (const line of lyrics) {
    if (currentTime >= line.start && currentTime <= line.end) {
      const lineDiv = document.createElement('div');

      line.words.forEach(word => {
        const span = document.createElement('span');
        span.classList.add('word-container');
        if (word.img) {
          const img = document.createElement('img');
          img.src = word.img;
          span.appendChild(img);
        }

        const text = document.createElement('span');

        if (word.img) {
          if (!word.solved) {
            text.textContent = '___';

            if (currentTime >= word.start && currentTime <= word.end) {
              currentWord = {
                correct: correctWord(word),
                element: text,
                fullText: word.text,
                wordRef: word,
                start: word.start,
                end: word.end
              };
            }

          } else text.textContent = word.text;
          
        } else {
          text.textContent = word.text;
        }

        span.appendChild(text);

        if (currentTime >= word.start && currentTime <= word.end) {
          span.classList.add('word-active');
        }

        lineDiv.appendChild(span);
      });

      lyricsDiv.appendChild(lineDiv);
    }
  }

  if (currentWord && currentTime > currentWord.end + 1) {
    currentWord.wordRef.solved = true;
    currentWord = null;
  }

  if (!audio.paused) {
    animationId = requestAnimationFrame(updateLyrics);
  }
}

function btnWrong(button) {
  button.classList.add("btn-danger");
  setTimeout(() => {
    button.classList.remove("btn-danger");
    button.classList.add("btn-primary");
  }, 300);
}

function handleAnswer(choice, button) {
  if (!currentWord) {
    btnWrong(button);
    return;
  }

  const now = audio.currentTime;
  const early = currentWord.start - 1;
  const late = currentWord.end + 1;

  if (now < early || now > late) {
    btnWrong(button);
    return;
  }

  if (choice === currentWord.correct) {
    button.classList.add("btn-success");
    currentWord.element.textContent = currentWord.fullText;
    currentWord.wordRef.solved = true;
    currentWord = null;
    score++;

    setTimeout(() => {
      button.classList.remove("btn-success");
      button.classList.add("btn-primary");
    }, 300);

  } else {
    btnWrong(button);
  }
}

// buttons
btnStampf.addEventListener("click", () => handleAnswer("stampf", btnStampf));
btnKlatsch.addEventListener("click", () => handleAnswer("klatsch", btnKlatsch));

// end screen
audio.addEventListener("ended", () => {
  lyricsDiv.classList.add("hidden");
  finalScore.textContent = "Dosažené skóre: " + score;
  finalScore.classList.remove("hidden");
  btns.classList.add("hidden");
  btnRestart.classList.remove("hidden");
  btnRestart.textContent = "Restart";
});

// play / restart button
btnRestart.addEventListener("click", () => {
  
  if (btnRestart.textContent.includes("▶")) {
  btnTutorial.classList.add("hidden");

    audio.currentTime = 11;
    audio.play();
    btnRestart.classList.add("hidden");
    lyricsDiv.classList.remove("hidden");
    btns.classList.remove("hidden");
   volumeIcon.classList.remove("hidden");
    clockIcon.classList.remove("hidden");
    updateLyrics();
  } else  restartGame();

});

// volume slider
volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

volumeIcon.addEventListener("click", () => {
  volumeSlider.style.display =
    volumeSlider.style.display === "inline-block" ? "none" : "inline-block";
});


// playback slider
playbackSlider.addEventListener("input", (e) => {
  audio.playbackRate = e.target.value;
});

clockIcon.addEventListener("click", () => {
  playbackSlider.style.display =
    playbackSlider.style.display === "inline-block" ? "none" : "inline-block";
});


nextTutorial.addEventListener("click", () => {
if (!practise) {
  nextTutorial.classList.add("bi-arrow-left-short");
    nextTutorial.classList.remove("bi-arrow-right-short");
    btnTutorial.classList.remove("hidden");
    InstructionTutorial.classList.remove("hidden");
    btnTutorial.textContent = "🔊 Přehrát zvuk";

for (let i = 0; i < imgText.length; i++) {
let text = imgText[i];
let img = imagesTutorial[i];
  text.classList.add("hidden");
  img.classList.add("interactible");
}
  practise = true;

} else {
    nextTutorial.classList.add("bi-arrow-right-short");
  nextTutorial.classList.remove("bi-arrow-left-short");
  btnTutorial.classList.add("hidden");
    InstructionTutorial.classList.add("hidden");

for (let i = 0; i < imgText.length; i++) {
let text = imgText[i];
let img = imagesTutorial[i];

  text.classList.remove("hidden");
  img.classList.remove("interactible");
}
practise = false;
}
});

btnTutorial.addEventListener("click", () => {
 if (!practise) {
    tutorialDiv.classList.remove("hidden");
    btnTutorial.classList.add("hidden");
    btnRestart.classList.add("hidden");
    endTutorial.classList.remove("hidden");
    return;
  }
  if (currentPractice === null) {
    const options = ["stampf", "klatsch"];
    currentPractice = options[Math.floor(Math.random() * options.length)];
  }

  sounds[currentPractice].currentTime = 0;
  sounds[currentPractice].play();

});


Array.from(imagesTutorial).forEach(img => {
  img.addEventListener("click", () => {

  if (!practise || !currentPractice) return;

  const chosen = img.alt.toLowerCase();

  if (chosen === currentPractice) {
   console.log("correct");
   img.classList.add("bg-success");
    currentPractice = null;
    feedbackSounds.correct.currentTime = 0;
    feedbackSounds.correct.play();

  } else {
   img.classList.add("bg-danger");
      feedbackSounds.wrong.currentTime = 0;
    feedbackSounds.wrong.play();

  }

  setTimeout(() => {
    img.classList.remove("bg-danger", "bg-success");
  }, 300);

});
});


endTutorial.addEventListener("click", () => {
  practise = false;
  currentPractice = null;
tutorialDiv.classList.add("hidden");
btnRestart.classList.remove("hidden");
InstructionTutorial.classList.add("hidden");
btnTutorial.classList.remove("hidden");
btnTutorial.textContent = "Procvičení slov";
endTutorial.classList.add("hidden");
nextTutorial.classList.add("bi-arrow-right-short");
  nextTutorial.classList.remove("bi-arrow-left-short");
for (let i = 0; i < imgText.length; i++) {
let text = imgText[i];
let img = imagesTutorial[i];
  text.classList.remove("hidden");
  img.classList.remove("interactible");
}

});