// @ts-check
/**
 * @typedef {import('..').pygmyImage} pygmyImage
 * @typedef {import('..').pygmySizes} pygmySizes
 * @typedef {import('..').pygmyConfig} pygmyConfig
 */

let { src, srcset, sel, preload, init, options } = Object.assign({
	sel: '[loading="lazy"]',
	src: 'pygmy',
	srcset: 'pygmyset',
	// sizes: 'pygmysizes',
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
	}, options);

/**
 * @param {pygmyImage} pygmy
 * @param {(0|1|2|3)} to 
 * @param {(0|1|2|3)} from 
 * @param {string} [t]
 * @param {(k:(0|1|2|3)) => string} [state]
 */
let set = (pygmy, to, from, t, state) => {
	/** @param {(0|1|2|3)} key */
	state = key => 'pygmy' + ['Before', 'Load', 'Preload'][key];
	// @ts-ignore
	pygmy._el.dataset[t = state(to)] = pygmy._el.dispatchEvent(new CustomEvent(t, { detail: pygmy }));
	if (from !== to) delete pygmy._el.dataset[state(from)];
}

/**
 * @param {HTMLImageElement} _el
 */
let queueImage = (_el) => {
	let isPreload = preload in _el.dataset,
		/** @type {pygmyImage} */
		pygmy = {
			_el,
			preload: isPreload,
		};

	elementMap.set(_el, pygmy);
	_el.onload = loadPygmy;
	isPreload ?
		setTimeout(preloadPygmy, 0, pygmy)
		: observer.observe(_el);
}

/**
 * @param {Event} e 
 * @property {HTMLImageElement} e.target
*/
let loadPygmy = e => {
	// @ts-ignore
	let pygmy = elementMap.get(e.target),
		_el = pygmy._el;
	_el.removeEventListener('load', loadPygmy);

	observer.unobserve(_el);

	set(pygmy, 1, 0);
	pygmy.done = true;
	elementMap.set(_el, pygmy);
}
/** @param {pygmyImage} pygmy */
let preloadPygmy = pygmy => {
	pygmy._el.loading = '';
	unveil(pygmy);
	set(pygmy, 2, 0);
}

/** @param {pygmyImage} pygmy */
let unveil = (pygmy) => {
	pygmy._el.src = pygmy._el.dataset[src];
	// _el.sizes = _el.dataset[sizes] || '';
	pygmy._el.srcset = pygmy._el.dataset[srcset] || '';

	set(pygmy, 0, 0);
}

/** @param {string} sel */
let pygmySizes = sel =>
	// @ts-ignore
	document.querySelectorAll(sel).forEach(queueImage);

init && setTimeout(pygmySizes, 0, sel);


export default pygmySizes
