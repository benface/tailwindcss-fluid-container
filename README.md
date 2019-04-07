# Fluid Container Plugin for Tailwind CSS

## Installation

```bash
npm install tailwindcss-fluid-container
```

## Usage

```js
// tailwind.config.js
{
  theme: {
    screens: {
      'sm': '640px',
    },
    fluidContainer: {
      'default': {
        maxWidth: '1200px',   // defaults to null (no maximum width)
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
      componentPrefix: 'c-',  // defaults to 'c-'
      widthUtilities: true,   // defaults to true
      paddingUtilities: true, // defaults to true
      marginUtilities: true,  // defaults to true
      negativeMarginUtilities: true,  // defaults to true
    }),
  ],
}
```

The above configuration would generate the following CSS:

```css
/* custom property definitions (only because `responsivePadding` is used) */
html {
  --container-padding: 15px;
  --container-padding-negative: calc(var(--container-padding) * -1);
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
  max-width: 1200px;
  padding-left: 15px;
  padding-left: var(--container-padding);
  padding-right: 15px;
  padding-right: var(--container-padding);
}

/* a bunch of utilities to help you align things with the container */
.w-container {
  width: 1200px;
}
.min-w-container {
  min-width: 1200px;
}
.max-w-container {
  max-width: 1200px;
}
.px-container {
  padding-left: 15px;
  padding-left: var(--container-padding);
  padding-right: 15px;
  padding-right: var(--container-padding);
}
.pl-container {
  padding-left: 15px;
  padding-left: var(--container-padding);
}
.pr-container {
  padding-right: 15px;
  padding-right: var(--container-padding);
}
.mx-container {
  margin-left: 15px;
  margin-left: var(--container-padding);
  margin-right: 15px;
  margin-right: var(--container-padding);
}
.ml-container {
  margin-left: 15px;
  margin-left: var(--container-padding);
}
.mr-container {
  margin-right: 15px;
  margin-right: var(--container-padding);
}
.-mx-container {
  margin-left: -15px;
  margin-left: var(--container-padding-negative);
  margin-right: -15px;
  margin-right: var(--container-padding-negative);
}
.-ml-container {
  margin-left: -15px;
  margin-left: var(--container-padding-negative);
}
.-mr-container {
  margin-right: -15px;
  margin-right: var(--container-padding-negative);
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
    require('tailwindcss-fluid-container')(),
  ],
}
```

This will generate classes such as `c-container-sm`, `w-container-sm`, etc.
