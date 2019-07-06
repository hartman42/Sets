audio.addEventListener('ended', (event) => {
  console.log('audio stopped either because 1) it was over, ' + 'or 2) no further data is available.');
  loadNext();
});

function loadNext() {
  audio.src = 'https://www.dropbox.com/s/k8ilpk9kthszu4p/Take%20Ten.mp3?raw=1';
  audio.play();
}

