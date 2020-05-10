const _ = require('lodash');
const cssMatcher = require('jest-matcher-css');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
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
        padding-right: 15px;
      }
      .p-container { padding: 15px; }
      .py-container { padding-top: 15px; padding-bottom: 15px; }
      .px-container { padding-left: 15px; padding-right: 15px; }
      .pt-container { padding-top: 15px; }
      .pr-container { padding-right: 15px; }
      .pb-container { padding-bottom: 15px; }
      .pl-container { padding-left: 15px; }
      .m-container { margin: 15px; }
      .my-container { margin-top: 15px; margin-bottom: 15px; }
      .mx-container { margin-left: 15px; margin-right: 15px; }
      .mt-container { margin-top: 15px; }
      .mr-container { margin-right: 15px; }
      .mb-container { margin-bottom: 15px; }
      .ml-container { margin-left: 15px; }
      .-m-container { margin: -15px; }
      .-my-container { margin-top: -15px; margin-bottom: -15px; }
      .-mx-container { margin-left: -15px; margin-right: -15px; }
      .-mt-container { margin-top: -15px; }
      .-mr-container { margin-right: -15px; }
      .-mb-container { margin-bottom: -15px; }
      .-ml-container { margin-left: -15px; }
      @media (min-width: 640px) {
        .sm\\:p-container { padding: 15px; }
        .sm\\:py-container { padding-top: 15px; padding-bottom: 15px; }
        .sm\\:px-container { padding-left: 15px; padding-right: 15px; }
        .sm\\:pt-container { padding-top: 15px; }
        .sm\\:pr-container { padding-right: 15px; }
        .sm\\:pb-container { padding-bottom: 15px; }
        .sm\\:pl-container { padding-left: 15px; }
        .sm\\:m-container { margin: 15px; }
        .sm\\:my-container { margin-top: 15px; margin-bottom: 15px; }
        .sm\\:mx-container { margin-left: 15px; margin-right: 15px; }
        .sm\\:mt-container { margin-top: 15px; }
        .sm\\:mr-container { margin-right: 15px; }
        .sm\\:mb-container { margin-bottom: 15px; }
        .sm\\:ml-container { margin-left: 15px; }
        .sm\\:-m-container { margin: -15px; }
        .sm\\:-my-container { margin-top: -15px; margin-bottom: -15px; }
        .sm\\:-mx-container { margin-left: -15px; margin-right: -15px; }
        .sm\\:-mt-container { margin-top: -15px; }
        .sm\\:-mr-container { margin-right: -15px; }
        .sm\\:-mb-container { margin-bottom: -15px; }
        .sm\\:-ml-container { margin-left: -15px; }
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
        padding-right: 15px;
      }
    `);
  });
});

test('the max width and padding can be customized', () => {
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
        padding-right: 30px;
      }
      .w-container { width: 1200px; }
      .min-w-container { min-width: 1200px; }
      .max-w-container { max-width: 1200px; }
      .p-container { padding: 30px; }
      .py-container { padding-top: 30px; padding-bottom: 30px; }
      .px-container { padding-left: 30px; padding-right: 30px; }
      .pt-container { padding-top: 30px; }
      .pr-container { padding-right: 30px; }
      .pb-container { padding-bottom: 30px; }
      .pl-container { padding-left: 30px; }
      .m-container { margin: 30px; }
      .my-container { margin-top: 30px; margin-bottom: 30px; }
      .mx-container { margin-left: 30px; margin-right: 30px; }
      .mt-container { margin-top: 30px; }
      .mr-container { margin-right: 30px; }
      .mb-container { margin-bottom: 30px; }
      .ml-container { margin-left: 30px; }
      .-m-container { margin: -30px; }
      .-my-container { margin-top: -30px; margin-bottom: -30px; }
      .-mx-container { margin-left: -30px; margin-right: -30px; }
      .-mt-container { margin-top: -30px; }
      .-mr-container { margin-right: -30px; }
      .-mb-container { margin-bottom: -30px; }
      .-ml-container { margin-left: -30px; }
    `);
  });
});

test('the component prefix can be customized', () => {
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
        padding-right: 15px;
      }
      .p-container { padding: 15px; }
      .py-container { padding-top: 15px; padding-bottom: 15px; }
      .px-container { padding-left: 15px; padding-right: 15px; }
      .pt-container { padding-top: 15px; }
      .pr-container { padding-right: 15px; }
      .pb-container { padding-bottom: 15px; }
      .pl-container { padding-left: 15px; }
      .m-container { margin: 15px; }
      .my-container { margin-top: 15px; margin-bottom: 15px; }
      .mx-container { margin-left: 15px; margin-right: 15px; }
      .mt-container { margin-top: 15px; }
      .mr-container { margin-right: 15px; }
      .mb-container { margin-bottom: 15px; }
      .ml-container { margin-left: 15px; }
      .-m-container { margin: -15px; }
      .-my-container { margin-top: -15px; margin-bottom: -15px; }
      .-mx-container { margin-left: -15px; margin-right: -15px; }
      .-mt-container { margin-top: -15px; }
      .-mr-container { margin-right: -15px; }
      .-mb-container { margin-bottom: -15px; }
      .-ml-container { margin-left: -15px; }
    `);
  });
});

test('the max width and padding can be set to objects', () => {
  return generatePluginCss({
    theme: {
      fluidContainer: {
        'default': {
          maxWidth: {
            default: '800px',
          },
          padding: {
            default: '30px',
          },
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
        max-width: 800px;
        padding-left: 30px;
        padding-right: 30px;
      }
      .w-container {
        width: 800px;
      }
      .min-w-container {
        min-width: 800px;
      }
      .max-w-container {
        max-width: 800px;
      }
      .p-container { padding: 30px; }
      .py-container { padding-top: 30px; padding-bottom: 30px; }
      .px-container { padding-left: 30px; padding-right: 30px; }
      .pt-container { padding-top: 30px; }
      .pr-container { padding-right: 30px; }
      .pb-container { padding-bottom: 30px; }
      .pl-container { padding-left: 30px; }
      .m-container { margin: 30px; }
      .my-container { margin-top: 30px; margin-bottom: 30px; }
      .mx-container { margin-left: 30px; margin-right: 30px; }
      .mt-container { margin-top: 30px; }
      .mr-container { margin-right: 30px; }
      .mb-container { margin-bottom: 30px; }
      .ml-container { margin-left: 30px; }
      .-m-container { margin: -30px; }
      .-my-container { margin-top: -30px; margin-bottom: -30px; }
      .-mx-container { margin-left: -30px; margin-right: -30px; }
      .-mt-container { margin-top: -30px; }
      .-mr-container { margin-right: -30px; }
      .-mb-container { margin-bottom: -30px; }
      .-ml-container { margin-left: -30px; }
    `);
  });
});

test('the max width and padding can be set to empty objects', () => {
  return generatePluginCss({
    theme: {
      fluidContainer: {
        'default': {
          maxWidth: {},
          padding: {},
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
      }
    `);
  });
});

test('the max width and padding can be set to null', () => {
  return generatePluginCss({
    theme: {
      fluidContainer: {
        'default': {
          maxWidth: null,
          padding: null,
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
      }
    `);
  });
});

test('the max width can be responsive', () => {
  return generatePluginCss({
    theme: {
      fluidContainer: {
        'default': {
          maxWidth: {
            default: '800px',
            sm: '1200px',
          },
        },
      },
    },
    variants: {
      fluidContainer: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      html {
        --container-max-width: 800px;
      }
      @media (min-width: 640px) {
        html {
          --container-max-width: 1200px;
        }
      }
      .c-container {
        margin-left: auto;
        margin-right: auto;
        max-width: 800px;
        max-width: var(--container-max-width);
        padding-left: 15px;
        padding-right: 15px;
      }
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
      .p-container { padding: 15px; }
      .py-container { padding-top: 15px; padding-bottom: 15px; }
      .px-container { padding-left: 15px; padding-right: 15px; }
      .pt-container { padding-top: 15px; }
      .pr-container { padding-right: 15px; }
      .pb-container { padding-bottom: 15px; }
      .pl-container { padding-left: 15px; }
      .m-container { margin: 15px; }
      .my-container { margin-top: 15px; margin-bottom: 15px; }
      .mx-container { margin-left: 15px; margin-right: 15px; }
      .mt-container { margin-top: 15px; }
      .mr-container { margin-right: 15px; }
      .mb-container { margin-bottom: 15px; }
      .ml-container { margin-left: 15px; }
      .-m-container { margin: -15px; }
      .-my-container { margin-top: -15px; margin-bottom: -15px; }
      .-mx-container { margin-left: -15px; margin-right: -15px; }
      .-mt-container { margin-top: -15px; }
      .-mr-container { margin-right: -15px; }
      .-mb-container { margin-bottom: -15px; }
      .-ml-container { margin-left: -15px; }
    `);
  });
});

test('the padding can be responsive', () => {
  return generatePluginCss({
    theme: {
      fluidContainer: {
        'default': {
          padding: {
            default: '20px',
            sm: '30px',
          },
        },
      },
    },
    variants: {
      fluidContainer: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      html {
        --container-padding: 20px;
        --container-padding-negative: calc(var(--container-padding) * -1);
      }
      @media (min-width: 640px) {
        html {
          --container-padding: 30px;
        }
      }
      .c-container {
        margin-left: auto;
        margin-right: auto;
        padding-left: 20px;
        padding-left: var(--container-padding);
        padding-right: 20px;
        padding-right: var(--container-padding);
      }
      .p-container {
        padding: 20px;
        padding: var(--container-padding);
      }
      .py-container {
        padding-top: 20px;
        padding-top: var(--container-padding);
        padding-bottom: 20px;
        padding-bottom: var(--container-padding);
      }
      .px-container {
        padding-left: 20px;
        padding-left: var(--container-padding);
        padding-right: 20px;
        padding-right: var(--container-padding);
      }
      .pt-container {
        padding-top: 20px;
        padding-top: var(--container-padding);
      }
      .pr-container {
        padding-right: 20px;
        padding-right: var(--container-padding);
      }
      .pb-container {
        padding-bottom: 20px;
        padding-bottom: var(--container-padding);
      }
      .pl-container {
        padding-left: 20px;
        padding-left: var(--container-padding);
      }
      .m-container {
        margin: 20px;
        margin: var(--container-padding);
      }
      .my-container {
        margin-top: 20px;
        margin-top: var(--container-padding);
        margin-bottom: 20px;
        margin-bottom: var(--container-padding);
      }
      .mx-container {
        margin-left: 20px;
        margin-left: var(--container-padding);
        margin-right: 20px;
        margin-right: var(--container-padding);
      }
      .mt-container {
        margin-top: 20px;
        margin-top: var(--container-padding);
      }
      .mr-container {
        margin-right: 20px;
        margin-right: var(--container-padding);
      }
      .mb-container {
        margin-bottom: 20px;
        margin-bottom: var(--container-padding);
      }
      .ml-container {
        margin-left: 20px;
        margin-left: var(--container-padding);
      }
      .-m-container {
        margin: -20px;
        margin: var(--container-padding-negative);
      }
      .-my-container {
        margin-top: -20px;
        margin-top: var(--container-padding-negative);
        margin-bottom: -20px;
        margin-bottom: var(--container-padding-negative);
      }
      .-mx-container {
        margin-left: -20px;
        margin-left: var(--container-padding-negative);
        margin-right: -20px;
        margin-right: var(--container-padding-negative);
      }
      .-mt-container {
        margin-top: -20px;
        margin-top: var(--container-padding-negative);
      }
      .-mr-container {
        margin-right: -20px;
        margin-right: var(--container-padding-negative);
      }
      .-mb-container {
        margin-bottom: -20px;
        margin-bottom: var(--container-padding-negative);
      }
      .-ml-container {
        margin-left: -20px;
        margin-left: var(--container-padding-negative);
      }
    `);
  });
});

test('both the max width and the padding can be responsive at the same time', () => {
  return generatePluginCss({
    theme: {
      fluidContainer: {
        'default': {
          maxWidth: {
            sm: '1200px',
            default: '800px',
          },
          padding: {
            sm: '30px',
          },
        },
      },
    },
    variants: {
      fluidContainer: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      html {
        --container-max-width: 800px;
        --container-padding-negative: calc(var(--container-padding) * -1);
      }
      @media (min-width: 640px) {
        html {
          --container-max-width: 1200px;
          --container-padding: 30px;
        }
      }
      .c-container {
        margin-left: auto;
        margin-right: auto;
        max-width: 800px;
        max-width: var(--container-max-width);
        padding-left: var(--container-padding);
        padding-right: var(--container-padding);
      }
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
      .p-container {
        padding: var(--container-padding);
      }
      .py-container {
        padding-top: var(--container-padding);
        padding-bottom: var(--container-padding);
      }
      .px-container {
        padding-left: var(--container-padding);
        padding-right: var(--container-padding);
      }
      .pt-container {
        padding-top: var(--container-padding);
      }
      .pr-container {
        padding-right: var(--container-padding);
      }
      .pb-container {
        padding-bottom: var(--container-padding);
      }
      .pl-container {
        padding-left: var(--container-padding);
      }
      .m-container {
        margin: var(--container-padding);
      }
      .my-container {
        margin-top: var(--container-padding);
        margin-bottom: var(--container-padding);
      }
      .mx-container {
        margin-left: var(--container-padding);
        margin-right: var(--container-padding);
      }
      .mt-container {
        margin-top: var(--container-padding);
      }
      .mr-container {
        margin-right: var(--container-padding);
      }
      .mb-container {
        margin-bottom: var(--container-padding);
      }
      .ml-container {
        margin-left: var(--container-padding);
      }
      .-m-container {
        margin: var(--container-padding-negative);
      }
      .-my-container {
        margin-top: var(--container-padding-negative);
        margin-bottom: var(--container-padding-negative);
      }
      .-mx-container {
        margin-left: var(--container-padding-negative);
        margin-right: var(--container-padding-negative);
      }
      .-mt-container {
        margin-top: var(--container-padding-negative);
      }
      .-mr-container {
        margin-right: var(--container-padding-negative);
      }
      .-mb-container {
        margin-bottom: var(--container-padding-negative);
      }
      .-ml-container {
        margin-left: var(--container-padding-negative);
      }
    `);
  });
});

test('arbitrary screen sizes are allowed in responsive max width and padding', () => {
  return generatePluginCss({
    theme: {
      fluidContainer: {
        'default': {
          maxWidth: {
            default: '800px',
            '400px': '1200px',
          },
          padding: {
            default: '20px',
            '800px': '30px',
          },
        },
      },
    },
  }).then(css => {
    expect(css).toMatchCss(`
      html {
        --container-max-width: 800px;
        --container-padding: 20px;
        --container-padding-negative: calc(var(--container-padding) * -1);
      }
      @media (min-width: 400px) {
        html {
          --container-max-width: 1200px;
        }
      }
      @media (min-width: 800px) {
        html {
          --container-padding: 30px;
        }
      }
      .c-container {
        margin-left: auto;
        margin-right: auto;
        max-width: 800px;
        max-width: var(--container-max-width);
        padding-left: 20px;
        padding-left: var(--container-padding);
        padding-right: 20px;
        padding-right: var(--container-padding);
      }
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
      .p-container {
        padding: 20px;
        padding: var(--container-padding);
      }
      .py-container {
        padding-top: 20px;
        padding-top: var(--container-padding);
        padding-bottom: 20px;
        padding-bottom: var(--container-padding);
      }
      .px-container {
        padding-left: 20px;
        padding-left: var(--container-padding);
        padding-right: 20px;
        padding-right: var(--container-padding);
      }
      .pt-container {
        padding-top: 20px;
        padding-top: var(--container-padding);
      }
      .pr-container {
        padding-right: 20px;
        padding-right: var(--container-padding);
      }
      .pb-container {
        padding-bottom: 20px;
        padding-bottom: var(--container-padding);
      }
      .pl-container {
        padding-left: 20px;
        padding-left: var(--container-padding);
      }
      .m-container {
        margin: 20px;
        margin: var(--container-padding);
      }
      .my-container {
        margin-top: 20px;
        margin-top: var(--container-padding);
        margin-bottom: 20px;
        margin-bottom: var(--container-padding);
      }
      .mx-container {
        margin-left: 20px;
        margin-left: var(--container-padding);
        margin-right: 20px;
        margin-right: var(--container-padding);
      }
      .mt-container {
        margin-top: 20px;
        margin-top: var(--container-padding);
      }
      .mr-container {
        margin-right: 20px;
        margin-right: var(--container-padding);
      }
      .mb-container {
        margin-bottom: 20px;
        margin-bottom: var(--container-padding);
      }
      .ml-container {
        margin-left: 20px;
        margin-left: var(--container-padding);
      }
      .-m-container {
        margin: -20px;
        margin: var(--container-padding-negative);
      }
      .-my-container {
        margin-top: -20px;
        margin-top: var(--container-padding-negative);
        margin-bottom: -20px;
        margin-bottom: var(--container-padding-negative);
      }
      .-mx-container {
        margin-left: -20px;
        margin-left: var(--container-padding-negative);
        margin-right: -20px;
        margin-right: var(--container-padding-negative);
      }
      .-mt-container {
        margin-top: -20px;
        margin-top: var(--container-padding-negative);
      }
      .-mr-container {
        margin-right: -20px;
        margin-right: var(--container-padding-negative);
      }
      .-mb-container {
        margin-bottom: -20px;
        margin-bottom: var(--container-padding-negative);
      }
      .-ml-container {
        margin-left: -20px;
        margin-left: var(--container-padding-negative);
      }
      @media (min-width: 640px) {
        .sm\\:w-container {
          width: 800px;
          width: var(--container-max-width);
        }
        .sm\\:min-w-container {
          min-width: 800px;
          min-width: var(--container-max-width);
        }
        .sm\\:max-w-container {
          max-width: 800px;
          max-width: var(--container-max-width);
        }
        .sm\\:p-container {
          padding: 20px;
          padding: var(--container-padding);
        }
        .sm\\:py-container {
          padding-top: 20px;
          padding-top: var(--container-padding);
          padding-bottom: 20px;
          padding-bottom: var(--container-padding);
        }
        .sm\\:px-container {
          padding-left: 20px;
          padding-left: var(--container-padding);
          padding-right: 20px;
          padding-right: var(--container-padding);
        }
        .sm\\:pt-container {
          padding-top: 20px;
          padding-top: var(--container-padding);
        }
        .sm\\:pr-container {
          padding-right: 20px;
          padding-right: var(--container-padding);
        }
        .sm\\:pb-container {
          padding-bottom: 20px;
          padding-bottom: var(--container-padding);
        }
        .sm\\:pl-container {
          padding-left: 20px;
          padding-left: var(--container-padding);
        }
        .sm\\:m-container {
          margin: 20px;
          margin: var(--container-padding);
        }
        .sm\\:my-container {
          margin-top: 20px;
          margin-top: var(--container-padding);
          margin-bottom: 20px;
          margin-bottom: var(--container-padding);
        }
        .sm\\:mx-container {
          margin-left: 20px;
          margin-left: var(--container-padding);
          margin-right: 20px;
          margin-right: var(--container-padding);
        }
        .sm\\:mt-container {
          margin-top: 20px;
          margin-top: var(--container-padding);
        }
        .sm\\:mr-container {
          margin-right: 20px;
          margin-right: var(--container-padding);
        }
        .sm\\:mb-container {
          margin-bottom: 20px;
          margin-bottom: var(--container-padding);
        }
        .sm\\:ml-container {
          margin-left: 20px;
          margin-left: var(--container-padding);
        }
        .sm\\:-m-container {
          margin: -20px;
          margin: var(--container-padding-negative);
        }
        .sm\\:-my-container {
          margin-top: -20px;
          margin-top: var(--container-padding-negative);
          margin-bottom: -20px;
          margin-bottom: var(--container-padding-negative);
        }
        .sm\\:-mx-container {
          margin-left: -20px;
          margin-left: var(--container-padding-negative);
          margin-right: -20px;
          margin-right: var(--container-padding-negative);
        }
        .sm\\:-mt-container {
          margin-top: -20px;
          margin-top: var(--container-padding-negative);
        }
        .sm\\:-mr-container {
          margin-right: -20px;
          margin-right: var(--container-padding-negative);
        }
        .sm\\:-mb-container {
          margin-bottom: -20px;
          margin-bottom: var(--container-padding-negative);
        }
        .sm\\:-ml-container {
          margin-left: -20px;
          margin-left: var(--container-padding-negative);
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
        padding-right: 15px;
      }
      .p-container { padding: 15px; }
      .py-container { padding-top: 15px; padding-bottom: 15px; }
      .px-container { padding-left: 15px; padding-right: 15px; }
      .pt-container { padding-top: 15px; }
      .pr-container { padding-right: 15px; }
      .pb-container { padding-bottom: 15px; }
      .pl-container { padding-left: 15px; }
      .hover\\:p-container:hover { padding: 15px; }
      .hover\\:py-container:hover { padding-top: 15px; padding-bottom: 15px; }
      .hover\\:px-container:hover { padding-left: 15px; padding-right: 15px; }
      .hover\\:pt-container:hover { padding-top: 15px; }
      .hover\\:pr-container:hover { padding-right: 15px; }
      .hover\\:pb-container:hover { padding-bottom: 15px; }
      .hover\\:pl-container:hover { padding-left: 15px; }
      .m-container { margin: 15px; }
      .my-container { margin-top: 15px; margin-bottom: 15px; }
      .mx-container { margin-left: 15px; margin-right: 15px; }
      .mt-container { margin-top: 15px; }
      .mr-container { margin-right: 15px; }
      .mb-container { margin-bottom: 15px; }
      .ml-container { margin-left: 15px; }
      .hover\\:m-container:hover { margin: 15px; }
      .hover\\:my-container:hover { margin-top: 15px; margin-bottom: 15px; }
      .hover\\:mx-container:hover { margin-left: 15px; margin-right: 15px; }
      .hover\\:mt-container:hover { margin-top: 15px; }
      .hover\\:mr-container:hover { margin-right: 15px; }
      .hover\\:mb-container:hover { margin-bottom: 15px; }
      .hover\\:ml-container:hover { margin-left: 15px; }
      .-m-container { margin: -15px; }
      .-my-container { margin-top: -15px; margin-bottom: -15px; }
      .-mx-container { margin-left: -15px; margin-right: -15px; }
      .-mt-container { margin-top: -15px; }
      .-mr-container { margin-right: -15px; }
      .-mb-container { margin-bottom: -15px; }
      .-ml-container { margin-left: -15px; }
      .hover\\:-m-container:hover { margin: -15px; }
      .hover\\:-my-container:hover { margin-top: -15px; margin-bottom: -15px; }
      .hover\\:-mx-container:hover { margin-left: -15px; margin-right: -15px; }
      .hover\\:-mt-container:hover { margin-top: -15px; }
      .hover\\:-mr-container:hover { margin-right: -15px; }
      .hover\\:-mb-container:hover { margin-bottom: -15px; }
      .hover\\:-ml-container:hover { margin-left: -15px; }
    `);
  });
});

test('multiple containers can be generated', () => {
  return generatePluginCss({
    theme: {
      fluidContainer: {
        'sm': {
          maxWidth: '1200px',
          padding: {
            default: '10px',
            sm: '20px',
          },
        },
        'lg': {
          maxWidth: {
            default: null,
          },
          padding: {
            default: '30px',
            sm: '10vw',
          },
        },
      },
    },
    variants: {
      fluidContainer: [],
    },
  }, {
    componentPrefix: 'custom-',
    marginUtilities: false,
    negativeMarginUtilities: false,
  }).then(css => {
    expect(css).toMatchCss(`
      html {
        --container-sm-padding: 10px;
        --container-sm-padding-negative: calc(var(--container-sm-padding) * -1);
        --container-lg-padding: 30px;
        --container-lg-padding-negative: calc(var(--container-lg-padding) * -1);
      }
      @media (min-width: 640px) {
        html {
          --container-sm-padding: 20px;
          --container-lg-padding: 10vw;
        }
      }
      .custom-container-sm {
        margin-left: auto;
        margin-right: auto;
        max-width: 1200px;
        padding-left: 10px;
        padding-left: var(--container-sm-padding);
        padding-right: 10px;
        padding-right: var(--container-sm-padding);
      }
      .custom-container-lg {
        margin-left: auto;
        margin-right: auto;
        padding-left: 30px;
        padding-left: var(--container-lg-padding);
        padding-right: 30px;
        padding-right: var(--container-lg-padding);
      }
      .w-container-sm { width: 1200px; }
      .min-w-container-sm { min-width: 1200px; }
      .max-w-container-sm { max-width: 1200px; }
      .p-container-sm {
        padding: 10px;
        padding: var(--container-sm-padding);
      }
      .py-container-sm {
        padding-top: 10px;
        padding-top: var(--container-sm-padding);
        padding-bottom: 10px;
        padding-bottom: var(--container-sm-padding);
      }
      .px-container-sm {
        padding-left: 10px;
        padding-left: var(--container-sm-padding);
        padding-right: 10px;
        padding-right: var(--container-sm-padding);
      }
      .pt-container-sm {
        padding-top: 10px;
        padding-top: var(--container-sm-padding);
      }
      .pr-container-sm {
        padding-right: 10px;
        padding-right: var(--container-sm-padding);
      }
      .pb-container-sm {
        padding-bottom: 10px;
        padding-bottom: var(--container-sm-padding);
      }
      .pl-container-sm {
        padding-left: 10px;
        padding-left: var(--container-sm-padding);
      }
      .p-container-lg {
        padding: 30px;
        padding: var(--container-lg-padding);
      }
      .py-container-lg {
        padding-top: 30px;
        padding-top: var(--container-lg-padding);
        padding-bottom: 30px;
        padding-bottom: var(--container-lg-padding);
      }
      .px-container-lg {
        padding-left: 30px;
        padding-left: var(--container-lg-padding);
        padding-right: 30px;
        padding-right: var(--container-lg-padding);
      }
      .pt-container-lg {
        padding-top: 30px;
        padding-top: var(--container-lg-padding);
      }
      .pr-container-lg {
        padding-right: 30px;
        padding-right: var(--container-lg-padding);
      }
      .pb-container-lg {
        padding-bottom: 30px;
        padding-bottom: var(--container-lg-padding);
      }
      .pl-container-lg {
        padding-left: 30px;
        padding-left: var(--container-lg-padding);
      }
    `);
  });
});

test('containers can be extended', () => {
  return generatePluginCss({
    theme: {
      extend: {
        fluidContainer: {
          'constrained': {
            maxWidth: '1400px',
            padding: '30px',
          },
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
        padding-left: 15px;
        padding-right: 15px;
      }
      .c-container-constrained {
        margin-left: auto;
        margin-right: auto;
        max-width: 1400px;
        padding-left: 30px;
        padding-right: 30px;
      }
      .p-container { padding: 15px; }
      .py-container { padding-top: 15px; padding-bottom: 15px; }
      .px-container { padding-left: 15px; padding-right: 15px; }
      .pt-container { padding-top: 15px; }
      .pr-container { padding-right: 15px; }
      .pb-container { padding-bottom: 15px; }
      .pl-container { padding-left: 15px; }
      .m-container { margin: 15px; }
      .my-container { margin-top: 15px; margin-bottom: 15px; }
      .mx-container { margin-left: 15px; margin-right: 15px; }
      .mt-container { margin-top: 15px; }
      .mr-container { margin-right: 15px; }
      .mb-container { margin-bottom: 15px; }
      .ml-container { margin-left: 15px; }
      .-m-container { margin: -15px; }
      .-my-container { margin-top: -15px; margin-bottom: -15px; }
      .-mx-container { margin-left: -15px; margin-right: -15px; }
      .-mt-container { margin-top: -15px; }
      .-mr-container { margin-right: -15px; }
      .-mb-container { margin-bottom: -15px; }
      .-ml-container { margin-left: -15px; }
      .w-container-constrained { width: 1400px; }
      .min-w-container-constrained { min-width: 1400px; }
      .max-w-container-constrained { max-width: 1400px; }
      .p-container-constrained { padding: 30px; }
      .py-container-constrained { padding-top: 30px; padding-bottom: 30px; }
      .px-container-constrained { padding-left: 30px; padding-right: 30px; }
      .pt-container-constrained { padding-top: 30px; }
      .pr-container-constrained { padding-right: 30px; }
      .pb-container-constrained { padding-bottom: 30px; }
      .pl-container-constrained { padding-left: 30px; }
      .m-container-constrained { margin: 30px; }
      .my-container-constrained { margin-top: 30px; margin-bottom: 30px; }
      .mx-container-constrained { margin-left: 30px; margin-right: 30px; }
      .mt-container-constrained { margin-top: 30px; }
      .mr-container-constrained { margin-right: 30px; }
      .mb-container-constrained { margin-bottom: 30px; }
      .ml-container-constrained { margin-left: 30px; }
      .-m-container-constrained { margin: -30px; }
      .-my-container-constrained { margin-top: -30px; margin-bottom: -30px; }
      .-mx-container-constrained { margin-left: -30px; margin-right: -30px; }
      .-mt-container-constrained { margin-top: -30px; }
      .-mr-container-constrained { margin-right: -30px; }
      .-mb-container-constrained { margin-bottom: -30px; }
      .-ml-container-constrained { margin-left: -30px; }
    `);
  });
});
