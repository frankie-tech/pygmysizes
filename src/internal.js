import utils from './utils';
/** @typedef {import('..').internal} internal */
/** @type {internal} */
const internal = { ...utils };

internal.config = {
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

internal.intersecting = new Event('pygmy::intersecting', {
	detail: {
		time: new Date(),
	},
});

internal.isRegistered = (el) =>
	el.hasAttribute(internal.config.state.registered);

internal.elements = [];

internal.loadingSupported = 'loading' in HTMLImageElement;

internal.set = function (el, state, val) {
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

internal.merge = function (target) {
	function obj(target, source) {
		Object.keys(source).forEach(function (key) {
			target[key] = values(target[key], source[key]);
		});
		return target;
	}
	function arr(target, source) {
		source.forEach(function (item, index) {
			target[index] = values(target[index], item);
		});
		return target;
	}
	/* Blame closure compiler */
	function values(target, source) {
		return '[object Object]' === Object.prototype.toString.call(target) &&
			'[object Object]' === Object.prototype.toString.call(source)
			? obj(target, source)
			: '[object Array]' === Object.prototype.toString.call(target) &&
			  '[object Array]' === Object.prototype.toString.call(source)
			? arr(target, source)
			: void 0 === source
			? target
			: source;
	}

	for (var sources = [], index = 1; index < arguments.length; ++index) {
		sources[index - 1] = arguments[index];
	}
	sources.forEach(function (argument) {
		return values(target, argument);
	});
	return target;
};

export default internal;
