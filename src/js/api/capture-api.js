function saveRecording(data, name) {
  const blob = new Blob(data, {type: "video/mp4"});
  const url = window.URL.createObjectURL(blob);
  const filename = name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'').concat('.mp4');
  chrome.downloads.download({
    url,
    filename,
    saveAs: true,
  });
}

export function startRecording(filename, stream) {
  let recorder = new MediaRecorder(stream);
  let data = [];

  recorder.ondataavailable = event => data.push(event.data);
  recorder.onstop = () => saveRecording(data, filename);
  recorder.start();
}
