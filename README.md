# Fluid Container Plugin for Tailwind CSS

## Installation

```bash
npm install tailwindcss-fluid-container
```

## Usage

```js
// In your Tailwind CSS config
{
  screens: {
    'sm': '600px',
  },

  // ...

  plugins: [
    require('tailwindcss-fluid-container')({
      maxWidth: '1200px',     // defaults to null (no maximum width)
      padding: '20px',        // defaults to '15px'
      responsivePadding: {    // defaults to {}
        'sm': '40px',         // at screen 'sm', the padding will change to '40px'
      },
      componentPrefix: 'c-',  // defaults to 'c-'
      variants: [],           // for the utilities; defaults to []
    }),
  ],
}
```

The above configuration would generate the following CSS:

```css
/* custom property definitions (only because `responsivePadding` is used) */
html {
  --container-padding: 20px;
  --container-padding-negative: calc(var(--container-padding) * -1);
}
@media (min-width: 600px) {
  html {
    --container-padding: 40px;
  }
}

/* the container component itself */
.c-container {
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
  padding-left: 20px;
  padding-left: var(--container-padding);
  padding-right: 20px;
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
  padding-left: 20px;
  padding-left: var(--container-padding);
  padding-right: 20px;
  padding-right: var(--container-padding);
}
.pl-container {
  padding-left: 20px;
  padding-left: var(--container-padding);
}
.pr-container {
  padding-right: 20px;
  padding-right: var(--container-padding);
}
.mx-container {
  margin-left: 20px;
  margin-left: var(--container-padding);
  margin-right: 20px;
  margin-right: var(--container-padding);
}
.ml-container {
  margin-left: 20px;
  margin-left: var(--container-padding);
}
.mr-container {
  margin-right: 20px;
  margin-right: var(--container-padding);
}
.-mx-container {
  margin-left: -20px;
  margin-left: var(--container-padding-negative);
  margin-right: -20px;
  margin-right: var(--container-padding-negative);
}
.-ml-container {
  margin-left: -20px;
  margin-left: var(--container-padding-negative);
}
.-mr-container {
  margin-right: -20px;
  margin-right: var(--container-padding-negative);
}
```

You can also generate multiple containers and name them, like this:

```js
{
  plugins: [
    require('tailwindcss-fluid-container')({
      containers: {
        'container-sm': {
          maxWidth: '1000px',
          padding: '20px',
        },
        'container-lg': {
          maxWidth: '1400px',
          padding: '30px',
        },
      },
    }),
  ],
}
```
