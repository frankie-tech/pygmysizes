// @ts-check









// import { testLoading } from './test';
/**
 * @typedef {import('..').pygmyCfg} pygmyCfg
 * @typedef {import('..').pygmyStates} pygmyStates
 * @typedef {import('..').pygmyAttributes} pygmyAttributes
 * @typedef {import('..').internal} internal
 * 
// /** @type {internal} 

import internal from './internal';

import pubsub from './pubsub';

var pygmysizes;
!(function () {
	'use strict';

	const $ = {};

	$.pubsub = pubsub;

	$.config = internal.merge(internal.config, window['pygmyCfg']);
	// /**
	 * @param {HTMLImageElement} el
	 * @param {function} [cb]
	 
	$.watchElLoaded = function (el, cb = () => {}) {
		const { loaded, fail, loading } = internal.config.state;
		if (el.complete) {
			internal.set(el, loaded);
			internal.remove(el, loading);
			return cb(el);
		}
		el.addEventListener('load', () => cb(el), { once: true });
		el.addEventListener(
			'error',
			function () {
				internal.set(el, fail);
			},
			{ once: true }
		);
	};

	/** @param {Array.<HTMLImageElement>} elements*/
$.observer = function (elements) {
	const io = observerInit(elements);
	return io;

	// /** @param {Array.<HTMLImageElement>} elements 
	function observerInit(elements) {
		const observer = new IntersectionObserver(observerCallback, {
			root: null,
			rootMargin: '100px 0px',
		});
		[...elements].forEach((element) => observer.observe(element));
		return observer;
	}

	// /** @param {Array.<IntersectionObserverEntry>} entries 
	function observerCallback(entries) {
		return entries.forEach(isIntersecting);
	}

	// /** @param {IntersectionObserverEntry} entry 
	function isIntersecting(entry) {
		if (entry.intersectionRatio <= 0) return;
		// @ts-ignore
		entry.target.dataset.observerEntry = 'intersecting';

		$.pubsub.publish('intersecting', {
			target: entry.target,
			state: 'loading',
		});

		io.unobserve(entry.target);
		return;
	}
};

$.pubsub.subscribe('intersecting', $.loadImage);

$.pubsub.subscribe('loading', internal.set);

$.pubsub.subscribe('loaded', internal.set);

$.registerElements = function () {
	const {
		selector,
		state: { registered },
	} = internal.config;
	// const loadingSupported = internal.loadingSupported;
	// /** @type {NodeListOf<HTMLImageElement>} 
	const images = document.querySelectorAll(selector);

	const imagesLength = images.length;
	var i;
	for (i = 0; i < imagesLength; i += 1) {
		// const loadingAttr = internal.getAttr(images[i], 'loading');
		// const isEager = loadingAttr === 'eager' || loadingAttr === 'auto';
		internal.set(images[i], registered, internal.id());
		internal.elements.push(images[i]);
		$.observer(internal.elements);

		images[i].addEventListener(
			'pygmy::intersecting',
			// @ts-ignore
			({ target }) => $.loadImage(target),
			{
				once: true,
			}
		);
	}
};

/**
 * @param {HTMLImageElement} el

$.loadImage = function (el) {
	const {
		attr: { src, srcset },
	} = internal.config;
	internal.set(el, 'loading');
	const currSrc = internal.getAttr(el, src);
	const currSrcset = internal.getAttr(el, srcset);

	if (currSrc) el.setAttribute('src', currSrc);
	if (currSrcset) el.setAttribute('srcset', currSrcset);

	return el;
};

$.init = function () {
	$.registerElements();
};

window['requestIdleCallback']($.init);

pygmysizes = $;

return pygmysizes;
})();

export default pygmysizes;
*/
