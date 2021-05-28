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
}, self.pygmyConfig || {});
/** @type {Map<(HTMLElement|HTMLImageElement|EventTarget), pygmyImage>} elementMap */
let elementMap = new Map,
	raf = requestAnimationFrame;

let observer = new IntersectionObserver(
/** @param {IntersectionObserverEntry[]} inViewEntries */ inViewEntries => {
		for (let l = inViewEntries.length, e; l--;)
			(e = inViewEntries[l]).isIntersecting
				// @ts-ignore
				&& unveil(elementMap.get(e.target), e.target)
	}, options);

/**
 * @param {pygmyImage} pygmy
 * @param {HTMLImageElement} _el
 * @param {(0|1|2|3)} to 
 * @param {(0|1|2|3)} [from]
 * @param {string} [t]
 * @param {(k:(0|1|2|3)) => string} [state]
 */
let set = (pygmy, _el, to, from, t, state) => {
	/** @param {(0|1|2|3)} key */
	state = key => 'pygmy' + ['Before', 'Load', 'Preload'][key];
	if (from !== to) delete _el.dataset[state(from || 0)];
	// @ts-ignore
	_el.dataset[t = state(to)] = _el.dispatchEvent(new CustomEvent(t, { detail: pygmy }));
}

/**
 * @param {HTMLImageElement} _el
 * @param {boolean} [isPreload]
 * @param {object} [pygmy]
 */
let queueImage = (_el, isPreload, pygmy) => {
	elementMap.set(_el, pygmy = {
		_el: _el,
		preload: isPreload = preload in _el.dataset,
	});

	_el.onload = loadPygmy;
	observer.observe(_el,
		// I hate hiding this inside of the observer.observe
		// but it saves between 6-18b, sooooo...
		// And for some reason
		// organizing it like this
		// unveil / set / pygmy._el.loading saves another 3b ???
		// @ts-ignore
		isPreload && raf(_ => {
			// set [loading] to the rAF rpc instead of an empty string (saves 1b)
			unveil(pygmy, _el);
			set(pygmy, _el, 2);
			// Also doesn't like assigning a number to [loading=""] when it should be a string
			// @ts-ignore
			pygmy._el.loading = _
		}));
}

/**
 * @param {Event} e 
 * @property {HTMLImageElement} e.target
 * @param {pygmyImage} [pygmy]
 * @param {HTMLImageElement} [_el]
*/
let loadPygmy = (e, pygmy, _el) => {
	// @ts-ignore
	observer.unobserve(
		(_el = (
			pygmy = elementMap.get(e.target)
		)._el)
	);

	set(pygmy, _el, pygmy.done = 1);
	_el.removeEventListener('load', loadPygmy);
	elementMap.set(_el, pygmy);
}

/**
 * @param {pygmyImage} pygmy
 * @param {HTMLImageElement} _el
 */
let unveil = (pygmy, _el) => raf(_ => set(pygmy, _el, 0),
	// @ts-ignore tsc doesn't like the commas and thinks that these are extra arguments
	_el.src = _el.dataset[src], _el.srcset = _el.dataset[srcset] || '')

/** @param {number} _ */
let pygmySizes = _ =>
	// @ts-ignore
	document.querySelectorAll(sel).forEach(queueImage);

init && raf(pygmySizes);

export default pygmySizes
