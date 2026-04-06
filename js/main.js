console.log("funguje");

const audio =  document.getElementById("song")
const lyricsDiv = document.getElementById("lyrics-div");
const progress = document.getElementById("progress");
const playBtn = document.getElementById("playBtn");
const volumeIcon = document.getElementById("volumeIcon");
const volumeSlider = document.getElementById("volume");
const btnStampf = document.getElementById("stampf");
const btnKlatsch = document.getElementById("klatsch");
const btnRestart = document.getElementById("restart");


let currentTime;
let currentWord = null;
let animationId;
let gamemode = 'hard';
let score = 0;



// main game loop
function updateLyrics() {
  const currentTime = audio.currentTime;
  lyricsDiv.innerHTML = 'SSSS';

  for (const line of lyrics) {
    if (currentTime >= line.start && currentTime <= line.end) {
      const lineDiv = document.createElement('div');

      line.words.forEach(word => {
        const span = document.createElement('span');
        span.classList.add('word-container');

        if (word.img && gamemode !== 'hard') {
          const img = document.createElement('img');
          img.src = word.img;
          span.appendChild(img);
        }

        const text = document.createElement('span');

        switch (gamemode) {

          case 'easy':
          case 'medium':
            // for now just show everything
            text.textContent = word.text;
            break;

          case 'hard':
            if (word.btn) {
              if (!word.solved) {
                text.textContent = '___';

                if (!currentWord) {
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
            // normal dancing mode
            text.textContent = word.text;
            break;
        }

        span.appendChild(text);

        if (currentTime >= word.start && currentTime <= word.end) span.classList.add('word-active');

        lineDiv.appendChild(span);
      });

      lyricsDiv.appendChild(lineDiv);
    }
  }

   if(audio.ended || currentTime == 128) {
console.log("end");
  lyricsDiv.innerText = 'Získané skóre: ' + score;
  btnRestart.style.display = 'block';
}

  if (!audio.paused) animationId = requestAnimationFrame(updateLyrics);
 

}

// buttons for game
function handleAnswer(choice, button) {
  if (!currentWord) return;
const early = currentWord.start - 0.5;
const late = currentWord.end + 0.5; 

if (currentTime < early || currentTime > late) {
  console.log("Too early / too late pressed!");
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

  } else {
    button.classList.remove("btn-primary");
    button.classList.add("btn-danger");
     console.log("Wrong answer!");
  }

  // reset button colors
  setTimeout(() => {
    btnStampf.className = "btn btn-primary";
    btnKlatsch.className = "btn btn-primary";
  }, 250);
}

// event listeners
btnStampf.addEventListener("click", () => handleAnswer("stampf", btnStampf));
btnKlatsch.addEventListener("click", () => handleAnswer("klatsch", btnKlatsch));



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
audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100;
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

document.getElementById("volume").addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

volumeIcon.addEventListener("click", () => {
  volumeSlider.style.display =
    volumeSlider.style.display === "inline-block" ? "none" : "inline-block";
});

// volume control
volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

//restart button
btnRestart.addEventListener("click", () => {
  audio.currentTime = 0;
  audio.play();

  score = 0;

  lyrics.forEach(line => {
    line.words.forEach(word => {
      word.solved = false;
    });
  });

  currentWord = null;
});