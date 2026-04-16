console.log("dance mode");
const audio = document.getElementById("song");
const lyricsDiv = document.getElementById("lyrics-div");
const progress = document.getElementById("progress");
const playBtn = document.getElementById("playBtn");
const volumeIcon = document.getElementById("volumeIcon");
const volumeSlider = document.getElementById("volume");



let animationId;
function updateLyrics() {
  const currentTime = audio.currentTime;
  lyricsDiv.innerHTML = '';

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
        text.textContent = word.text;
        span.appendChild(text);

        // karaoke highlight
        if (currentTime >= word.start && currentTime <= word.end) {
          span.classList.add('word-active');
        }

        lineDiv.appendChild(span);
      });

      lyricsDiv.appendChild(lineDiv);
    }
  }

  if (!audio.paused) {
    animationId = requestAnimationFrame(updateLyrics);
  }
}

// ▶ play / pause
playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸";
    if (!animationId) updateLyrics();
  } else {
    cancelAnimationFrame(animationId);
    animationId = null;
    audio.pause();
    playBtn.textContent = "▶";
  }
});

// progress bar
audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100;
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// volume
volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

volumeIcon.addEventListener("click", () => {
  volumeSlider.style.display =
    volumeSlider.style.display === "inline-block" ? "none" : "inline-block";
});

