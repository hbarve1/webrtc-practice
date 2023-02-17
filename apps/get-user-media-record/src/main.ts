import 'webrtc-adapter';

let mediaRecorder;
let recordedBlobs;

const codecPreferences = document.querySelector(
  '#codecPreferences'
) as HTMLSelectElement;

const errorMsgElement = document.querySelector(
  'span#errorMsg'
) as HTMLSpanElement;
const recordedVideo = document.querySelector(
  'video#recorded'
) as HTMLVideoElement;
const recordButton = document.querySelector(
  'button#record'
) as HTMLButtonElement;
const playButton = document.querySelector('button#play') as HTMLButtonElement;
const downloadButton = document.querySelector(
  'button#download'
) as HTMLButtonElement;
const startButton = document.querySelector('button#start') as HTMLButtonElement;
const echoCancellation = document.querySelector(
  '#echoCancellation'
) as HTMLInputElement;

function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function getSupportedMimeTypes() {
  const possibleTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=h264,opus',
    'video/mp4;codecs=h264,aac',
  ];
  return possibleTypes.filter((mimeType) => {
    return MediaRecorder.isTypeSupported(mimeType);
  });
}

function startRecording() {
  recordedBlobs = [];
  const mimeType =
    codecPreferences.options[codecPreferences.selectedIndex].value;
  const options = { mimeType };

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(
      e
    )}`;
    return;
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  recordButton.textContent = 'Stop Recording';
  playButton.disabled = true;
  downloadButton.disabled = true;
  codecPreferences.disabled = true;
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.stream = stream;

  const gumVideo = document.querySelector('video#gum');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  gumVideo.srcObject = stream;

  getSupportedMimeTypes().forEach((mimeType) => {
    const option = document.createElement('option');
    option.value = mimeType;
    option.innerText = option.value;
    codecPreferences.appendChild(option);
  });
  codecPreferences.disabled = false;
}

async function init(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    console.error('navigator.getUserMedia error:', e);
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

recordButton.addEventListener('click', () => {
  if (recordButton.textContent === 'Start Recording') {
    startRecording();
  } else {
    stopRecording();
    recordButton.textContent = 'Start Recording';
    playButton.disabled = false;
    downloadButton.disabled = false;
    codecPreferences.disabled = false;
  }
});

playButton.addEventListener('click', () => {
  const mimeType = codecPreferences.options[
    codecPreferences.selectedIndex
  ].value.split(';', 1)[0];
  const superBuffer = new Blob(recordedBlobs, { type: mimeType });
  recordedVideo.src = null;
  recordedVideo.srcObject = null;
  recordedVideo.src = window.URL.createObjectURL(superBuffer);
  recordedVideo.controls = true;
  recordedVideo.play();
});

downloadButton.addEventListener('click', () => {
  const blob = new Blob(recordedBlobs, { type: 'video/webm' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
});

startButton.addEventListener('click', async () => {
  startButton.disabled = true;
  const hasEchoCancellation = echoCancellation.checked;
  const constraints = {
    audio: {
      echoCancellation: { exact: hasEchoCancellation },
    },
    video: {
      width: 1280,
      height: 720,
    },
  };
  console.log('Using media constraints:', constraints);
  await init(constraints);
});
