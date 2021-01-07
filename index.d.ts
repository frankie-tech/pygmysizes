/** Image */
type pygmyImage = {
	rpc: number;
	isComplete: boolean;
	element: HTMLImageElement;
}

/*
{
	selector: '[loading="lazy"]',
	src: 'pygmy',
	srcset: 'pygmyset',
	sizes: 'pygmysizes',
	preload: 'pygmyload',
	observer: {
		rootMargin: '0px',
		threshold: 0,
	}
}
*/

type pygmyConfig = {
	selector: string;
	src: string;
	srcset: string;
	sizes: string;
	preload: string;
	observer: {
		rootMargin: string;
		threshold: number;
	}
}


type pygmySizes = {
	elements: Set<pygmyImage>;
	config: pygmyCfg;
}

declare global {
	var pygmySizes: pygmySizes;
	interface Window {
		pygmyConfig: pygmyConfig;
		pygmySizes: pygmySizes;
	}
}

export {
	pygmyImage,
	pygmySizes,
	pygmyConfig
}

/** Config Interface */
/*
interface pygmyCfg {
	dev: boolean;
	selector: string;
	offset: number;
	state: pygmyStates;
	attr: pygmyAttributes;
	onLoad: boolean;
}
*/

interface pygmyAttributes {
	src: string;
	srcset: string;
	sizes: string;
}

interface pygmyStates {
	registered: string;
	loading: string;
	loaded: string;
	fail: string;
}

export { pygmyAttributes, pygmyStates };

/** Internal Interface */

interface utils {
	warn: (msg: string, warn: boolean) => false;
	empty: (test: any) => boolean;
	emit: (el: HTMLElement, type: string, detail?: object) => HTMLElement;
	inView: (el: IntersectionObserverEntry) => void;
	id: () => string;
}

interface internal extends utils {
	intersecting: Event;
	config: pygmyCfg;
	elements: Array.<HTMLImageElement>;
	loadingSupported: boolean;
	remove: (el: HTMLElement, state: string) => HTMLElement;
	getAttr: (el: HTMLElement, attr: string) => string | false;
	set: (el: HTMLElement, state: string, val?: string, remove?: string) => HTMLElement;
	merge: (target: pygmyCfg, ...sources: object[]) => pygmyCfg;
}



export { utils, internal };
