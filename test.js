const _ = require('lodash');
const cssMatcher = require('jest-matcher-css');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const defaultConfig = require('tailwindcss/defaultConfig')();
const fluidContainerPlugin = require('./index.js');

const disabledModules = {};
Object.keys(defaultConfig.modules).forEach(module => {
  disabledModules[module] = false;
});

const generatePluginCss = (options = {}) => {
  return postcss(tailwindcss({
    screens: {
      'sm': '600px',
      'md': '800px',
      'lg': '1000px',
    },
    modules: disabledModules,
    plugins: [fluidContainerPlugin(options)],
  })).process('@tailwind components; @tailwind utilities;', {
    from: undefined,
  }).then(result => {
    return result.css;
  });
};

expect.extend({
  toMatchCss: cssMatcher,
});

test('options are not required', () => {
  return generatePluginCss().then(css => {
    expect(css).toMatchCss(`
      .c-container {
        margin-left: auto;
        margin-right: auto;
        padding-left: 15px;
        padding-right: 15px;
      }
      .px-container { padding-left: 15px; padding-right: 15px; }
      .pl-container { padding-left: 15px; }
      .pr-container { padding-right: 15px; }
      .mx-container { margin-left: 15px; margin-right: 15px; }
      .ml-container { margin-left: 15px; }
      .mr-container { margin-right: 15px; }
      .-mx-container { margin-left: -15px; margin-right: -15px; }
      .-ml-container { margin-left: -15px; }
      .-mr-container { margin-right: -15px; }
    `);
  });
});

test('you can set a maximum width and customize the padding', () => {
  return generatePluginCss({
    maxWidth: '1200px',
    padding: '30px',
  }).then(css => {
    expect(css).toMatchCss(`
      .c-container {
        margin-left: auto;
        margin-right: auto;
        max-width: 1200px;
        padding-left: 30px;
        padding-right: 30px;
      }
      .w-container { width: 1200px; }
      .min-w-container { min-width: 1200px; }
      .max-w-container { max-width: 1200px; }
      .px-container { padding-left: 30px; padding-right: 30px; }
      .pl-container { padding-left: 30px; }
      .pr-container { padding-right: 30px; }
      .mx-container { margin-left: 30px; margin-right: 30px; }
      .ml-container { margin-left: 30px; }
      .mr-container { margin-right: 30px; }
      .-mx-container { margin-left: -30px; margin-right: -30px; }
      .-ml-container { margin-left: -30px; }
      .-mr-container { margin-right: -30px; }
    `);
  });
});

test('you can customize the component prefix', () => {
  return generatePluginCss({
    componentPrefix: '',
  }).then(css => {
    expect(css).toMatchCss(`
      .container {
        margin-left: auto;
        margin-right: auto;
        padding-left: 15px;
        padding-right: 15px;
      }
      .px-container { padding-left: 15px; padding-right: 15px; }
      .pl-container { padding-left: 15px; }
      .pr-container { padding-right: 15px; }
      .mx-container { margin-left: 15px; margin-right: 15px; }
      .ml-container { margin-left: 15px; }
      .mr-container { margin-right: 15px; }
      .-mx-container { margin-left: -15px; margin-right: -15px; }
      .-ml-container { margin-left: -15px; }
      .-mr-container { margin-right: -15px; }
    `);
  });
});

test('you can change the padding at different screen sizes', () => {
  return generatePluginCss({
    responsivePadding: {
      'sm': '30px',
      'lg': '45px',
    },
  }).then(css => {
    expect(css).toMatchCss(`
      html {
        --container-padding: 15px;
        --container-padding-negative: calc(var(--container-padding) * -1);
      }
      @media (min-width: 600px) {
        html {
          --container-padding: 30px;
        }
      }
      @media (min-width: 1000px) {
        html {
          --container-padding: 45px;
        }
      }
      .c-container {
        margin-left: auto;
        margin-right: auto;
        padding-left: 15px;
        padding-left: var(--container-padding);
        padding-right: 15px;
        padding-right: var(--container-padding);
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
    `);
  });
});

test('variants are supported', () => {
  return generatePluginCss({
    variants: ['hover'],
  }).then(css => {
    expect(css).toMatchCss(`
      .c-container {
        margin-left: auto;
        margin-right: auto;
        padding-left: 15px;
        padding-right: 15px;
      }
      .px-container { padding-left: 15px; padding-right: 15px; }
      .pl-container { padding-left: 15px; }
      .pr-container { padding-right: 15px; }
      .mx-container { margin-left: 15px; margin-right: 15px; }
      .ml-container { margin-left: 15px; }
      .mr-container { margin-right: 15px; }
      .-mx-container { margin-left: -15px; margin-right: -15px; }
      .-ml-container { margin-left: -15px; }
      .-mr-container { margin-right: -15px; }
      .hover\\:px-container:hover { padding-left: 15px; padding-right: 15px; }
      .hover\\:pl-container:hover { padding-left: 15px; }
      .hover\\:pr-container:hover { padding-right: 15px; }
      .hover\\:mx-container:hover { margin-left: 15px; margin-right: 15px; }
      .hover\\:ml-container:hover { margin-left: 15px; }
      .hover\\:mr-container:hover { margin-right: 15px; }
      .hover\\:-mx-container:hover { margin-left: -15px; margin-right: -15px; }
      .hover\\:-ml-container:hover { margin-left: -15px; }
      .hover\\:-mr-container:hover { margin-right: -15px; }
    `);
  });
});

test('you can generate multiple containers', () => {
  return generatePluginCss({
    maxWidth: '1000px',
    componentPrefix: 'custom-',
    variants: ['active'],
    containers: {
      'content': {
        maxWidth: '1200px',
      },
      'content-large': {
        maxWidth: '1400px',
        padding: '30px',
        responsivePadding: {
          'md': '10vw',
        },
        componentPrefix: 'c-',
        variants: [],
      }
    }
  }).then(css => {
    expect(css).toMatchCss(`
      .custom-content {
        margin-left: auto;
        margin-right: auto;
        max-width: 1200px;
        padding-left: 15px;
        padding-right: 15px;
      }
      html {
        --content-large-padding: 30px;
        --content-large-padding-negative: calc(var(--content-large-padding) * -1);
      }
      @media (min-width: 800px) {
        html {
          --content-large-padding: 10vw;
        }
      }
      .c-content-large {
        margin-left: auto;
        margin-right: auto;
        max-width: 1400px;
        padding-left: 30px;
        padding-left: var(--content-large-padding);
        padding-right: 30px;
        padding-right: var(--content-large-padding);
      }
      .w-content { width: 1200px; }
      .min-w-content { min-width: 1200px; }
      .max-w-content { max-width: 1200px; }
      .active\\:w-content:active { width: 1200px; }
      .active\\:min-w-content:active { min-width: 1200px; }
      .active\\:max-w-content:active { max-width: 1200px; }
      .px-content { padding-left: 15px; padding-right: 15px; }
      .pl-content { padding-left: 15px; }
      .pr-content { padding-right: 15px; }
      .mx-content { margin-left: 15px; margin-right: 15px; }
      .ml-content { margin-left: 15px; }
      .mr-content { margin-right: 15px; }
      .-mx-content { margin-left: -15px; margin-right: -15px; }
      .-ml-content { margin-left: -15px; }
      .-mr-content { margin-right: -15px; }
      .active\\:px-content:active { padding-left: 15px; padding-right: 15px; }
      .active\\:pl-content:active { padding-left: 15px; }
      .active\\:pr-content:active { padding-right: 15px; }
      .active\\:mx-content:active { margin-left: 15px; margin-right: 15px; }
      .active\\:ml-content:active { margin-left: 15px; }
      .active\\:mr-content:active { margin-right: 15px; }
      .active\\:-mx-content:active { margin-left: -15px; margin-right: -15px; }
      .active\\:-ml-content:active { margin-left: -15px; }
      .active\\:-mr-content:active { margin-right: -15px; }
      .w-content-large { width: 1400px; }
      .min-w-content-large { min-width: 1400px; }
      .max-w-content-large { max-width: 1400px; }
      .px-content-large {
        padding-left: 30px;
        padding-left: var(--content-large-padding);
        padding-right: 30px;
        padding-right: var(--content-large-padding);
      }
      .pl-content-large {
        padding-left: 30px;
        padding-left: var(--content-large-padding);
      }
      .pr-content-large {
        padding-right: 30px;
        padding-right: var(--content-large-padding);
      }
      .mx-content-large {
        margin-left: 30px;
        margin-left: var(--content-large-padding);
        margin-right: 30px;
        margin-right: var(--content-large-padding);
      }
      .ml-content-large {
        margin-left: 30px;
        margin-left: var(--content-large-padding);
      }
      .mr-content-large {
        margin-right: 30px;
        margin-right: var(--content-large-padding);
      }
      .-mx-content-large {
        margin-left: -30px;
        margin-left: var(--content-large-padding-negative);
        margin-right: -30px;
        margin-right: var(--content-large-padding-negative);
      }
      .-ml-content-large {
        margin-left: -30px;
        margin-left: var(--content-large-padding-negative);
      }
      .-mr-content-large {
        margin-right: -30px;
        margin-right: var(--content-large-padding-negative);
      }
    `);
  });
});
