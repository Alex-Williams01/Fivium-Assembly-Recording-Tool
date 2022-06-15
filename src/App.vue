<template>
  <div class="container">
    <b-avatar></b-avatar>
    <b-badge variant="light">BETA</b-badge>
    <calendar-meeting v-if="!isEmpty(currentMeet)" :current-meet="currentMeet" @refresh="getCurrentMeet" />
    <div v-else style="background: white; padding:10px">
      <b-alert show>No meeting found</b-alert>
      <b-button variant="info" @click.prevent="getCurrentMeet" class="refresh">Refresh</b-button>
    </div>
  </div>
</template>

<script>
import CalendarMeeting from './components/CalendarMeeting.vue'
import {withOAuth} from "./js/oauth";
import {isEmpty} from "lodash";
import moment from "moment";
import {getCalendar} from "./js/api/calendar-api";

export default {
  name: 'App',
  components: {
    CalendarMeeting
  },
  data() {
    return {
      currentMeet: {},
    }
  },
  async mounted() {
    await this.getCurrentMeet();
  },
  methods: {
    isEmpty,
    async getCurrentMeet() {
      withOAuth((init) => {
        const maxTime = new moment();
        const minTime =  new moment().startOf('day');
        const timeMin = minTime.format();
        const timeMax = maxTime.format();
          getCalendar(init, {timeMin, timeMax}).then((calendar) => {
            if (calendar.items.length === 0) {
              return this.currentMeet = {};
            }
            const lastEvent = calendar.items.find(meeting => new moment(meeting.end.dateTime).isAfter(maxTime));
            if (!lastEvent) {
              return this.currentMeet = {};
            }
            this.currentMeet = {
              currentMeetTitle: lastEvent.summary,
              attendees: lastEvent.attendees ?
                  lastEvent.attendees.filter(person => person.responseStatus === 'accepted' && !person.self) :
                Array(50).fill({ displayName: "Alex Williams"}),
            }
          });
        });
    }
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.container {
  background: #42b983;
  width: 400px;
  height: auto;
  text-align: center;
  overflow: hidden;
  padding-bottom: 10px;
}
</style>
