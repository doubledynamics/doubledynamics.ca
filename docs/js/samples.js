// Before/After players: each sample has two audio files, and switching keeps the playback position.
// The files are small, so each is downloaded whole first: that lets any web server allow jumping
// to the same position in the other version.

const audioPairs = new Map();

async function audioFromWholeFile(url) {
  const response = await fetch(url);
  const fileInMemory = URL.createObjectURL(await response.blob());
  return new Audio(fileInMemory);
}

async function downloadAudioPair(sample) {
  const [before, after] = await Promise.all([
    audioFromWholeFile(sample.dataset.before),
    audioFromWholeFile(sample.dataset.after),
  ]);
  return { before, after };
}

function audioPairOf(sample) {
  if (!audioPairs.has(sample)) audioPairs.set(sample, downloadAudioPair(sample));
  return audioPairs.get(sample);
}

async function everyAudio() {
  const pairs = await Promise.all(audioPairs.values());
  return pairs.flatMap((pair) => [pair.before, pair.after]);
}

function showPressedButton(pressedButton) {
  for (const button of document.querySelectorAll(".sample button")) {
    button.setAttribute("aria-pressed", String(button === pressedButton));
  }
}

function playbackPositionOf(pair) {
  return pair.before.paused ? pair.after.currentTime : pair.before.currentTime;
}

function startPositionFor(audio, position) {
  const reachedTheEnd = position >= audio.duration;
  return reachedTheEnd ? 0 : position;
}

function playFrom(audio, position) {
  const seekAndPlay = () => {
    audio.currentTime = startPositionFor(audio, position);
    audio.play();
  };
  const lengthIsKnown = audio.readyState >= HTMLMediaElement.HAVE_METADATA;
  if (lengthIsKnown) seekAndPlay();
  else audio.addEventListener("loadedmetadata", seekAndPlay, { once: true });
}

async function stopEverything() {
  for (const audio of await everyAudio()) audio.pause();
  showPressedButton(null);
}

async function playVersionOfButton(button) {
  const pair = await audioPairOf(button.closest(".sample"));
  const chosenAudio = pair[button.dataset.version];
  if (!chosenAudio.paused) return stopEverything();
  const position = playbackPositionOf(pair);
  await stopEverything();
  chosenAudio.onended = () => showPressedButton(null);
  playFrom(chosenAudio, position);
  showPressedButton(button);
}

for (const button of document.querySelectorAll(".sample button")) {
  button.addEventListener("click", () => playVersionOfButton(button));
}
