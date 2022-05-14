<template>
  <div class="container">
    <b-avatar></b-avatar>
    <b-badge variant="light">BETA</b-badge>
    <calendar-meeting v-if="!isEmpty(currentMeet)" :current-meet="currentMeet" />
    <b-alert v-else show>No meeting found</b-alert>
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
        const maxTime = new moment(new Date('May 17, 2022 13:24:00'));
        const minTime = new moment().startOf('day');
        const timeMin = minTime.format();
        const timeMax = maxTime.format();
          getCalendar(init, {timeMin, timeMax}).then((calendar) => {
            if (calendar.items.length === 0) {
              return this.currentMeet = {};
            }
            const lastEvent = calendar.items[calendar.items.length - 1];
            if (new moment(lastEvent.end.dateTime).isBefore(maxTime)) {
              return this.currentMeet = {};
            }
            const attendees = calendar.items[calendar.items.length - 1].attendees;
            this.currentMeet = {
              currentMeetTitle: lastEvent.summary,
              attendees: attendees ?
                  attendees.filter(person => person.responseStatus === 'accepted' && !person.self) :
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
