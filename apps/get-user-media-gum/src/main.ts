import 'webrtc-adapter';

const constraints = {
  audio: false,
  video: true,
};

// window.constraints = constraints;

function handleSuccess(stream) {
  const video = document.querySelector('video');
  const videoTracks = stream.getVideoTracks();
  console.log('Got stream with constraints:', constraints);
  console.log(`Using video device: ${videoTracks[0].label}`, videoTracks);
  // window.stream = stream; // make variable available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);

  if (error.name === 'OverconstrainedError') {
    const v = constraints.video;
    // errorMsg(
    //   `The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`
    // );
  } else if (error.name === 'NotAllowedError') {
    errorMsg(
      'Permissions have not been granted to use your camera and ' +
        'microphone, you need to allow the page access to your devices in ' +
        'order for the demo to work.'
    );
  }
  errorMsg(`getUserMedia error: ${error.name}`, error);
}

function errorMsg(msg: string, error?: string | Error | DOMException | null) {
  const errorElement = document.querySelector('#errorMsg');
  errorElement.innerHTML += `<p>${msg}</p>`;
  if (typeof error !== 'undefined') {
    console.error(error);
  }
}

async function init(e) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
    e.target.disabled = true;
  } catch (e) {
    handleError(e);
  }
}

const showVideo = document.querySelector('#showVideo');
showVideo.addEventListener('click', (e) => init(e));
