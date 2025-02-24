# vite-vanjs-svg

[![Coverage Status](https://coveralls.io/repos/github/thednp/vite-vanjs-svg/badge.svg)](https://coveralls.io/github/thednp/vite-vanjs-svg)
[![ci](https://github.com/thednp/vite-vanjs-svg/actions/workflows/ci.yml/badge.svg)](https://github.com/thednp/vite-vanjs-svg/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/vite-vanjs-svg.svg)](https://www.npmjs.com/package/vite-vanjs-svg)
[![typescript version](https://img.shields.io/badge/typescript-5.7.3-brightgreen)](https://www.typescriptlang.org/)
[![vanjs-core version](https://img.shields.io/badge/vanjs--core-1.5.3-brightgreen)](https://github.com/vanjs-org/van)
[![vitest version](https://img.shields.io/badge/vitest-3.0.6-brightgreen)](https://www.vitest.dev/)
[![vite version](https://img.shields.io/badge/vite-6.1.1-brightgreen)](https://vite.dev)


A Vite plugin that transforms SVG files into VanJS components using the [DOMParser](https://github.com/thednp/domparser). One of the fastest UI frameworks deserves the fastest plugin, check out the [React](https://github.com/thednp/vite-react-svg) version to learn why.


## Features
* 🚀 Fast transformation using [DOMParser](https://github.com/thednp/domparser)
* 🎯 TypeScript support
* 🔧 Configurable transformation options
* 🔥 Hot Module Replacement (HMR) support
* ⚡ Vitest powered tests


## Installation

```bash
npm install -D vite-vanjs-svg
```

```bash
pnpm add -D vite-vanjs-svg
```

```bash
yarn add -D vite-vanjs-svg
```

```bash
deno add npm:vite-vanjs-svg
```

```bash
bun install vite-vanjs-svg
```


## Usage
### Configuration
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vanSVG from 'vite-vanjs-svg'

export default defineConfig({
  plugins: [
    // other plugins
    vanSVG({
        // optional
    })
  ]
})
```

### Options
While the default options work just fine, for your convenience the plugin allows you to set them all:

```ts
interface VitePluginVanSvgOptions {
  // esbuild transform options
  esbuildOptions?: EsbuildTransformOPtions;
  // filter options
  include?: string | RegExp | (string | RegExp)[]
  exclude?: string | RegExp | (string | RegExp)[]
}
```

* `esbuildOptions`: [EsbuildTransformOptions](https://esbuild.github.io/api/#transform) esbuild will make sure the plugin will work seamless within the Vite ecosystem and provides some additional options;
  // filter options
* `include`: filter option to **include** one or more RegExp for file IDs; the default value is `["**/*.svg?van"]`;
* `exclude`: filter option to **exclude** one or more RegExp for file IDs.

**Note** - If you modify or add more include filters and you're using Typescript, you should also define new global modules.


### Typescript
To add typescript support, edit your `src/vite-env.d.ts` (or any global types you have set in your app) as follows:

```ts
/// <reference types="vite/client" />
/// <reference types="vite-vanjs-svg" />
```


### In Your Code
```ts
import Icon from './icon.svg?van'

const app = () => {
  return div(
    Icon({ 
      width: 24,
      height: 24,
      class: 'my-icon',
      style: 'fill: "currentColor"'
    })
  )
}
```
**Notes**:
 * All properties present in the markup of your SVG files will be used as default values;
 * The `style` attribute only supports string value;
 * The plugin will also resolve SVG files from the `/public` folder or any valid `viteConfig.publicDir` option.


## Acknowledgments
* [vanjs-converter](https://github.com/vanjs-org/converter) - For the first prototype version of the plugin;
* [vite-plugin-svgr](https://github.com/pd4d10/vite-plugin-svgr) - For inspiration on the plugin architecture;
* [vite-solid-svg](https://github.com/thednp/vite-solid-svg) - For the SolidJS version;
* [vite-react-svg](https://github.com/thednp/vite-react-svg) - For the React version.


## License
**vite-vanjs-svg** is released under [MIT License](LICENSE).
