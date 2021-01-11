// @ts-check
/**
 * @typedef {import('..').pygmyImage} pygmyImage
 * @typedef {import('..').pygmySizes} pygmySizes
 * @typedef {import('..').pygmyConfig} pygmyConfig
 */

/** @type {pygmyConfig}  */
const config = Object.assign({
	selector: '[loading="lazy"]',
	src: 'pygmy',
	srcset: 'pygmyset',
	sizes: 'pygmysizes',
	preload: 'pygmyload',
	rpc: 'pygmyrpc',
	init: true,
	options: {
		threshold: 0,
	},
}, window.pygmyConfig || {});

let rpc = 0;

const elementMap = new Map;
const preloadElementMap = new Map;
const observer = new IntersectionObserver(handleObservation, config.options);

/**
 * @param {string} evtName
 * @param {pygmyImage} image
 */
const dispatch = (evtName, image) => { image.__element.dispatchEvent(new CustomEvent(evtName, { detail: image })) };

/** @param {(0|1|2|3)} key */
const state = key => 'pygmy' + ['Loading', 'Loaded', 'Error', 'PreLoaded'][key];

/**
 * @param {pygmyImage} img 
 * @param {(0|1|2|3)} to 
 * @param {(0|1|2|3)} [from]
 */
const changeState = (img, to, from) => { img.__element.dataset[state(to)] = 'true'; from && delete img.__element.dataset[state[from]] };

/**
 * @param {HTMLElement} el 
 * @param {string} attr 
 * @param {string} val
 */
const sA = (el, attr, val) => { el.setAttribute(attr, val || '') };

/** @param {HTMLImageElement} element */
const queueImage = element => {
	const elementOptions = { rpc: ++rpc, isComplete: element.complete || false, __element: element }
	// @ts-ignore
	element.dataset[config.rpc] = rpc;

	if (element.dataset[config.preload] !== undefined) preloadElementMap.set(element, elementOptions);
	elementMap.set(element, elementOptions);

	observer.observe(element);
	element.addEventListener('load', load);
}

/** @param {Event} event */
const load = event => {
	const pygmyImage = elementMap.get(event.target);
	if (!pygmyImage) return;
	pygmyImage.__element.removeEventListener('load', load);
	observer.unobserve(pygmyImage.__element);

	dispatch('pygmysizes:loaded', pygmyImage);
	changeState(pygmyImage, 1, 0)
}

/** @param {pygmyImage} pygmyImage */
const unveil = pygmyImage => {
	let el = pygmyImage.__element;
	let dataset = el.dataset;

	changeState(pygmyImage, 0);
	sA(el, 'src', dataset[config.src]);
	sA(el, 'srcset', dataset[config.srcset]);
	sA(el, 'sizes', dataset[config.sizes]);
}

/** @param {IntersectionObserverEntry[]} inViewEntries */
function handleObservation(inViewEntries) {
	let l = inViewEntries.length
	for (; l--;) {
		let entry = inViewEntries[l];
		if (!entry.isIntersecting) continue;

		let image = elementMap.get(entry.target);
		if (!image) continue;
		// @ts-ignore
		dispatch('pygmysizes:beforeunveil', image)
		unveil(image);
	}
}

function pygmySizesCore() {
	// @ts-ignore
	document.querySelectorAll(config.selector).forEach(queueImage);

	if (preloadElementMap.size > 0)
		preloadElementMap.forEach((img) => {
			changeState(img, 3);
			unveil(img)
		});
}

setTimeout(() => { config.init && pygmySizesCore() }, 0);


export default pygmySizesCore
