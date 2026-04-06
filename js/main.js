console.log("funguje");
const audio =  document.getElementById("song")
const lyricsDiv = document.getElementById("lyrics-div");
const progress = document.getElementById("progress");
const volumeIcon = document.getElementById("volumeIcon");
const volumeSlider = document.getElementById("volume");
const btnStampf = document.getElementById("stampf");
const btnKlatsch = document.getElementById("klatsch");
const btnRestart = document.getElementById("restart");
const finalScore = document.getElementById("final-score");
const btns = document.getElementById("buttons");
const settings = document.getElementById('settings');
const btnmain = document.getElementById("main");


let currentTime = 0;
let currentWord = null;
let animationId;
let gamemode = 'hard';
let score = 0;

function restartGame() {
  score = 0;
  currentWord = null;

  lyrics.forEach(line => {
    line.words.forEach(word => {
      word.solved = false;
    });
  });

  finalScore.classList.add("hidden");
  btnRestart.textContent = "▶ Hrát";
  audio.currentTime = 0;
  audio.play();
  btnRestart.classList.add("hidden");
  lyricsDiv.classList.remove("hidden");
  btns.classList.remove("hidden");
   updateLyrics();
}


// main game loop
function updateLyrics() {
  currentTime = audio.currentTime;
  lyricsDiv.innerHTML = '';

  currentWord = null;

  for (const line of lyrics) {
    if (currentTime >= line.start && currentTime <= line.end) {
      const lineDiv = document.createElement('div');

      line.words.forEach(word => {
        const span = document.createElement('span');
        span.classList.add('word-container');

        // show image only outside hard mode
        if (word.img && gamemode !== 'hard') {
          const img = document.createElement('img');
          img.src = word.img;
          span.appendChild(img);
        }

        const text = document.createElement('span');

        switch (gamemode) {

          case 'easy':
          case 'medium':
            text.textContent = word.text;
            break;

          case 'hard':
            if (word.btn) {
              if (!word.solved) {
                text.textContent = '___';

                if (currentTime >= word.start && currentTime <= word.end) {
                  currentWord = {
                    correct: word.btn,
                    element: text,
                    fullText: word.text,
                    wordRef: word,
                    start: word.start,
                    end: word.end
                  };
                }

              } else {
                text.textContent = word.text;
              }
            } else {
              text.textContent = word.text;
            }
            break;

          default:
            text.textContent = word.text;
            break;
        }

        span.appendChild(text);

        if (currentTime >= word.start && currentTime <= word.end)  span.classList.add('word-active');
        

        lineDiv.appendChild(span);
      });

      lyricsDiv.appendChild(lineDiv);
    }
  }

  if (currentWord && currentTime > currentWord.end + 1) {
    currentWord.wordRef.solved = true;
    currentWord = null;
  }
console.log(currentTime);
  if (!audio.paused) {
    animationId = requestAnimationFrame(updateLyrics);
  }
}

function btn_wrong(button) {
  button.classList.remove("btn-primary");
    button.classList.add("btn-danger");
 
  setTimeout(() => {
  button.classList.remove("btn-success", "btn-danger");
  button.classList.add("btn-primary");
  }, 300);
}

// buttons for game
function handleAnswer(choice, button) {
  if (!currentWord) {
      btn_wrong(button);
  return;
  }
const early = currentWord.start - 1;
const late = currentWord.end + 1; 

if (currentTime < early || currentTime > late) {
  console.log("Too early / too late pressed!");
  btn_wrong(button);
    return;
}

  if (choice === currentWord.correct) {
    button.classList.remove("btn-primary");
    button.classList.add("btn-success");
    currentWord.element.textContent = currentWord.fullText;
    currentWord.wordRef.solved = true;
    currentWord = null;
    score++;
    console.log("you have a point ",score);
     
    setTimeout(() => {
  button.classList.remove("btn-success", "btn-danger");
  button.classList.add("btn-primary");
  }, 300);

  } else {
      btn_wrong(button);
     console.log("Wrong answer!");
  }




}

// event listeners
btnStampf.addEventListener("click", () => handleAnswer("stampf", btnStampf));
btnKlatsch.addEventListener("click", () => handleAnswer("klatsch", btnKlatsch));






if (gamemode != 'hard') {
audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100;
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸";
if (!animationId) {
    updateLyrics();
  }

  } else {
    cancelAnimationFrame(animationId);
    animationId = null;
    audio.pause();
    playBtn.textContent = "▶";
  }
});

}



document.getElementById("volume").addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

volumeIcon.addEventListener("click", () => {
   volumeSlider.style.display =  volumeSlider.style.display === "inline-block" ? "none" : "inline-block";
});

// volume control
volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});


//for gamemode hard
audio.addEventListener("ended", () => {
  if(gamemode == 'hard') {
  lyricsDiv.classList.add("hidden");
  btnRestart.classList.remove("hidden");
  btnRestart.textContent = "Restart";
  finalScore.textContent = "Dosažené skóre " + score;
  finalScore.classList.remove("hidden");
  btns.classList.add("hidden")
  }
});

btnRestart.addEventListener("click", () => {
  if (btnRestart.textContent.includes("Play")) {
    audio.play();
    audio.currentTime = 10;

    btnRestart.classList.add("hidden");
    lyricsDiv.classList.remove("hidden");
    btns.classList.remove("hidden");

    updateLyrics();
  }
  else  restartGame();
  
});

settings.addEventListener("click", () => {
     btnmain.style.display =  btnmain.style.display === "inline-block" ? "none" : "inline-block";
    volumeIcon.style.display =  volumeIcon.style.display === "inline-block" ? "none" : "inline-block";

});