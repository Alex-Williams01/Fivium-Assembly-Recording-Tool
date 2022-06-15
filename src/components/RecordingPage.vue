<template>
  <div class="page">
    <div class="container">
      <h1>Fivium Assembly Recording Tool</h1>
      <video autoplay playsinline muted class="video" :srcObject.prop="streams.video"></video>
      <b-input-group prepend="Filename">
        <b-form-input v-model="filename"></b-form-input>
      </b-input-group>
      <div style="margin-top: 20px; margin-bottom: 20px">
        <b-form-checkbox v-model="microphoneEnabled" name="check-button" switch="switch">
          Enable / Disable Microphone
        </b-form-checkbox>
        <b-form-group v-if="microphoneEnabled" label="Microphone" label-for="microphone" label-cols-md="auto" class="mb-3">
          <b-form-select id="microphone" v-model="microphone" :options="mapToOptions"></b-form-select>
        </b-form-group>
      </div>
      <b-button variant="danger" @click.prevent="record" id='record-button'>
        <b-icon icon="record-circle" :animation="this.recording ? 'throb' : ''"></b-icon>
        {{ recording ?  'Stop' : 'Start' }} Recording
      </b-button>
    </div>
  </div>
</template>

<script>

import {startRecording} from "../js/api/capture-api.js";

export default {
  name: "RecordingPage",
  data() {
    return {
      filename: "default",
      audioDevices:[],
      microphone: "default",
      microphoneEnabled: false,
      audioContext: null,
      streams: {
        microphone: null,
        video: null,
      },
    };
  },
  mounted() {
    navigator.mediaDevices.getUserMedia({audio: true})
        .then(() => {
          navigator.mediaDevices.enumerateDevices()
              .then((devices) => {
                this.audioDevices = devices.filter(device => device.kind === "audioinput");
              });
        })
  },
  computed: {
    recording() {
      return this.streams.video !== null;
    },
    mapToOptions() {
      return this.audioDevices.map(audio => {
            return {
              text:  audio.label,
              value: audio.deviceId
            };

      });
    }
  },
  methods: {
    async record() {
      if (this.recording) {
        Object.values(this.streams).forEach(
            stream => {if (stream) stream.getTracks().forEach(track => track.stop());}
        );
        this.streams.video = null;
        this.streams.audio = null;
        this.audioContext.close();
      } else {
        await this.startCapture();
      }
    },
    async startCapture() {
      try {
        this.audioContext = new AudioContext();

        let combinedAudioContext;
        if (this.microphoneEnabled) {
          this.streams.microphone = await navigator.mediaDevices.getUserMedia({audio:{deviceId:{exact: this.microphone}}});
          const microphoneMediaStreamSource = this.audioContext.createMediaStreamSource(this.streams.microphone);
          combinedAudioContext = this.audioContext.createMediaStreamDestination();
          microphoneMediaStreamSource.connect(combinedAudioContext);
        }

        const constraints = {video: {
            width: { ideal: 1920, max: 1920 },
            height: { ideal: 1080, max: 1080 },
            framerate: 30,
          }, audio: true};

        navigator.mediaDevices.getDisplayMedia(constraints)
            .then(async (stream) => {
              if(this.microphoneEnabled) {
                if (stream.getAudioTracks().length > 0) {
                  const desktopMediaStreamSource = this.audioContext.createMediaStreamSource(stream);
                  desktopMediaStreamSource.connect(combinedAudioContext);
                  stream.removeTrack(stream.getAudioTracks()[0]);
                }
                stream.addTrack(combinedAudioContext.stream.getAudioTracks()[0]);
              }
              this.streams.video = stream;
              startRecording(this.filename, this.streams.video);
            });
      } catch(err) {
        console.error("Error: " + err);
      }
    },
  }
}
</script>

<style scoped>
.page {
  background: #42b983;
  height: 100%;
  display: flex;
  text-align: center;
  flex-direction: column;
}
.container {
  margin-top: 20px;
  margin-bottom: 20px;
  padding-bottom: 5px;
  background: white;
  display: flex;
  flex-direction: column;
  width:50%;
}
.video {
  background: black;
}
</style>