// @ts-check
/**
 * @typedef {import('..').pygmyImage} pygmyImage
 * @typedef {import('..').pygmySizes} pygmySizes
 * @typedef {import('..').pygmyConfig} pygmyConfig
 */
const config = Object.assign(window.pygmyConfig || {}, {
	selector: '[loading="lazy"]',
	src: 'pygmy',
	srcset: 'pygmyset',
	sizes: 'pygmysizes',
	preload: 'pygmyload',
	observer: {
		rootMargin: '0px',
		threshold: 0,
	}
});

let rpc = 0;

/**
 * @param {any[]} arr
 * @param {number} size
 * @returns {any[][]}
 */
const chunk = (arr, size) => arr.reduce((acc, e, i) => (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc), []);

// @ts-ignore
const raf = fn => (...args) => requestAnimationFrame(() => fn(...args));

/**
 * @param {HTMLElement} element
 * @param  {...string} attrs 
 */
const setAttr = (element, ...attrs) => chunk(attrs, 2).reduce((_, curr, i, a) => [i === 1 ? (element.setAttribute(_[0], _[1]), element.setAttribute(curr[0], curr[1])) : element.setAttribute(curr[0], curr[1])]);

/**  @param {pygmyImage} param */
function loadImage({ element, isComplete }) {
	setAttr(element, 'src', element.dataset[config.src], 'srcset', element.dataset[config.srcset] || '', 'sizes', element.dataset[config.sizes] || '');
}

/**
 * @param {string} selector
 * @returns Set<pygmyImage>
 */
function queueImages(selector) {
	const elements = [...document.body.querySelectorAll(selector)].map((/** @type {HTMLImageElement} - element */ element) => ({ rpc: ++rpc, isComplete: element.complete || false, element }));

	// add delegated listener to window

	return new Set(elements);
}

function pygmySizesCore() {
	const elements = queueImages(config.selector);

	if ('loading' in HTMLImageElement.prototype) {
		elements.forEach(raf(loadImage));
		return {
			config,
			elements,
		}
	}
}

pygmySizes = pygmySizesCore();

export default pygmySizes;
