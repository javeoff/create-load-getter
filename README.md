# create-load-getter

Utility to run repeatable promise in daemon mode.

To install package:

```bash
npm install create-load-getter
```

Usage

```javascript
import createLoadGetter from 'create-load-getter';

let idx = 0;

const [
  load,
  get,
  stop,
  getLastItems,
] = createLoadGetter(() => idx++, 1000)

load() // Start loading every 1000 ms
console.log(get()) // Show idx in console
setTimeout(() => console.log(get()), 3000)
stop()
setTimeout(() => console.log(get()), 1000)
console.log(getLastItems()) // Show last saved items history
```

## Docs

- `func` - function to execute in daemon mode
- `timeout` - timeout to repeat

## Deploy

To install dependencies:

```bash
npm install
```

To build:

```bash
npm build
```

This project was created using `bun init` in bun v1.1.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
