export async function startCapture() {
  let captureStream = null;
  try {
    const constraints = {video: true, audio: true};
    captureStream = navigator.mediaDevices.getDisplayMedia(constraints)
      .then((stream) => {
        const video = document.querySelector('video');
        video.srcObject = stream;
        return stream;
      });
  } catch(err) {
    console.error("Error: " + err);
  }
}

export function stopStreamedVideo(videoElem) {
  const stream = videoElem.srcObject;
  const tracks = stream.getTracks();

  tracks.forEach(function(track) {
    track.stop();
  });

  videoElem.srcObject = null;
}
