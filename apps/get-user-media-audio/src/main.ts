import 'webrtc-adapter';

const audio = document.querySelector('audio');

const constraints = {
  audio: true,
  video: false,
};

function handleSuccess(stream) {
  const audioTracks = stream.getAudioTracks();
  console.log('Got stream with constraints:', constraints);
  console.log('Using audio device: ' + audioTracks[0].label);
  stream.oninactive = function () {
    console.log('Stream ended');
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.stream = stream; // make variable available to browser console
  audio.srcObject = stream;
}

function handleError(error) {
  const errorMessage =
    'navigator.MediaDevices.getUserMedia error: ' +
    error.message +
    ' ' +
    error.name;

  document.getElementById('errorMsg').innerText = errorMessage;
  console.log(errorMessage);
}

navigator.mediaDevices
  .getUserMedia(constraints)
  .then(handleSuccess)
  .catch(handleError);
