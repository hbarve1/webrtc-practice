interface HTMLMediaElementWithCaptureStream extends HTMLMediaElement {
  captureStream(frameRate?: number): MediaStream | null;
  mozCaptureStream(frameRate?: number): MediaStream | null;
}

const leftVideo = document.getElementById(
  'leftVideo'
) as HTMLMediaElementWithCaptureStream;
const rightVideo = document.getElementById(
  'rightVideo'
) as HTMLMediaElementWithCaptureStream;

leftVideo.addEventListener('canplay', () => {
  let stream;
  const fps = 0;
  if (leftVideo.captureStream) {
    stream = leftVideo.captureStream(fps);
  } else if (leftVideo.mozCaptureStream) {
    stream = leftVideo.mozCaptureStream(fps);
  } else {
    console.error('Stream capture is not supported');
    stream = null;
  }
  rightVideo.srcObject = stream;
});
