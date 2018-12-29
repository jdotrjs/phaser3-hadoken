# `phaser3-hadoken` demo

This is the source for the [public hadoken demo][demo-url].

## Building

The demo build is separate but dependent upon the base project. In order to
run it locally ou should

1. Bulid the base project
2. Build the demo
3. Run the demo

All this can be done with yarn from the repo root directory.

Basically:

```
phaser3-hadoken repo> yarn build
phaser3-hadoken repo> yarn build:example
phaser3-hadoken repo> yarn run:demo
```

## Code organization

- `index.ts` &mdash; bulk of the logic, pretty well documented
  - `_connectPad` and `_connectKB` create (if needed) and make active the
    gamepad and keyboard adapters, respectively;
  - `_constructUI` and `_drawInputHistory` a bunch of mindless image and text
    creation / per-update redraws so we can show what's going on and how
    Hadoken is reacting to the various controller inputs;
  - `_onMoveMatched` is the callback when a hadoken instance matches one of the
    specified move sets; it is registered to both the keyboard and controller
    `Hadoken` instances;
  - `selectKeymap` and `selectInput` are callbacks for the html page uses to
    signal things to the scene;
- `ExampleConfig.js` &mdash; a _bunch_ of configuration; defines keymaps, input
  classes (e.g. punches vs kicks), move sets, functions to create the actual
  `Hadoken` configs, etc;
- `__ExampleConfig.ts` &mdash; My shame. Let's pretend this doesn't exist for
  right now (or read the _Caveats_ section below and help fix it if you feel
  like fighting with webpack).

## Caveats

The demo was originally built along side the base project in typescript. As I
started to pull it out I hit the fact that I don't have a typedef file set up
yet so the `index.js` doesn't type check for now :sob:.

Additionally there is an odd config issue where importing `ExampleConfig.ts`
from `index.js` wasn't resolving once the example project was split out so I
rewrote it as an ES6 js file and left `__ExampleConfig.ts` around to preserve
type data for when I come back to fix this (in the future, eventually, maybe?)

[demo-url]: https://jdotrjs.github.io/demos/phaser3-hadoken/
