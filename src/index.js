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
}, self.pygmyConfig || {}),
	/** @type {Map<HTMLImageElement, pygmyImage>} */
	elementMap = new Map;

let observer = new IntersectionObserver(
/** @param {IntersectionObserverEntry[]} inViewEntries */ inViewEntries => {
		for (let l = inViewEntries.length, e, pygmy; l--;)
			(e = inViewEntries[l]).isIntersecting && (pygmy = elementMap.get(e.target)) && unveil(pygmy)
	}, config.options);

/**
 * @param {pygmyImage} pygmy
 * @param {(0|1|2|3)} to 
 * @param {(0|1|2|3)} from 
 * @param {string} [t]
 * @param {(k:(0|1|2|3)) => string} [state]
 */
let set = (pygmy, to, from, t, state) => {
	/** @param {(0|1|2|3)} key */
	state = key => 'pygmy' + ['BeforeUnveil', 'Loaded', 'Preloading'][key];
	// @ts-ignore
	pygmy._el.dataset[t = state(to)] = pygmy._el.dispatchEvent(new CustomEvent(t, { detail: pygmy }));
	if (from !== to) delete pygmy._el.dataset[state(from)];
}

/**
 * @param {HTMLImageElement} _el
 */
let queueImage = (_el) => {
	let isPreload = config.preload in _el.dataset,
		/** @type {pygmyImage} */
		pygmy = {
			_el,
			preload: isPreload,
		};

	elementMap.set(_el, pygmy);
	_el.onload = load;
	isPreload ?
		requestAnimationFrame(_ => preload(pygmy))
		: observer.observe(_el);
}

/**
 * @param {Event} e 
 * @property {HTMLImageElement} e.target
*/
let load = e => {
	// @ts-ignore
	let pygmy = elementMap.get(e.target),
		_el = pygmy._el;
	_el.removeEventListener('load', load);

	observer.unobserve(_el);

	set(pygmy, 1, 0);
	pygmy.isComplete = true;
	elementMap.set(_el, pygmy);
}
/** @param {pygmyImage} pygmy */
let preload = pygmy => {
	pygmy._el.loading = 'eager';
	unveil(pygmy);
	set(pygmy, 2, 0);
}

/** @param {pygmyImage} pygmy */
let unveil = (pygmy) => {
	let _el = pygmy._el;
	_el.src = _el.dataset[config.src];
	_el.sizes = _el.dataset[config.sizes] || '';
	_el.srcset = _el.dataset[config.srcset] || '';
	set(pygmy, 0, 0);
}

/** @param {pygmyConfig} pygmyConfig */
let pygmySizes = pygmyConfig =>
	// @ts-ignore
	document.querySelectorAll(pygmyConfig.selector).forEach(queueImage);

setTimeout(_ => config.init && pygmySizes(config), 0);


export default pygmySizes
