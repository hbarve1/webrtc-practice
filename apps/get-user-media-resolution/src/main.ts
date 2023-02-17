import 'webrtc-adapter';

const dimensions = document.querySelector('#dimensions') as HTMLDivElement;
const video = document.querySelector('video') as HTMLVideoElement;
let stream;

const vgaButton = document.querySelector('#vga') as HTMLButtonElement;
const qvgaButton = document.querySelector('#qvga') as HTMLButtonElement;
const hdButton = document.querySelector('#hd') as HTMLButtonElement;
const fullHdButton = document.querySelector('#full-hd') as HTMLButtonElement;
const cinemaFourKButton = document.querySelector(
  '#cinemaFourK'
) as HTMLButtonElement;
const televisionFourKButton = document.querySelector(
  '#televisionFourK'
) as HTMLButtonElement;
const eightKButton = document.querySelector('#eightK') as HTMLButtonElement;

const videoblock = document.querySelector('#videoblock') as HTMLDivElement;
const messagebox = document.querySelector('#errormessage') as HTMLDivElement;

const widthInput = document.querySelector(
  'div#width input'
) as HTMLInputElement;
const widthOutput = document.querySelector('div#width span') as HTMLSpanElement;
const aspectLock = document.querySelector('#aspectlock') as HTMLInputElement;
const sizeLock = document.querySelector('#sizelock') as HTMLInputElement;

let currentWidth = 0;
let currentHeight = 0;

vgaButton.onclick = () => {
  getMedia(vgaConstraints);
};

qvgaButton.onclick = () => {
  getMedia(qvgaConstraints);
};

hdButton.onclick = () => {
  getMedia(hdConstraints);
};

fullHdButton.onclick = () => {
  getMedia(fullHdConstraints);
};

televisionFourKButton.onclick = () => {
  getMedia(televisionFourKConstraints);
};

cinemaFourKButton.onclick = () => {
  getMedia(cinemaFourKConstraints);
};

eightKButton.onclick = () => {
  getMedia(eightKConstraints);
};

const qvgaConstraints = {
  video: { width: { exact: 320 }, height: { exact: 240 } },
};

const vgaConstraints = {
  video: { width: { exact: 640 }, height: { exact: 480 } },
};

const hdConstraints = {
  video: { width: { exact: 1280 }, height: { exact: 720 } },
};

const fullHdConstraints = {
  video: { width: { exact: 1920 }, height: { exact: 1080 } },
};

const televisionFourKConstraints = {
  video: { width: { exact: 3840 }, height: { exact: 2160 } },
};

const cinemaFourKConstraints = {
  video: { width: { exact: 4096 }, height: { exact: 2160 } },
};

const eightKConstraints = {
  video: { width: { exact: 7680 }, height: { exact: 4320 } },
};
function gotStream(mediaStream: MediaStream) {
  // stream = window.stream = mediaStream; // stream available to console
  stream = mediaStream; // stream available to console
  video.srcObject = mediaStream;
  messagebox.style.display = 'none';
  videoblock.style.display = 'block';
  const track = mediaStream.getVideoTracks()[0];
  const constraints = track.getConstraints();

  console.log('Result constraints: ', constraints);
  const width = constraints.width as ConstrainULongRange;

  if (width.exact) {
    widthInput.value = String(width.exact);
    widthOutput.textContent = String(width.exact);
  } else if (width.min) {
    widthInput.value = String(width.min);
    widthOutput.textContent = String(width.min);
  }
}

function errorMessage(who, what) {
  const message = who + ': ' + what;
  messagebox.innerText = message;
  messagebox.style.display = 'block';
  console.log(message);
}

function clearErrorMessage() {
  messagebox.style.display = 'none';
}

function displayVideoDimensions(whereSeen) {
  if (video.videoWidth) {
    dimensions.innerText =
      'Actual video dimensions: ' +
      video.videoWidth +
      'x' +
      video.videoHeight +
      'px.';
    if (
      currentWidth !== video.videoWidth ||
      currentHeight !== video.videoHeight
    ) {
      console.log(whereSeen + ': ' + dimensions.innerText);
      currentWidth = video.videoWidth;
      currentHeight = video.videoHeight;
    }
  } else {
    dimensions.innerText = 'Video not ready';
  }
}

video.onloadedmetadata = () => {
  displayVideoDimensions('loadedmetadata');
};

video.onresize = () => {
  displayVideoDimensions('resize');
};

function constraintChange(e) {
  widthOutput.textContent = e.target.value;
  const track = stream.getVideoTracks()[0];
  let constraints;
  if (aspectLock.checked) {
    constraints = {
      width: { exact: e.target.value },
      aspectRatio: {
        exact: video.videoWidth / video.videoHeight,
      },
    };
  } else {
    constraints = { width: { exact: e.target.value } };
  }
  clearErrorMessage();
  console.log('applying ' + JSON.stringify(constraints));
  track
    .applyConstraints(constraints)
    .then(() => {
      console.log('applyConstraint success');
      displayVideoDimensions('applyConstraints');
    })
    .catch((err) => {
      errorMessage('applyConstraints', err.name);
    });
}

widthInput.onchange = constraintChange;

sizeLock.onchange = () => {
  if (sizeLock.checked) {
    console.log('Setting fixed size');
    video.style.width = '100%';
  } else {
    console.log('Setting auto size');
    video.style.width = 'auto';
  }
};

function getMedia(constraints) {
  if (stream) {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  clearErrorMessage();
  videoblock.style.display = 'none';
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(gotStream)
    .catch((e) => {
      errorMessage('getUserMedia', e.message);
    });
}
