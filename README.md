# 🦥 pygmysizes 🦥

A micro sized lazyloading image "library"

## Foreword

pygmysizes (named after the pygmy sloth) is not meant to be a full replacement of lazysizes. It is the all in one option for lazyloading and fits most use cases. You probably just wanna use lazysizes honestly.

## Goals

- self initializing
- standards compliant
- 60fps/jank free
- no impact to SEO
- use modern code
- size budget: ~10kb

## Outline

- handle settings
- register all pygmy el
- check for native support
  - if support, change all data- attributes to std attributes
  - exit
- set up intersection observer
- on intersect
  - swap data attribute with attribute
  - apply appropriate class (look more into SM?)
  - on load
    - remove event listener
    - add loaded class

## API Outline

`data-src` string: link to the image file

`data-srcset` string: valid srcset string

On init: pygmysizes will register each img/element with `data-pygmy` if it is not in viewport.

If an element is in viewport it will immediately begin loading, adding `data-pygmy-loading` until finished.

Once loaded, `data-pygmy-loading` will be removed and replaced by `data-pygmy-loaded`.
Then the intersection observer for this element will be unsubscribed.
