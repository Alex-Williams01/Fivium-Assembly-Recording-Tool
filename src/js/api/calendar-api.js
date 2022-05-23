const BASE_URL = "https://www.googleapis.com/calendar/v3";
const API_KEY = "AIzaSyByU6KIKKZFuVKZBKrrRnWe3ayiA43CDiA";

export function getCalendar(init, params = {}) {
	const urlParams = new URLSearchParams(params);
	urlParams.set("singleEvents", "true");
	return fetch(
		`${BASE_URL}/calendars/primary/events?key=${API_KEY}&${urlParams}`,
			{...init,
					method: 'GET',
		}
    ).then((response) => response.json())
}