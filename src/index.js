// @ts-check
/**
 * @typedef {import('..').pygmyImage} pygmyImage
 * @typedef {import('..').pygmySizes} pygmySizes
 * @typedef {import('..').pygmyConfig} pygmyConfig
 */

const config = Object.assign({
	selector: '[loading="lazy"]',
	src: 'pygmy',
	srcset: 'pygmyset',
	sizes: 'pygmysizes',
	preload: 'pygmyload',
	options: {
		rootMargin: '0px',
		threshold: 0,
	},
}, window.pygmyConfig || {});

let rpc = 0;

const elementMap = new Map;
const preloadElementSet = new Set;
const observer = new IntersectionObserver(handleObservation, config.options)

let isComplete = false,
	isLoading = 0;

/**
 * @param {string} evtName
 * @param {pygmyImage} image
 */
const dispatch = (evtName, image) => { image.element.dispatchEvent(new CustomEvent(evtName, { detail: image })) };

/**
 * @param {any[]} arr
 * @param {number} size
 * @returns {any[][]}
 */
const chunk = (arr, size) => arr.reduce((acc, e, i) => (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc), []);

// @ts-ignore
const raf = fn => (...a) => {
	requestAnimationFrame(() => { fn(...a) })
},
	// @ts-ignore
	ric = requestIdleCallback || ((cb, start = Date.now()) => setTimeout(_ => cb({ didTimeout: false, timeRemaining: _ => Math.max(0, 50 - (Date.now() - start)) }), 1));
/**
 * @param {HTMLElement} element
 * @param  {...string} attrs 
 */
const setAttr = (element, ...attrs) => { chunk(attrs, 2).reduce((_, curr, i) => [i === 1 ? (element.setAttribute(_[0], _[1]), element.setAttribute(curr[0], curr[1])) : element.setAttribute(curr[0], curr[1])]) };


const loadImage = raf(/**  @param {HTMLImageElement} element */ element => {
	setAttr(element,
		'src', element.dataset[config.src],
		'srcset', element.dataset[config.srcset] || '',
		'sizes', element.dataset[config.sizes] || ''
	);
});

/** @param {HTMLImageElement} element */
function queueImage(element) {
	const elementOptions = { rpc: ++rpc, isComplete: element.complete || false, element }
	element.dataset.pygmyRpc = '' + rpc;

	if (element.dataset[config.preload]) preloadElementSet.add(element)
	elementMap.set(element, elementOptions);
	observer.observe(element);
	element.addEventListener('load', load);
}

/** @param {ProgressEvent} event */
function load(event) {
	const pygmyImage = elementMap.get(event.target);
	pygmyImage.element.removeEventListener('load', load);
	observer.unobserve(pygmyImage.element);

	dispatch('pygmysizes:loaded', pygmyImage);
}

function unveil(element) {
	isLoading++;
	console.log(element);
}

/**
 * @param {IntersectionObserverEntry[]} inViewEntries
 * @param {IntersectionObserver} observer
 */
function handleObservation(inViewEntries, observer) {
	let i = 0,
		l = inViewEntries.length;

	for (; i < l; i++) {
		if (!inViewEntries[i].isIntersecting) continue;

		unveil(inViewEntries[i].target);
	}
}

function pygmySizesCore() {
	document.querySelectorAll(config.selector).forEach(queueImage);

	if (preloadElementSet.size > 0) window.addEventListener('DOMContentLoaded', () => {
		preloadElementSet.forEach(loadImage)
	}, { once: true, capture: true });

	// uncomment next line to test
	delete HTMLImageElement.prototype.loading;

	if ('loading' in HTMLImageElement.prototype) {
		elementMap.forEach(loadImage);
		return {
			config,
			elements: elementMap,
		}
	}
}

export default pygmySizes = pygmySizesCore();;
