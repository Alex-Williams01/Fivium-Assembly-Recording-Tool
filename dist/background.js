try {
  const constraints = {video: true, audio: true};
  //stream needs audio
  navigator.mediaDevices.getDisplayMedia(constraints)
    .then(async (stream) => {
      let recorder = new MediaRecorder(stream);
      let data = [];

      recorder.ondataavailable = event => data.push(event.data);
      recorder.start();

      recorder.onstop = function(e) {
        const blob = new Blob(data, {type: "video/mp4"});
        const url = window.URL.createObjectURL(blob);
        const name = "hello";
        const filename = name.replace(/[&\\/\\\\#,+()$~%.'":*?<>{}]/g,'').concat('.mp4');
        chrome.downloads.download({
          url,
          filename,
          saveAs: true,
        });
    }
  });
} catch(err) {
  console.error("Error: " + err);
}
