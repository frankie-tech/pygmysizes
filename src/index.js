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
/**
 * @param {any[]} arr
 * @param {number} size
 * @returns {any[][]}
 */
const chunk = (arr, size) => arr.reduce((acc, e, i) => (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc), []);

/**
 * 
 * @param {pygmyImage} element 
 * @param  {...string} attrs 
 */
const setAttr = (element, ...attrs) => chunk(attrs, 2).reduce((_, curr, i, a) => [i === 1 ? (element.setAttribute(_[0], _[1]), element.setAttribute(curr[0], curr[1])) : element.setAttribute(curr[0], curr[1])]);

/**  @param {pygmyImage} element */
function loadElement(element) {
	requestAnimationFrame(() => {
		setAttr(element, 'src', element.dataset[config.src], 'srcset', element.dataset[config.srcset] || '', 'sizes', element.dataset[config.sizes] || '');
		/*
		element.setAttribute('src', element.dataset[config.src]);
		if (element.dataset[config.srcset] !== undefined) {
			element.setAttribute('srcset', element.dataset[config.srcset]);
			element.setAttribute('sizes', element.dataset[config.sizes] || '');
		}
		*/
		element.isLoading = false;
	});
}

/** @param {Window} window */
function pygmySizesCore(window) {
	/** @type {Set<pygmyImage>} */
	const elements = new Set(document.querySelectorAll(config.selector));

	/** @type {pygmySizes} */
	const instance = {
		config,
		elements,
	}
	window.pygmySizes = instance;

	if ('loading' in HTMLImageElement.prototype) {
		elements.forEach(loadElement);
		return instance;
	}
}

export default pygmySizesCore(window)
