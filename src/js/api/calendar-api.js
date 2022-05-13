const BASE_URL = "https://www.googleapis.com/calendar/v3";
const API_KEY = "AIzaSyByU6KIKKZFuVKZBKrrRnWe3ayiA43CDiA";

export function getCalendar(init, params = {}) {
	return fetch(
		BASE_URL + '/calendars/primary/events?key=' + API_KEY + '&'+ new URLSearchParams(params),
			{...init,
					method: 'GET',
		}
    ).then((response) => response.json())
}

export function getCalendarEvent(init, eventId, params = {}) {
	return fetch(
			BASE_URL + "/calendars/primary/events/" + eventId + "?key=" + API_KEY + '&' + new URLSearchParams(params),
			{...init,
						method: 'GET',
			}
	)
}