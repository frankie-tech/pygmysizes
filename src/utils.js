const utils = {};

utils.id = () => `_${Math.random().toString(36).substr(2, 9)}`;
/**
 * @param {string} msg
 * @param {boolean} [warn]
 * @returns {false}
 */
utils.warn = (msg, warn) => {
	warn && console.warn(msg);
	return false;
};
/* https://locutus.io/php/var/empty/ */
/**
 * @param {string|boolean|number|object} test
 * @return {boolean}
 */
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
/**
 * @param {HTMLElement} el
 * @param {string} type
 * @param {object} detail
 * @return {HTMLElement} el
 */
utils.emit = (el, type, detail) => {
	const e = new CustomEvent(type, {
		bubbles: true,
		detail: detail || { time: new Date() },
	});
	el.dispatchEvent(e);
	return el;
};

export default utils;
