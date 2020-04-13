/** based loosely on https://css-tricks.com/build-a-state-management-system-with-vanilla-javascript/ */

var pubsub;

!(function pubsub() {
	const events = [];

	const inner = {};

	inner.sub = function (event, cb) {
		if (!events.hasOwnProperty(event)) {
			events[event] = event;
		}

		return events[event].push(cb);
	};

	inner.pub = function (event, data = {}) {
		if (!events.hasOwnProperty(event)) {
			return [];
		}

		return events[event].map((cb) => callback(data));
	};

	pubsub = inner;

	return pubsub;
})();

export default pubsub;
