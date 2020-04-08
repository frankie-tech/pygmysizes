// @ts-check
import { testLoading } from './test';
/**
 * @typedef {import('..').pygmyCfg} pygmyCfg
 * @typedef {import('..').pygmyStates} pygmyStates
 * @typedef {import('..').pygmyAttributes} pygmyAttributes
 * @typedef {import('..').internal} internal
 * @typedef {import('..').utils} utils
 */
/** @type {utils} */
import utils from './utils';

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
	/** @type {internal} */
	const _ = {
		defaults: Object.freeze({
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
			on: {},
			dev: false,
		}),
	};

	Object.assign({}, utils);

	/** @type {pygmyCfg} */
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
		on: {},
		dev: false,
	});

	_.on = {
		/** @param {HTMLImageElement} el */
		loaded: (el) => {
			const e = new CustomEvent('pygmy::loaded', {
				detail: {
					time: new Date(),
					el: el,
					id: el.dataset.pygmy,
					msg: `Element`,
				},
			});
			_.o.unobserve(el);
			el.dispatchEvent(e);
		},
	};
	/** @type {pygmyCfg} */
	_.config = Object.assign(_.config, {}, _.defaults, window['pygmyCfg']);

	_.elements = [];

	_.loadingSupported = 'loading' in HTMLImageElement;

	/** @param {IntersectionObserverEntry} el */
	_.inView = function (el) {
		console.log(el, el.intersectionRatio);
	};

	/**
	 * @param {HTMLImageElement} el - image element to set the state of
	 * @param {string} state - string attribute to set
	 */
	_.set = function (el, state) {
		const { registered } = _.config.state;
		if (state === registered) {
			let id = _.id();
			el.setAttribute(state, id);
			return el;
		}
		el.setAttribute(state, '');
		return el;
	};

	/**
	 * @param {HTMLImageElement} el
	 * @param {string} attr
	 * @returns {string|false} attrValue
	 */
	_.getAttr = function (el, attr) {
		const attrExists = el.hasAttribute(attr);
		if (!attrExists)
			return _.warn(`Attribute (${attr}) is not present`, _.config.dev);

		const attrValue = el.getAttribute(attr);
		const attrEmpty = _.empty(attrValue);

		if (attrEmpty)
			return _.warn(
				`Attribute (${attr}) present, but has no value`,
				_.config.dev
			);

		return attrValue;
	};

	/**
	 * @param {HTMLImageElement} el - image element that has not been loaded yet
	 */
	_.setLoading = function (el) {
		const { loading } = _.config.state;
		_.set(el, loading);
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
			_.set(el, loaded);
			return cb(el);
		}
		el.addEventListener('load', () => cb(el), { once: true });
		el.addEventListener(
			'error',
			function () {
				_.set(el, fail);
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

		const imagesLength = images.length;
		var i;
		for (i = 0; i < imagesLength; i += 1) {
			_.set(images[i], registered);
			_.elements.push(images[i]);
			images[i].addEventListener('pygmy::loaded', testLoading);
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

		if (currSrc) el.setAttribute('src', currSrc);
		if (currSrcset) el.setAttribute('srcset', currSrcset);

		return el;
	};

	$.init = function () {
		$.registerElements();
		setTimeout(() => _.elements.forEach((img) => $.loadImage(img)), 3000);
	};

	window['requestIdleCallback']($.init);

	pygmysizes = $;

	return pygmysizes;
})();

export default pygmysizes;
