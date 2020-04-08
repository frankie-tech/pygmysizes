// @ts-check

/**
 * @typedef {object} pygmyCfg - options for pygmysizes
 * @property {string} selector = '.pygmy'
 * @property {number} offset
 * @property {pygmyStates} state
 * @property {pygmyAttributes} attr
 * @property {boolean} initOnLoad
 */
/**
 * @typedef {object} pygmyStates
 * @property {string} registered
 * @property {string} loading
 * @property {string} loaded
 * @property {string} fail
 */
/**
 * @typedef {object} pygmyAttributes
 * @property {string} src
 * @property {string} srcset
 */
/**
 * @typedef {object} pygmyOn
 * @property {pygmyCallback} loaded
 */

/**
 * @typedef {function} pygmyCallback
 * @param {HTMLImageElement} el
 * @param {string} state
 */
var pygmysizes;
!(function () {
	'use strict';
	const _ = {};

	/** @type {object} */
	_.defaults = Object.freeze({
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
		},
		initOnLoad: true,
		on: {
			loaded: () => {},
		},
	});

	/** @type {pygmyCfg} */
	_.config = window['pygmyCfg'] = Object.assign(
		{},
		_.defaults,
		window['pygmyCfg']
	);

	/** @type {Array.<HTMLImageElement>} */
	_.elements = [];

	/** @type {boolean} */
	_.loadingSupported = 'loading' in HTMLImageElement;

	/** @type {IntersectionObserver} */
	_.observer;

	/** @param {IntersectionObserverEntry} el */
	_.inView = function (el) {
		console.log(el, el.intersectionRatio);
	};
	/* https://locutus.io/php/var/empty/ */
	/**
	 * @param {string|boolean|number|object} test
	 */
	_.empty = function empty(test) {
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
	 * @param {HTMLImageElement} el - image element to set the state of
	 * @param {string} state - string attribute to set
	 */
	_.setState = function (el, state) {
		el.setAttribute(state, '');
		return el;
	};

	/**
	 * @param {HTMLImageElement} el
	 * @param {string} attr
	 * @returns {string} attrValue
	 */
	_.getAttr = function (el, attr) {
		const attrExists = el.hasAttribute(attr);
		if (!attrExists) throw Error('Attribute is not present');

		const attrValue = el.getAttribute(attr);
		const attrEmpty = _.empty(attrValue);

		if (attrEmpty) throw Error('Attribute present, but has no value');

		return attrValue;
	};

	/**
	 * @param {HTMLImageElement} el
	 * @param {Array.<string>} arr
	 */
	_.hasAttrs = function (el, arr) {};
	/**
	 * @param {HTMLImageElement} el - image element that has not been loaded yet
	 */
	_.setLoading = function (el) {
		const { loading } = _.config.state;
		_.setState(el, loading);
		_.watchElLoaded(el);
		return el;
	};

	/**
	 * @param {HTMLImageElement} el - image being listened to, may already be loaded
	 * @param {pygmyOn["loaded"]=} cb - run once this image has loaded
	 */
	_.watchElLoaded = function (el, cb = () => {}) {
		const { loaded, fail } = _.config.state;
		if (el.complete) {
			_.setState(el, loaded);
			return cb(el);
		}
		el.addEventListener('load', () => cb(el), { once: true });
		el.addEventListener(
			'error',
			function () {
				_.setState(el, fail);
			},
			{ once: true }
		);
	};

	const $ = {};

	$.registerElements = function () {
		const {
			selector,
			state: { registered },
		} = _.config;
		/** @type {NodeListOf<HTMLImageElement>} */
		const images = document.querySelectorAll(selector);
		console.log(images);
		console.log(images[0]);
		const imagesLength = images.length;
		var i;
		for (i = 0; i < imagesLength; i += 1) {
			_.setState(images[i], registered);
			_.elements.push(images[i]);
		}
	};

	/**
	 * @param {HTMLImageElement} el
	 */
	$.loadImage = function (el) {
		const {
			attr: { src, srcset },
		} = _.config;

		const currSrc = _.getAttr(el, src);
		const currSrcset = _.getAttr(el, srcset);
		_.setLoading(el);
		el.setAttribute('src', currSrc);
		el.setAttribute('srcset', currSrcset);
	};

	$.init = function () {
		$.registerElements();
		// setTimeout(() => _.elements.forEach((img) => $.loadImage(img)), 3000);
	};

	window['requestIdleCallback']($.init);

	pygmysizes = $;

	return pygmysizes;
})();
export default pygmysizes;
