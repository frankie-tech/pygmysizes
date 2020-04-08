import { pygmyAttributes } from './src';

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
    id: function;
    warn: function;
    empty: function;
    emit: function;
    getAttr: function;
}

interface manipulateState {
    set: function,
    setLoading: function,
}

interface internal extends utils {
    defaults: object;
    config: pygmyCfg;
    elements: Array.<HTMLImageElement>;
    loadingSupported: boolean;
    on: object;
    inView: function;
    set: function;
}



export { utils, internal };
