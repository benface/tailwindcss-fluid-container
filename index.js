const plugin = require('tailwindcss/plugin');
const _ = require('lodash');

const defaultOptions = {
  componentPrefix: 'c-',
  widthUtilities: true,
  paddingUtilities: true,
  marginUtilities: true,
  negativeMarginUtilities: true,
};

const defaultContainerOptions = {
  maxWidth: null,
  padding: '15px',
};

module.exports = plugin.withOptions(function(options = {}) {
  return function({ theme, variants, e, addBase, addComponents, addUtilities }) {
    options = _.defaults({}, options, defaultOptions);

    const getMediaQuery = function(screen) {
      if (theme(`screens.${screen}`)) {
        return `@screen ${screen}`;
      }
      return `@media (min-width: ${screen})`;
    };

    const baseStyles = {};
    const baseStylesAtRules = {};
    const containerVariants = variants('fluidContainer');

    _.forEach(theme('fluidContainer'), function(containerOptions, containerName) {
      const container = _.defaults({}, containerOptions, defaultContainerOptions);
      container.name = `container${containerName === 'default' ? '' : `-${containerName}`}`;
      container.maxWidthValues = [];
      container.paddingValues = [];
      container.negativePaddingValues = [];

      if (_.isPlainObject(container.maxWidth)) {
        if (container.maxWidth.default) {
          container.maxWidthValues.push(container.maxWidth.default);
        }

        const nonDefaultMaxWidths = _.pickBy(container.maxWidth, (maxWidth, screen) => screen !== 'default');

        if (!_.isEmpty(nonDefaultMaxWidths)) {
          container.maxWidthValues.push(`var(--${container.name}-max-width)`);

          if (container.maxWidth.default) {
            baseStyles[`--${container.name}-max-width`] = container.maxWidth.default;
          }

          _.forEach(nonDefaultMaxWidths, function(maxWidth, screen) {
            const mediaQuery = getMediaQuery(screen);
            if (!baseStylesAtRules[mediaQuery]) {
              baseStylesAtRules[mediaQuery] = {};
            }
            baseStylesAtRules[mediaQuery][`--${container.name}-max-width`] = maxWidth;
          });
        }
      }
      else if (container.maxWidth) {
        container.maxWidthValues.push(container.maxWidth);
      }

      if (_.isPlainObject(container.padding)) {
        if (container.padding.default) {
          container.paddingValues.push(container.padding.default);
          container.negativePaddingValues.push(`-${container.padding.default}`);
        }

        const nonDefaultPaddings = _.pickBy(container.padding, (padding, screen) => screen !== 'default');

        if (!_.isEmpty(nonDefaultPaddings)) {
          container.paddingValues.push(`var(--${container.name}-padding)`);
          container.negativePaddingValues.push(`var(--${container.name}-padding-negative)`);

          if (container.padding.default) {
            baseStyles[`--${container.name}-padding`] = container.padding.default;
          }

          baseStyles[`--${container.name}-padding-negative`] = `calc(var(--${container.name}-padding) * -1)`;

          _.forEach(nonDefaultPaddings, function(padding, screen) {
            const mediaQuery = getMediaQuery(screen);
            if (!baseStylesAtRules[mediaQuery]) {
              baseStylesAtRules[mediaQuery] = {};
            }
            baseStylesAtRules[mediaQuery][`--${container.name}-padding`] = padding;
          });
        }
      }
      else if (container.padding) {
        container.paddingValues.push(container.padding);
        container.negativePaddingValues.push(`-${container.padding}`);
      }

      addComponents({
        [`.${e(`${options.componentPrefix}${container.name}`)}`]: {
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: container.maxWidthValues,
          paddingLeft: container.paddingValues,
          paddingRight: container.paddingValues,
        },
      });

      if (options.widthUtilities && !_.isEmpty(container.maxWidthValues)) {
        addUtilities({
          [`.${e(`w-${container.name}`)}`]: {
            width: container.maxWidthValues,
          },
          [`.${e(`min-w-${container.name}`)}`]: {
            minWidth: container.maxWidthValues,
          },
          [`.${e(`max-w-${container.name}`)}`]: {
            maxWidth: container.maxWidthValues,
          },
        }, containerVariants);
      }

      if (options.paddingUtilities && !_.isEmpty(container.paddingValues)) {
        addUtilities({
          [`.${e(`p-${container.name}`)}`]: {
            padding: container.paddingValues,
          },
          [`.${e(`py-${container.name}`)}`]: {
            paddingTop: container.paddingValues,
            paddingBottom: container.paddingValues,
          },
          [`.${e(`px-${container.name}`)}`]: {
            paddingLeft: container.paddingValues,
            paddingRight: container.paddingValues,
          },
          [`.${e(`pt-${container.name}`)}`]: {
            paddingTop: container.paddingValues,
          },
          [`.${e(`pr-${container.name}`)}`]: {
            paddingRight: container.paddingValues,
          },
          [`.${e(`pb-${container.name}`)}`]: {
            paddingBottom: container.paddingValues,
          },
          [`.${e(`pl-${container.name}`)}`]: {
            paddingLeft: container.paddingValues,
          },
        }, containerVariants);
      }

      if (options.marginUtilities && !_.isEmpty(container.paddingValues)) {
        addUtilities({
          [`.${e(`m-${container.name}`)}`]: {
            margin: container.paddingValues,
          },
          [`.${e(`my-${container.name}`)}`]: {
            marginTop: container.paddingValues,
            marginBottom: container.paddingValues,
          },
          [`.${e(`mx-${container.name}`)}`]: {
            marginLeft: container.paddingValues,
            marginRight: container.paddingValues,
          },
          [`.${e(`mt-${container.name}`)}`]: {
            marginTop: container.paddingValues,
          },
          [`.${e(`mr-${container.name}`)}`]: {
            marginRight: container.paddingValues,
          },
          [`.${e(`mb-${container.name}`)}`]: {
            marginBottom: container.paddingValues,
          },
          [`.${e(`ml-${container.name}`)}`]: {
            marginLeft: container.paddingValues,
          },
        }, containerVariants);
      }

      if (options.negativeMarginUtilities && !_.isEmpty(container.negativePaddingValues)) {
        addUtilities({
          [`.${e(`-m-${container.name}`)}`]: {
            margin: container.negativePaddingValues,
          },
          [`.${e(`-my-${container.name}`)}`]: {
            marginTop: container.negativePaddingValues,
            marginBottom: container.negativePaddingValues,
          },
          [`.${e(`-mx-${container.name}`)}`]: {
            marginLeft: container.negativePaddingValues,
            marginRight: container.negativePaddingValues,
          },
          [`.${e(`-mt-${container.name}`)}`]: {
            marginTop: container.negativePaddingValues,
          },
          [`.${e(`-mr-${container.name}`)}`]: {
            marginRight: container.negativePaddingValues,
          },
          [`.${e(`-mb-${container.name}`)}`]: {
            marginBottom: container.negativePaddingValues,
          },
          [`.${e(`-ml-${container.name}`)}`]: {
            marginLeft: container.negativePaddingValues,
          },
        }, containerVariants);
      }
    });

    if (!_.isEmpty(baseStyles)) {
      addBase({
        'html': baseStyles,
      });
    }
    if (!_.isEmpty(baseStylesAtRules)) {
      addBase({
        html: baseStylesAtRules,
      });
    }
  };
}, function() {
  return {
    theme: {
      fluidContainer: {
        'default': defaultContainerOptions,
      },
    },
    variants: {
      fluidContainer: ['responsive'],
    },
  };
});
