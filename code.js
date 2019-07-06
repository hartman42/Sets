audio.addEventListener('ended', (event) => {
  console.log('audio stopped either because 1) it was over, ' + 'or 2) no further data is available.');
  loadNext();
});

function loadNext() {
  audio.src = './audio/Take Ten.mp3';
  audio.play();
}

