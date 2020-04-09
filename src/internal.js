import utils from './utils';
/** @typedef {import('..').internal} internal */
/** @type {internal} */
const internal = { ...utils };

internal.defaults = {
	selector: '.pygmy', // dom selector string /
	offset: 100, // offset in pixels where an image should be loaded /,
	state: {
		registered: 'data-pygmy',
		loading: 'data-pygmy-loading',
		loaded: 'data-pygmy-loaded',
		fail: 'data-pygmy-failed',
	},
	attr: {
		src: 'data-src',
		srcset: 'data-srcset',
		sizes: 'data-sizes',
	},
	onLoad: true,
	dev: false,
};

internal.isRegistered = (el) =>
	el.hasAttribute(internal.config.state.registered);

internal.config = {};

internal.elements = [];

internal.loadingSupported = 'loading' in HTMLImageElement;

internal.set = function (el, state, val) {
	console.log(el, state);
	el.setAttribute(state, val || '');
	return el;
};

internal.remove = function (el, state) {
	el.removeAttribute(state);
	return el;
};

internal.getAttr = function (el, attr) {
	const attrExists = el.hasAttribute(attr);
	if (!attrExists) return utils.warn(`Attribute (${attr}) is not present`);
	const attrValue = el.getAttribute(attr);
	const attrEmpty = utils.empty(attrValue);

	if (attrEmpty)
		return utils.warn(`Attribute (${attr}) present, but has no value`);

	return attrValue;
};

export default internal;
