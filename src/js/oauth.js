export function withOAuth(callback) {
	return chrome.identity.getAuthToken({interactive: true}, function(token) {
      callback({
        async: true,
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        'contentType': 'json'
      });
	});
}