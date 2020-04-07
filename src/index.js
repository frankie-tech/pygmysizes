const defaults = Object.freeze({
	selector: '[loading="lazy"]' /* dom selector string */,
	offset: 100 /* offset in pixels where an image should be loaded */,
	data: {
		registered: 'data-pygmy',
		loading: 'data-pygmy-loading',
		loaded: 'data-pygmy-loaded',
	},
	attr: {
		src: 'data-src',
		srcset: 'data-srcset',
	},
	initOnLoad: true,
});
