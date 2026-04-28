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

let currentWord = null;
let animationId;
let score = 0;

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
});

// play / restart button
btnRestart.addEventListener("click", () => {
  if (btnRestart.textContent.includes("▶")) {
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

