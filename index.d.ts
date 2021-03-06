/** Image */
type pygmyImage = {
	done?: (0 | 1);
	preload: boolean;
	_el: HTMLImageElement;
}

type pygmyConfig = {
	selector: string;
	src: string;
	srcset: string;
	sizes: string;
	preload: string;
	init?: boolean;
	options?: {
		root?: Element;
		rootMargin?: string;
		threshold?: number;
	}
}


type pygmySizes = {
	elements: Map<HTMLImageElement, pygmyImage>;
	config: pygmyConfig;
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
