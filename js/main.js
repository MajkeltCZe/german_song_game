console.log("funguje");

let audio =  document.getElementById("song")
let  currentTime = audio.currentTime;
const lyricsDiv = document.getElementById("lyrics-div");




audio.addEventListener("play", () => {
  if (!animationId) {
    updateLyrics();
  }
});

audio.addEventListener("pause", () => {
  cancelAnimationFrame(animationId);
  animationId = null;
});


let animationId = null;
function updateLyrics() {
  const currentTime = audio.currentTime;
  const activeSubtitle = lyrics.find(lyr => currentTime >= lyr.start && currentTime <= lyr.end);
  lyricsDiv.innerHTML = activeSubtitle ? activeSubtitle.text : '';

  if (!audio.paused) {
    animationId = requestAnimationFrame(updateLyrics);
  }
}





