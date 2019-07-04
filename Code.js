audio.addEventListener('ended', (event) => {
  console.log('audio stopped either because 1) it was over, ' + 'or 2) no further data is available.');
  loadNext();
});

function loadNext() {
  audio.src = 'https://www.dropbox.com/s/r3pd176ivl80kvg/Barefoot%20Sunday%20Blues%20-%206%3A30%3A19%2C%204.06%20PM.mp3?dl=1';
  audio.play();
}

playPauseButton.addEventListener('click', function(event) {
  message.textContent("click");
});
