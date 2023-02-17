import 'webrtc-adapter';
import { VideoPipe } from './videoPipe';

const video1 = document.querySelector('video#video1') as HTMLVideoElement;
const video2 = document.querySelector('video#video2') as HTMLVideoElement;

const statusDiv = document.querySelector('div#status') as HTMLDivElement;

const audioCheckbox = document.querySelector('input#audio') as HTMLInputElement;

const startButton = document.querySelector('button#start') as HTMLButtonElement;
const callButton = document.querySelector('button#call') as HTMLButtonElement;
const insertRelayButton = document.querySelector(
  'button#insertRelay'
) as HTMLButtonElement;
const hangupButton = document.querySelector(
  'button#hangup'
) as HTMLButtonElement;

startButton.onclick = start;
callButton.onclick = call;
insertRelayButton.onclick = insertRelay;
hangupButton.onclick = hangup;

const pipes = [];

let localStream;
let remoteStream;

function gotStream(stream) {
  console.log('Received local stream');
  video1.srcObject = stream;
  localStream = stream;
  callButton.disabled = false;
}

function gotremoteStream(stream) {
  remoteStream = stream;
  video2.srcObject = stream;
  console.log('Received remote stream');
  console.log(`${pipes.length} element(s) in chain`);
  statusDiv.textContent = `${pipes.length} element(s) in chain`;
  insertRelayButton.disabled = false;
}

function start() {
  console.log('Requesting local stream');
  startButton.disabled = true;
  const options = audioCheckbox.checked
    ? { audio: true, video: true }
    : { audio: false, video: true };
  navigator.mediaDevices
    .getUserMedia(options)
    .then(gotStream)
    .catch(function (e) {
      alert('getUserMedia() failed');
      console.log('getUserMedia() error: ', e);
    });
}

function call() {
  callButton.disabled = true;
  insertRelayButton.disabled = false;
  hangupButton.disabled = false;
  console.log('Starting call');
  pipes.push(new VideoPipe(localStream, gotremoteStream));
}

function insertRelay() {
  pipes.push(new VideoPipe(remoteStream, gotremoteStream));
  insertRelayButton.disabled = true;
}

function hangup() {
  console.log('Ending call');
  while (pipes.length > 0) {
    const pipe = pipes.pop();
    pipe.close();
  }
  insertRelayButton.disabled = true;
  hangupButton.disabled = true;
  callButton.disabled = false;
}
