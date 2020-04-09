/** @typedef {import('..').utils} utils */
/** @type {utils} */
const utils = {};

utils.id = () => `_${Math.random().toString(36).substr(2, 9)}`;

utils.warn = (msg, warn) => {
	warn && console.warn(msg);
	return false;
};

/* https://locutus.io/php/var/empty/ */
utils.empty = (test) => {
	const isAnEmptyValue = [undefined, null, false, 0, '', '0'].includes(test);

	if (isAnEmptyValue) return true;
	if (test.pop) return test.length === 0 ? true : false;
	if (test instanceof Object) {
		// @ts-ignore
		return Object.entries(test).length === 0 ? true : false;
	}

	return false;
};

utils.emit = (el, type, detail) => {
	const e = new CustomEvent(type, {
		bubbles: true,
		detail: detail || { time: new Date() },
	});
	el.dispatchEvent(e);
	return el;
};

utils.inView = (el) => {
	console.log(el, el.intersectionRatio);
};

export default utils;
