// @ts-check
/**
 * @typedef {import('..').pygmyImage} pygmyImage
 * @typedef {import('..').pygmySizes} pygmySizes
 * @typedef {import('..').pygmyConfig} pygmyConfig
 */

/** @type {pygmyConfig}  */
let config = Object.assign({
	selector: '[loading="lazy"]',
	src: 'pygmy',
	srcset: 'pygmyset',
	sizes: 'pygmysizes',
	preload: 'pygmyload',
	init: true,
	options: { threshold: 0, },
	// @ts-ignore
}, self.pygmyConfig || {});
let data = 'dataset';
let elementMap = new Map;
let preloadElementMap = new Map;

let observer = new IntersectionObserver(
/** @param {IntersectionObserverEntry[]} inViewEntries */(inViewEntries) => {
		for (let l = inViewEntries.length, entry, image; l--;) {
			if (!(entry = inViewEntries[l]).isIntersecting) continue;
			if ((image = elementMap.get(entry.target))) unveil(image._el, config);
		}
	}, config.options);

/**
 * @param {HTMLElement} el 
 * @param {(0|1|2|3)} to 
 * @param {(0|1|2|3)} from 
 * @param {string} [t]
 */
let set = (el, to, from, t) => {
	/** @param {(0|1|2|3)} key */
	let state = key => 'pygmy' + ['Loading', 'Loaded', 'Error', 'Preloaded'][key];
	el.dispatchEvent(new CustomEvent(t = state(to)));
	el[data][t] = 'true';
	if (from !== to) delete el[data][state(from)];
}
 
/**
 * @param {HTMLImageElement} element
 * @param {object} [details]
 */
let queueImage = (element, details) => {
	details = {
		isComplete: element.complete || false,
		_el: element
	}

	if (config.preload in element[data]) preloadElementMap.set(element, details);
	elementMap.set(element, details);

	observer.observe(element);
	element.onload = load;
}

/** @param {Event} e */
let load = e => {
	let _el = elementMap.get(e.target)._el;
	_el.removeEventListener('load', load);
	observer.unobserve(_el);

	set(_el, 1, 0);
}
/** @param {pygmyImage} img */
let preload = img => {
	let _el = img._el;
	_el.loading = 'eager';
	set(_el, 3, 0);
	unveil(_el, config)
}

/**
 * @param {HTMLElement} _el
 * @param {pygmyConfig} pygmyConfig
 */
let unveil = (_el, pygmyConfig) => {
	set(_el, 0, 0);
	_el.src = _el[data][pygmyConfig.src];
	_el.src = _el[data][pygmyConfig.srcset];
	_el.sizes = _el[data][pygmyConfig.sizes];
}

/** @param {pygmyConfig} pygmyConfig */
let pygmySizesCore = pygmyConfig => {
	// @ts-ignore
	document.querySelectorAll(pygmyConfig.selector).forEach(queueImage);

	preloadElementMap.size > 0 &&
		preloadElementMap.forEach(preload);
}

setTimeout(config => { config.init && pygmySizesCore(config) }, 0, config);


export default pygmySizesCore
