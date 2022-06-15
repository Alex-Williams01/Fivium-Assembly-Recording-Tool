<template>
  <div style="background: white; padding: 5px; border-radius: 10px">
    <h1>{{ currentMeet.currentMeetTitle }}</h1>
    <div style="display: flex; flex-direction: column; width: auto">
      <div class="attendees">
        <b-form-checkbox-group
            id="checkbox-group-1"
            :options="mapAttendeesToOptions"
            v-model="tickedPeople"
            stacked
            buttons
            style="width:100%"
        />
      </div>
      <b-button variant="info" @click.prevent="$emit('refresh')" class="refresh">Refresh</b-button>
      <b-button variant="danger" id='record-button' @click.prevent="openRecordPage"><b-icon icon="camera-reels"></b-icon></b-button>
    </div>
  </div>
</template>

<script>
import { startCase } from "lodash";
import { startCapture, stopStreamedVideo } from "../js/api/capture-api";

export default {
  name: 'CalendarMeeting',
  data() {
    return {
      tickedPeople: [],
    };
  },
  props: {
    currentMeet: {type: Object, required: true}
  },
  watch: {
    tickedPeople() {
      chrome.storage.local.set({participants: this.tickedPeople}, function() {
        console.log('Value is set to ' + this.tickedPeople);
      });
    }
  },
  async mounted() {
    chrome.storage.local.get('participants', (result) => {
      if (result.participants.length > 0) {
        this.tickedPeople = result.participants;
      }
    });
  },
  computed: {
    mapAttendeesToOptions() {
      return this.currentMeet.attendees.length > 0 ? this.currentMeet.attendees.map(attendee => {
        const option = this.getAttendeeName(attendee);
        return {
          text: option,
          value: option
        };
      }).sort((a,b) => (a.text > b.text) ? 1 : ((b.text > a.text) ? -1 : 0)) : [];
    }
  },
  methods: {
    openRecordPage() {
      chrome.tabs.create({url: '/record-page.html'});
    },
    getAttendeeName(attendee) {
      return attendee.displayName || startCase(attendee.email.substring(0, attendee.email.indexOf("@")).replace(".", " "));
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.attendees {
  overflow:hidden;
  max-height:180px;
}
.attendees:hover {
  overflow-y: scroll;
}

.refresh {
  margin-top: 2px;
  margin-bottom:2px;
}

::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: none;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: lightgreen;
  border-radius: 10px;
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
