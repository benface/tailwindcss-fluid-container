const _ = require('lodash');
const cssMatcher = require('jest-matcher-css');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const defaultConfig = require('tailwindcss/defaultConfig');
const fluidContainerPlugin = require('./index.js');

const generatePluginCss = (config, pluginOptions = {}) => {
  return postcss(
    tailwindcss(
      _.merge({
        theme: {
          screens: {
            'sm': '640px',
          },
        },
        corePlugins: false,
        plugins: [
          fluidContainerPlugin(pluginOptions),
        ],
      }, config)
    )
  )
  .process('@tailwind base; @tailwind components; @tailwind utilities', {
    from: undefined,
  })
  .then(result => {
    return result.css;
  });
};

expect.extend({
  toMatchCss: cssMatcher,
});

test('the plugin generates a component, some utilities, and responsive variants by default', () => {
  return generatePluginCss().then(css => {
    expect(css).toMatchCss(`
      .c-container {
        margin-left: auto;
        margin-right: auto;
        padding-left: 15px;
        padding-right: 15px
      }
      .px-container { padding-left: 15px; padding-right: 15px }
      .pl-container { padding-left: 15px }
      .pr-container { padding-right: 15px }
      .mx-container { margin-left: 15px; margin-right: 15px }
      .ml-container { margin-left: 15px }
      .mr-container { margin-right: 15px }
      .-mx-container { margin-left: -15px; margin-right: -15px }
      .-ml-container { margin-left: -15px }
      .-mr-container { margin-right: -15px }
      @media (min-width: 640px) {
        .sm\\:px-container { padding-left: 15px; padding-right: 15px }
        .sm\\:pl-container { padding-left: 15px }
        .sm\\:pr-container { padding-right: 15px }
        .sm\\:mx-container { margin-left: 15px; margin-right: 15px }
        .sm\\:ml-container { margin-left: 15px }
        .sm\\:mr-container { margin-right: 15px }
        .sm\\:-mx-container { margin-left: -15px; margin-right: -15px }
        .sm\\:-ml-container { margin-left: -15px }
        .sm\\:-mr-container { margin-right: -15px }
      }
    `);
  });
});

test('the utilities can be disabled', () => {
  return generatePluginCss({}, {
    widthUtilities: false,
    paddingUtilities: false,
    marginUtilities: false,
    negativeMarginUtilities: false,
  }).then(css => {
    expect(css).toMatchCss(`
      .c-container {
        margin-left: auto;
        margin-right: auto;
        padding-left: 15px;
        padding-right: 15px
      }
    `);
  });
});

test('the container can be customized', () => {
  return generatePluginCss({
    theme: {
      fluidContainer: {
        'default': {
          maxWidth: '1200px',
          padding: '30px',
        },
      },
    },
    variants: {
      fluidContainer: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .c-container {
        margin-left: auto;
        margin-right: auto;
        max-width: 1200px;
        padding-left: 30px;
        padding-right: 30px
      }
      .w-container { width: 1200px }
      .min-w-container { min-width: 1200px }
      .max-w-container { max-width: 1200px }
      .px-container { padding-left: 30px; padding-right: 30px }
      .pl-container { padding-left: 30px }
      .pr-container { padding-right: 30px }
      .mx-container { margin-left: 30px; margin-right: 30px }
      .ml-container { margin-left: 30px }
      .mr-container { margin-right: 30px }
      .-mx-container { margin-left: -30px; margin-right: -30px }
      .-ml-container { margin-left: -30px }
      .-mr-container { margin-right: -30px }
    `);
  });
});

test('the component prefix is customizable', () => {
  return generatePluginCss({
    variants: {
      fluidContainer: [],
    },
  }, {
    componentPrefix: '',
  }).then(css => {
    expect(css).toMatchCss(`
      .container {
        margin-left: auto;
        margin-right: auto;
        padding-left: 15px;
        padding-right: 15px
      }
      .px-container { padding-left: 15px; padding-right: 15px }
      .pl-container { padding-left: 15px }
      .pr-container { padding-right: 15px }
      .mx-container { margin-left: 15px; margin-right: 15px }
      .ml-container { margin-left: 15px }
      .mr-container { margin-right: 15px }
      .-mx-container { margin-left: -15px; margin-right: -15px }
      .-ml-container { margin-left: -15px }
      .-mr-container { margin-right: -15px }
    `);
  });
});

test('the padding can be responsive', () => {
  return generatePluginCss({
    theme: {
      fluidContainer: {
        'default': {
          responsivePadding: {
            'sm': '30px',
          },
        },
      },
    },
  }).then(css => {
    expect(css).toMatchCss(`
      html {
        --container-padding: 15px;
        --container-padding-negative: calc(var(--container-padding) * -1)
      }
      @media (min-width: 640px) {
        html {
          --container-padding: 30px
        }
      }
      .c-container {
        margin-left: auto;
        margin-right: auto;
        padding-left: 15px;
        padding-left: var(--container-padding);
        padding-right: 15px;
        padding-right: var(--container-padding)
      }
      .px-container {
        padding-left: 15px;
        padding-left: var(--container-padding);
        padding-right: 15px;
        padding-right: var(--container-padding)
      }
      .pl-container {
        padding-left: 15px;
        padding-left: var(--container-padding)
      }
      .pr-container {
        padding-right: 15px;
        padding-right: var(--container-padding)
      }
      .mx-container {
        margin-left: 15px;
        margin-left: var(--container-padding);
        margin-right: 15px;
        margin-right: var(--container-padding)
      }
      .ml-container {
        margin-left: 15px;
        margin-left: var(--container-padding)
      }
      .mr-container {
        margin-right: 15px;
        margin-right: var(--container-padding)
      }
      .-mx-container {
        margin-left: -15px;
        margin-left: var(--container-padding-negative);
        margin-right: -15px;
        margin-right: var(--container-padding-negative)
      }
      .-ml-container {
        margin-left: -15px;
        margin-left: var(--container-padding-negative)
      }
      .-mr-container {
        margin-right: -15px;
        margin-right: var(--container-padding-negative)
      }
      @media (min-width: 640px) {
        .sm\\:px-container {
          padding-left: 15px;
          padding-left: var(--container-padding);
          padding-right: 15px;
          padding-right: var(--container-padding)
        }
        .sm\\:pl-container {
          padding-left: 15px;
          padding-left: var(--container-padding)
        }
        .sm\\:pr-container {
          padding-right: 15px;
          padding-right: var(--container-padding)
        }
        .sm\\:mx-container {
          margin-left: 15px;
          margin-left: var(--container-padding);
          margin-right: 15px;
          margin-right: var(--container-padding)
        }
        .sm\\:ml-container {
          margin-left: 15px;
          margin-left: var(--container-padding)
        }
        .sm\\:mr-container {
          margin-right: 15px;
          margin-right: var(--container-padding)
        }
        .sm\\:-mx-container {
          margin-left: -15px;
          margin-left: var(--container-padding-negative);
          margin-right: -15px;
          margin-right: var(--container-padding-negative)
        }
        .sm\\:-ml-container {
          margin-left: -15px;
          margin-left: var(--container-padding-negative)
        }
        .sm\\:-mr-container {
          margin-right: -15px;
          margin-right: var(--container-padding-negative)
        }
      }
    `);
  });
});

test('variants can be customized', () => {
  return generatePluginCss({
    variants: {
      fluidContainer: ['hover'],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .c-container {
        margin-left: auto;
        margin-right: auto;
        padding-left: 15px;
        padding-right: 15px
      }
      .px-container { padding-left: 15px; padding-right: 15px }
      .pl-container { padding-left: 15px }
      .pr-container { padding-right: 15px }
      .hover\\:px-container:hover { padding-left: 15px; padding-right: 15px }
      .hover\\:pl-container:hover { padding-left: 15px }
      .hover\\:pr-container:hover { padding-right: 15px }
      .mx-container { margin-left: 15px; margin-right: 15px }
      .ml-container { margin-left: 15px }
      .mr-container { margin-right: 15px }
      .hover\\:mx-container:hover { margin-left: 15px; margin-right: 15px }
      .hover\\:ml-container:hover { margin-left: 15px }
      .hover\\:mr-container:hover { margin-right: 15px }
      .-mx-container { margin-left: -15px; margin-right: -15px }
      .-ml-container { margin-left: -15px }
      .-mr-container { margin-right: -15px }
      .hover\\:-mx-container:hover { margin-left: -15px; margin-right: -15px }
      .hover\\:-ml-container:hover { margin-left: -15px }
      .hover\\:-mr-container:hover { margin-right: -15px }
    `);
  });
});

test('multiple containers can be generated', () => {
  return generatePluginCss({
    theme: {
      fluidContainer: {
        'sm': {
          maxWidth: '1200px',
        },
        'lg': {
          maxWidth: '1400px',
          padding: '30px',
          responsivePadding: {
            'sm': '10vw',
          },
        }
      },
    },
  }, {
    componentPrefix: 'custom-',
  }).then(css => {
    expect(css).toMatchCss(`
      html {
        --container-lg-padding: 30px;
        --container-lg-padding-negative: calc(var(--container-lg-padding) * -1)
      }
      @media (min-width: 640px) {
        html {
          --container-lg-padding: 10vw
        }
      }
      .custom-container-sm {
        margin-left: auto;
        margin-right: auto;
        max-width: 1200px;
        padding-left: 15px;
        padding-right: 15px
      }
      .custom-container-lg {
        margin-left: auto;
        margin-right: auto;
        max-width: 1400px;
        padding-left: 30px;
        padding-left: var(--container-lg-padding);
        padding-right: 30px;
        padding-right: var(--container-lg-padding)
      }
      .w-container-sm { width: 1200px }
      .min-w-container-sm { min-width: 1200px }
      .max-w-container-sm { max-width: 1200px }
      .px-container-sm { padding-left: 15px; padding-right: 15px }
      .pl-container-sm { padding-left: 15px }
      .pr-container-sm { padding-right: 15px }
      .mx-container-sm { margin-left: 15px; margin-right: 15px }
      .ml-container-sm { margin-left: 15px }
      .mr-container-sm { margin-right: 15px }
      .-mx-container-sm { margin-left: -15px; margin-right: -15px }
      .-ml-container-sm { margin-left: -15px }
      .-mr-container-sm { margin-right: -15px }
      .w-container-lg { width: 1400px }
      .min-w-container-lg { min-width: 1400px }
      .max-w-container-lg { max-width: 1400px }
      .px-container-lg {
        padding-left: 30px;
        padding-left: var(--container-lg-padding);
        padding-right: 30px;
        padding-right: var(--container-lg-padding)
      }
      .pl-container-lg {
        padding-left: 30px;
        padding-left: var(--container-lg-padding)
      }
      .pr-container-lg {
        padding-right: 30px;
        padding-right: var(--container-lg-padding)
      }
      .mx-container-lg {
        margin-left: 30px;
        margin-left: var(--container-lg-padding);
        margin-right: 30px;
        margin-right: var(--container-lg-padding)
      }
      .ml-container-lg {
        margin-left: 30px;
        margin-left: var(--container-lg-padding)
      }
      .mr-container-lg {
        margin-right: 30px;
        margin-right: var(--container-lg-padding)
      }
      .-mx-container-lg {
        margin-left: -30px;
        margin-left: var(--container-lg-padding-negative);
        margin-right: -30px;
        margin-right: var(--container-lg-padding-negative)
      }
      .-ml-container-lg {
        margin-left: -30px;
        margin-left: var(--container-lg-padding-negative)
      }
      .-mr-container-lg {
        margin-right: -30px;
        margin-right: var(--container-lg-padding-negative)
      }
      @media (min-width: 640px) {
        .sm\\:w-container-sm { width: 1200px }
        .sm\\:min-w-container-sm { min-width: 1200px }
        .sm\\:max-w-container-sm { max-width: 1200px }
        .sm\\:px-container-sm { padding-left: 15px; padding-right: 15px }
        .sm\\:pl-container-sm { padding-left: 15px }
        .sm\\:pr-container-sm { padding-right: 15px }
        .sm\\:mx-container-sm { margin-left: 15px; margin-right: 15px }
        .sm\\:ml-container-sm { margin-left: 15px }
        .sm\\:mr-container-sm { margin-right: 15px }
        .sm\\:-mx-container-sm { margin-left: -15px; margin-right: -15px }
        .sm\\:-ml-container-sm { margin-left: -15px }
        .sm\\:-mr-container-sm { margin-right: -15px }
        .sm\\:w-container-lg { width: 1400px }
        .sm\\:min-w-container-lg { min-width: 1400px }
        .sm\\:max-w-container-lg { max-width: 1400px }
        .sm\\:px-container-lg {
          padding-left: 30px;
          padding-left: var(--container-lg-padding);
          padding-right: 30px;
          padding-right: var(--container-lg-padding)
        }
        .sm\\:pl-container-lg {
          padding-left: 30px;
          padding-left: var(--container-lg-padding)
        }
        .sm\\:pr-container-lg {
          padding-right: 30px;
          padding-right: var(--container-lg-padding)
        }
        .sm\\:mx-container-lg {
          margin-left: 30px;
          margin-left: var(--container-lg-padding);
          margin-right: 30px;
          margin-right: var(--container-lg-padding)
        }
        .sm\\:ml-container-lg {
          margin-left: 30px;
          margin-left: var(--container-lg-padding)
        }
        .sm\\:mr-container-lg {
          margin-right: 30px;
          margin-right: var(--container-lg-padding)
        }
        .sm\\:-mx-container-lg {
          margin-left: -30px;
          margin-left: var(--container-lg-padding-negative);
          margin-right: -30px;
          margin-right: var(--container-lg-padding-negative)
        }
        .sm\\:-ml-container-lg {
          margin-left: -30px;
          margin-left: var(--container-lg-padding-negative)
        }
        .sm\\:-mr-container-lg {
          margin-right: -30px;
          margin-right: var(--container-lg-padding-negative)
        }
      }
    `);
  });
});
