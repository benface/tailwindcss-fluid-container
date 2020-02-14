# Fluid Container Plugin for Tailwind CSS

## Requirements

This plugin requires Tailwind CSS 1.2 or later. If your project uses an older version of Tailwind, you should install the latest 2.x version of this plugin (`npm install tailwindcss-fluid-container@2.x`).

## Installation

```bash
npm install tailwindcss-fluid-container
```

## Usage

```js
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
    },
    fluidContainer: {
      'default': {
        maxWidth: '800px',    // defaults to null (no max width)
        responsiveMaxWidth: { // defaults to {}
          'lg': '1200px',     // at screen 'lg', the max width will change to 1200px
        },
        padding: '15px',      // defaults to '15px'
        responsivePadding: {  // defaults to {}
          'sm': '30px',       // at screen 'sm', the padding will change to 30px
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
/* custom property definitions (only when "responsivePadding" and/or "responsiveMaxWidth" are used) */
html {
  --container-max-width: 800px;
  --container-padding: 15px;
  --container-padding-negative: calc(var(--container-padding) * -1);
}
@media (min-width: 1024px) {
  html {
    --container-max-width: 1200px;
  }
}
@media (min-width: 640px) {
  html {
    --container-padding: 30px;
  }
}

/* the container component itself */
.c-container {
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
  max-width: var(--container-max-width);
  padding-left: 15px;
  padding-left: var(--container-padding);
  padding-right: 15px;
  padding-right: var(--container-padding);
}

/* a bunch of utilities to help you align things with the container */
.w-container {
  width: 800px;
  width: var(--container-max-width);
}
.min-w-container {
  min-width: 800px;
  min-width: var(--container-max-width);
}
.max-w-container {
  max-width: 800px;
  max-width: var(--container-max-width);
}
.py-container {
  padding-top: 15px;
  padding-top: var(--container-padding);
  padding-bottom: 15px;
  padding-bottom: var(--container-padding);
}
.px-container {
  padding-left: 15px;
  padding-left: var(--container-padding);
  padding-right: 15px;
  padding-right: var(--container-padding);
}
.pt-container {
  padding-top: 15px;
  padding-top: var(--container-padding);
}
.pr-container {
  padding-right: 15px;
  padding-right: var(--container-padding);
}
.pb-container {
  padding-bottom: 15px;
  padding-bottom: var(--container-padding);
}
.pl-container {
  padding-left: 15px;
  padding-left: var(--container-padding);
}
.my-container {
  margin-top: 15px;
  margin-top: var(--container-padding);
  margin-bottom: 15px;
  margin-bottom: var(--container-padding);
}
.mx-container {
  margin-left: 15px;
  margin-left: var(--container-padding);
  margin-right: 15px;
  margin-right: var(--container-padding);
}
.mt-container {
  margin-top: 15px;
  margin-top: var(--container-padding);
}
.mr-container {
  margin-right: 15px;
  margin-right: var(--container-padding);
}
.mb-container {
  margin-bottom: 15px;
  margin-bottom: var(--container-padding);
}
.ml-container {
  margin-left: 15px;
  margin-left: var(--container-padding);
}
.-my-container {
  margin-top: -15px;
  margin-top: var(--container-padding-negative);
  margin-bottom: -15px;
  margin-bottom: var(--container-padding-negative);
}
.-mx-container {
  margin-left: -15px;
  margin-left: var(--container-padding-negative);
  margin-right: -15px;
  margin-right: var(--container-padding-negative);
}
.-mt-container {
  margin-top: -15px;
  margin-top: var(--container-padding-negative);
}
.-mr-container {
  margin-right: -15px;
  margin-right: var(--container-padding-negative);
}
.-mb-container {
  margin-bottom: -15px;
  margin-bottom: var(--container-padding-negative);
}
.-ml-container {
  margin-left: -15px;
  margin-left: var(--container-padding-negative);
}
```

You can also generate multiple containers and name them, like this:

```js
{
  theme: {
    fluidContainer: {
      'sm': {
        maxWidth: '1000px',
        padding: '20px',
      },
      'lg': {
        maxWidth: '1400px',
        padding: '30px',
      },
    },
  },
  plugins: [
    require('tailwindcss-fluid-container'),
  ],
}
```

This will generate classes such as `c-container-sm`, `w-container-sm`, etc.
