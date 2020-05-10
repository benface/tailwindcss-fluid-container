# Fluid Container Plugin for Tailwind CSS

## Requirements

This plugin requires Tailwind CSS 1.2 or later. If your project uses an older version of Tailwind, you should install the latest 2.x version of this plugin (`npm install tailwindcss-fluid-container@2.x`).

## Installation

```bash
npm install tailwindcss-fluid-container
```

## Usage

### Simple

```js
// tailwind.config.js
module.exports = {
  theme: {
    fluidContainer: {
      'default': {
        maxWidth: '800px', // defaults to null (no max width)
        padding: '15px', // defaults to '15px'
      },
    },
  },
  variants: { // for the utilities
    fluidContainer: ['responsive'], // defaults to ['responsive']
  },
  plugins: [
    require('tailwindcss-fluid-container'),
  ],
};
```

The above configuration would generate the following CSS:

```css
/* the container component itself */
.c-container {
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
  padding-left: 15px;
  padding-right: 15px;
}

/* a bunch of utilities to help you align things with the container */
.w-container {
  width: 800px;
}
.min-w-container {
  min-width: 800px;
}
.max-w-container {
  max-width: 800px;
}
.p-container {
  padding: 15px;
}
.py-container {
  padding-top: 15px;
  padding-bottom: 15px;
}
.px-container {
  padding-left: 15px;
  padding-right: 15px;
}
.pt-container {
  padding-top: 15px;
}
.pr-container {
  padding-right: 15px;
}
.pb-container {
  padding-bottom: 15px;
}
.pl-container {
  padding-left: 15px;
}
.m-container {
  margin: 15px;
}
.my-container {
  margin-top: 15px;
  margin-bottom: 15px;
}
.mx-container {
  margin-left: 15px;
  margin-right: 15px;
}
.mt-container {
  margin-top: 15px;
}
.mr-container {
  margin-right: 15px;
}
.mb-container {
  margin-bottom: 15px;
}
.ml-container {
  margin-left: 15px;
}
.-m-container {
  margin: -15px;
}
.-my-container {
  margin-top: -15px;
  margin-bottom: -15px;
}
.-mx-container {
  margin-left: -15px;
  margin-right: -15px;
}
.-mt-container {
  margin-top: -15px;
}
.-mr-container {
  margin-right: -15px;
}
.-mb-container {
  margin-bottom: -15px;
}
.-ml-container {
  margin-left: -15px;
}
```

### Advanced

```js
// tailwind.config.js
module.exports = {
  theme: {
    fluidContainer: {
      'small': {
        maxWidth: { // defaults to null (no max width)
          default: '800px',
          lg: '1000px',
        },
        padding: { // defaults to '15px'
          default: '15px',
          sm: '30px',
        },
      },
      'large': {
        maxWidth: '1200px', // defaults to null (no max width)
        padding: { // defaults to '15px'
          default: '15px',
          sm: '30px',
        },
      },
    },
  },
  variants: { // for the utilities
    fluidContainer: ['responsive'], // defaults to ['responsive']
  },
  plugins: [
    require('tailwindcss-fluid-container')({
      componentPrefix: 'c-',          // defaults to 'c-'
      widthUtilities: true,           // defaults to true
      paddingUtilities: true,         // defaults to true
      marginUtilities: true,          // defaults to true
      negativeMarginUtilities: true,  // defaults to true
    }),
  ],
};
```


The above configuration would generate the following CSS:

```css
/* custom property definitions */
html {
  --container-small-max-width: 800px;
  --container-small-padding: 15px;
  --container-small-padding-negative: calc(var(--container-small-padding) * -1);
  --container-large-padding: 15px;
  --container-large-padding-negative: calc(var(--container-large-padding) * -1);
}
@media (min-width: 1024px) {
  html {
    --container-small-max-width: 1000px;
  }
}
@media (min-width: 640px) {
  html {
    --container-small-padding: 30px;
    --container-large-padding: 30px;
  }
}

/* the container components */
.c-container-small {
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
  max-width: var(--container-small-max-width);
  padding-left: 15px;
  padding-left: var(--container-small-padding);
  padding-right: 15px;
  padding-right: var(--container-small-padding);
}
.c-container-large {
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
  padding-left: 15px;
  padding-left: var(--container-large-padding);
  padding-right: 15px;
  padding-right: var(--container-large-padding);
}

/* a bunch of utilities to help you align things with the containers */
.w-container-small {
  width: 800px;
  width: var(--container-small-max-width);
}
.min-w-container-small {
  min-width: 800px;
  min-width: var(--container-small-max-width);
}
.max-w-container-small {
  max-width: 800px;
  max-width: var(--container-small-max-width);
}
/* etc. (see the simple example above for the whole list) */
```
