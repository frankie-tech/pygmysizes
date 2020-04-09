/** Config Interface */
interface pygmyCfg {
    dev: boolean;
    selector: string;
    offset: number;
    state: pygmyStates;
    attr: pygmyAttributes;
    onLoad: boolean;
}

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

export { pygmyAttributes, pygmyCfg, pygmyStates };

/** Internal Interface */

interface utils {
    warn: (msg: string, warn: boolean) => false;
    empty: (test: any) => boolean;
    emit: (el: HTMLElement, type: string, detail?: object) => HTMLElement;
    inView: (el: IntersectionObserverEntry) => void;
    id: () => string;
}

interface internal extends utils {
    defaults: pygmyCfg;
    config: pygmyCfg;
    elements: Array.<HTMLImageElement>;
    loadingSupported: boolean;
    remove: (el: HTMLElement, state: string) => HTMLElement;
    getAttr: (el: HTMLElement, attr: string) => string | false;
    set: (el: HTMLElement, state: string, val?: string) => HTMLElement;
}



export { utils, internal };
