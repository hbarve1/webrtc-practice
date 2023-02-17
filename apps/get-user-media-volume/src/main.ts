import 'webrtc-adapter';
import { SoundMeter } from './soundmeter';

const startButton = document.getElementById('startButton') as HTMLButtonElement;
const stopButton = document.getElementById('stopButton') as HTMLButtonElement;
startButton.onclick = start;
stopButton.onclick = stop;

const instantMeter = document.querySelector(
  '#instant meter'
) as HTMLMeterElement;
const slowMeter = document.querySelector('#slow meter') as HTMLMeterElement;
const clipMeter = document.querySelector('#clip meter') as HTMLMeterElement;

const instantValueDisplay = document.querySelector(
  '#instant .value'
) as HTMLDivElement;
const slowValueDisplay = document.querySelector(
  '#slow .value'
) as HTMLDivElement;
const clipValueDisplay = document.querySelector(
  '#clip .value'
) as HTMLDivElement;

// Put variables in global scope to make them available to the browser console.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const constraints = (window.constraints = {
  audio: true,
  video: false,
});

let meterRefresh = null;

function handleSuccess(stream) {
  // Put variables in global scope to make them available to the
  // browser console.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.stream = stream;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const soundMeter = (window.soundMeter = new SoundMeter(window.audioContext));
  soundMeter.connectToSource(stream, function (e) {
    if (e) {
      alert(e);
      return;
    }
    meterRefresh = setInterval(() => {
      instantMeter.value = instantValueDisplay.innerText =
        soundMeter.instant.toFixed(2);
      slowMeter.value = slowValueDisplay.innerText = soundMeter.slow.toFixed(2);
      clipMeter.value = clipValueDisplay.innerText = soundMeter.clip;
    }, 200);
  });
}

function handleError(error) {
  console.log(
    'navigator.MediaDevices.getUserMedia error: ',
    error.message,
    error.name
  );
}

function start() {
  console.log('Requesting local stream');
  startButton.disabled = true;
  stopButton.disabled = false;

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.audioContext = new AudioContext();
  } catch (e) {
    alert('Web Audio API not supported.');
  }

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(handleSuccess)
    .catch(handleError);
}

function stop() {
  console.log('Stopping local stream');
  startButton.disabled = false;
  stopButton.disabled = true;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.stream.getTracks().forEach((track) => track.stop());
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.soundMeter.stop();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.audioContext.close();
  clearInterval(meterRefresh);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  instantMeter.value = instantValueDisplay.innerText = '';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  slowMeter.value = slowValueDisplay.innerText = '';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  clipMeter.value = clipValueDisplay.innerText = '';
}
