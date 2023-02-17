// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
main();

const canvas = document.querySelector('canvas');
const video = document.querySelector('video');

const stream = canvas.captureStream();
video.srcObject = stream;
