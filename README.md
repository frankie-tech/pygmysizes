# 🦥 pygmysizes 🦥

A micro sized lazyloading image "library"

## Foreword

pygmysizes (named after the pygmy sloth) is a lazySizes mimic that offers only the skeleton of features that lazySizes offers. The only core system passed on is the events and ability to create plugins. **Plugin is subject to change**

## Goals

-   self initializing
-   standards compliant
-   60fps/jank free
-   no impact to SEO
-   use modern code
-   size budget: ~1kb (ungzipped)

## Outline

-   handle settings from a window config object
-   register all pygmy el using `loading="lazy"` making it a first class citizen
-   option to automatically add transparent gif hack
-   set up intersection observer
-   mimic class loading management of lazySizes to take advantage of some transition effects

## API Outline

`data-pygmy`: link to the image file

`data-pygmyset`: valid srcset string

`data-pygmyload`: empty attribute will preload image after `pageshow` event.

On init: pygmysizes will register each img/element with `data-pygmy` if it is not in viewport.

If an element is in viewport it will immediately begin loading, adding `data-pygmy-loading` until finished.

Once loaded, `data-pygmy-loading` will be removed and replaced by `data-pygmy-loaded`.
Then the intersection observer for this element will be unsubscribed.
