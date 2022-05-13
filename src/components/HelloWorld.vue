<template>
  <div class="container">
    <b-avatar></b-avatar>
    <b-badge variant="light">BETA</b-badge>
    <h1>{{ currentMeetTitle }}</h1>
    <div style="display: flex; flex-direction: column; width: auto">
        <b-form-checkbox-group
            id="checkbox-group-1"
            :options="mapAttendeesToOptions"
            stacked
            buttons
        />
      <b-button variant="info" @click.prevent="getCurrentMeet" class="refresh">Refresh</b-button>
      <video autoplay playsinline muted style="background: black; height: 25%"></video>
      <b-button variant="danger" id='record-button' @click.prevent="record"><b-icon icon="record-circle" :animation="this.recording ? 'throb' : ''"></b-icon></b-button>
    </div>
  </div>
</template>

<script>
import {withOAuth} from "../js/oauth";
import {getCalendar} from "../js/api/calendar-api";
import { startCase } from "lodash";
import { startCapture, stopStreamedVideo } from "../js/api/capture-api";

export default {
  name: 'HelloWorld',
  data() {
    return {
      currentStream: {},
      recording: false,
      attendees: [],
      currentMeetTitle: "",
    };
  },
  props: {
    msg: String
  },
  async mounted() {
    await this.getCurrentMeet();
  },
  computed: {
    mapAttendeesToOptions() {
      return this.attendees.length > 0 ? this.attendees.map(attendee => {
        const option = this.getAttendeeName(attendee);
        return {
          text: option,
          value: option
        };
      }) : [];
    }
  },
  methods: {
    startCapture,
    record() {
      this.recording = !this.recording;
      if (this.recording) {
        this.currentStream = startCapture();
      } else {
        stopStreamedVideo(document.querySelector('video'));
      }
    },
    getAttendeeName(attendee) {
      console.log(attendee);
      return attendee.displayName || startCase(attendee.email.substring(0, attendee.email.indexOf("@")).replace(".", " "));
    },
    async getCurrentMeet() {
      withOAuth((init) => {
        const timeMax = new Date().toISOString();
        const minTime = new Date();
        minTime.setUTCHours(0, 0, 0, 0);
        const timeMin = minTime.toISOString();
        chrome.tabs.query({active: true}, tabs => {
          const q = tabs[0].url;
          getCalendar(init, {timeMin, timeMax}).then((calendar) => {
            if (calendar.items.length > 0)  {
              console.log(calendar.items[calendar.items.length - 1].attendees);
              this.currentMeetTitle = calendar.items[calendar.items.length - 1].summary;
              this.attendees = calendar.items[calendar.items.length - 1].attendees.filter(person => person.responseStatus === 'accepted' && !person.self);
              console.log(q);
            }
          });
        });
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.container {
  background: #42b983;
  width: 400px;
  height: auto;
  text-align: center;
  overflow: hidden;
  padding-bottom: 10px;
}

.refresh {
  margin-bottom:20px;
  margin-top: 20px;
}
</style>
<style>
#checkbox-group-1 label {
  background-color: white;
  color: black;
}
#checkbox-group-1 .active {
  background-color: green;
  border-color: white;
  color: white;
}
#checkbox-group-1 input {
  display: none !important;
}
</style>
