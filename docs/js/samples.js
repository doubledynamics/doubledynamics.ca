// Before/After players: each sample has two audio files, and switching keeps the playback position.
// The files are small, so each is downloaded whole when the page opens: that lets any web server
// allow jumping to the same position in the other version, and a click can start playing at once.

const SECONDS_NEAR_THE_END = 0.25;

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

function everySample() {
  return [...document.querySelectorAll(".sample")];
}

const audioPairs = new Map(everySample().map((sample) => [sample, downloadAudioPair(sample)]));

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

function isAtOrNearTheEnd(audio, position) {
  return position >= audio.duration - SECONDS_NEAR_THE_END;
}

function rewindPair(pair) {
  pair.before.currentTime = 0;
  pair.after.currentTime = 0;
}

function playFrom(audio, position) {
  audio.currentTime = isAtOrNearTheEnd(audio, position) ? 0 : position;
  audio.play();
}

async function stopEverything() {
  for (const audio of await everyAudio()) audio.pause();
  showPressedButton(null);
}

async function playVersionOfButton(button) {
  const pair = await audioPairs.get(button.closest(".sample"));
  const chosenAudio = pair[button.dataset.version];
  if (!chosenAudio.paused) return stopEverything();
  const position = playbackPositionOf(pair);
  await stopEverything();
  chosenAudio.onended = () => {
    rewindPair(pair);
    showPressedButton(null);
  };
  playFrom(chosenAudio, position);
  showPressedButton(button);
}

for (const button of document.querySelectorAll(".sample button")) {
  button.addEventListener("click", () => playVersionOfButton(button));
}
