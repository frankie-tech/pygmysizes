# 🦥 pygmysizes 🦥

A micro-library for lazyloading images

## Foreword

pygmysizes (named after the pygmy sloth) is a lazysizes mimic that offers only the skeleton of features that lazysizes offers. The only core system passed on is the events.

### Packages

_Sizes are gzipped_

| ES5/UMD | ES2017/Modern |
|---|---|
| 1064b / 748b | 948b / 677b |

## Goals:

-   Size budget: ~1kb
- Be `[loading="lazy"]` first
-   Use ✨ modern ✨ code
-   Self initialize, but offer option to defer
- Offer similar events to lazysizes

## Settings:

To change the defaults alter these values on the `window.pygmyConfig` object before the script loads.

```json
{
  selector: '[loading="lazy"]',
  src: 'pygmy',
  srcset: 'pygmyset',
  sizes: 'pygmysizes',
  preload: 'pygmyload',
  rpc: 'pygmyrpc',
  options: {
    // IntersectionObserver options
  }
}
```

## FAQ

### __Wait doesn't lazysizes have more settings than that?__

Yeah, these are the ones I've used most often, and implemented them here. Due to the size constraint I've budgeted, I'm not planning on adding anything else to the package.

### __But what about...?__

If something can be proposed that doesn't exceed the current size budget (~1kb), I'm all for adding it.

### __What about expand?__

Feature like expand and `sizes="auto"`, where Javascript is used to calculate values automatically will likely not be added.

### __So no loadMode?__

That is actually on my todo list! But with pygmysizes already _technically_ overbudget, I don't know if I will be able to.

## API Outline

### __While pygmysizes is a mimic, the attributes are slightly different, to avoid conflict__

- `data-src` is replaced by `data-pygmy`

- `data-srcset` is replaced by `data-pygmyset`

- `data-sizes` is replaced by `data-pgymysizes`

- `.lazypreload` is replaced by `data-pygmyload`

### __How do  I defer initializing?__

Before pygmysizes loads set `window.pygmyConfig.init` to `false`, and then when you're ready run pygmySizes() __Confirm this__


## __Does pygmysizes have any classes__

No. Instead of classes, pygmysizes works entirely using `data-*`. A loaded image will have `data-pygmyloaded`, and a loading image will have `data-pygmyloading`. I have plans to make this configurable, but for now it is only the `src`, `srcset`, and `sizes` data attributes are configurable.
