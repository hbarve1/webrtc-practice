//
// A "videopipe" abstraction on top of WebRTC.
//
// The usage of this abstraction:
// var pipe = new VideoPipe(mediastream, handlerFunction);
// handlerFunction = function(mediastream) {
//   do_something
// }
// pipe.close();
//
// The VideoPipe will set up 2 PeerConnections, connect them to each
// other, and call HandlerFunction when the stream is available in the
// second PeerConnection.
//

function errorHandler(context) {
  return function (error) {
    console.log('Failure in ' + context + ': ' + error.toString);
  };
}

// eslint-disable-next-line no-unused-vars
function successHandler(context) {
  return function () {
    console.log('Success in ' + context);
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noAction() {}

export function VideoPipe(stream, handler) {
  const servers = null;
  const pc1 = new RTCPeerConnection(servers);
  const pc2 = new RTCPeerConnection(servers);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  pc1.addStream(stream);
  pc1.onicecandidate = function (event) {
    if (event.candidate) {
      pc2.addIceCandidate(
        new RTCIceCandidate(event.candidate),
        noAction,
        errorHandler('AddIceCandidate')
      );
    }
  };
  pc2.onicecandidate = function (event) {
    if (event.candidate) {
      pc1.addIceCandidate(
        new RTCIceCandidate(event.candidate),
        noAction,
        errorHandler('AddIceCandidate')
      );
    }
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  pc2.onaddstream = function (e) {
    handler(e.stream);
  };
  pc1.createOffer(function (desc) {
    pc1.setLocalDescription(desc);
    pc2.setRemoteDescription(desc);
    pc2.createAnswer(function (desc2) {
      pc2.setLocalDescription(desc2);
      pc1.setRemoteDescription(desc2);
    }, errorHandler('pc2.createAnswer'));
  }, errorHandler('pc1.createOffer'));
  this.pc1 = pc1;
  this.pc2 = pc2;
}

VideoPipe.prototype.close = function () {
  this.pc1.close();
  this.pc2.close();
};
