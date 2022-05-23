export async function startCapture(name) {
  try {
    const constraints = {video: true, audio: true};
    //stream needs audio
    navigator.mediaDevices.getDisplayMedia(constraints)
      .then(async (stream) => {
        let devices = await navigator.mediaDevices.enumerateDevices();
        console.log(devices);
        const video = document.querySelector('video');
        video.srcObject = stream;
        console.log(stream.getTracks());
        startRecording(stream, name);
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


function startRecording(stream,name) {
  let recorder = new MediaRecorder(stream);
  let data = [];

  recorder.ondataavailable = event => data.push(event.data);
  recorder.start();

  recorder.onstop = function(e) {
    const blob = new Blob(data, {type: "video/mp4"});
    const url = window.URL.createObjectURL(blob);
    const filename = name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'').concat('.mp4');
    chrome.downloads.download({
      url,
      filename,
      saveAs: true,
    });
  }
}
