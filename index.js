const _ = require('lodash');

module.exports = function(options = {}) {
  return ({ config, e, variants, addBase, addComponents, addUtilities }) => {
    const defaultOptions = {
      componentPrefix: 'c-',
      widthUtilities: true,
      paddingUtilities: true,
      marginUtilities: true,
      negativeMarginUtilities: true,
    };
    options = _.merge({}, defaultOptions, options);

    const defaultTheme = {
      'default': {
        maxWidth: null,
        padding: '15px',
        responsivePadding: {},
      },
    };
    const containers = config('theme.fluidContainer', defaultTheme);
    const utilityVariants = variants('fluidContainer', ['responsive']);

    _.forEach(containers, function(value, modifier) {
      const container = _.defaults({}, value, defaultTheme.default);
      container.name = `container${modifier === 'default' ? '' : `-${modifier}`}`;
      container.varPadding = container.padding;
      container.varPaddingNegative = '-' + container.padding;

      if (!_.isEmpty(container.responsivePadding)) {
        addBase({
          'html': {
            [`--${container.name}-padding`]: container.padding,
            [`--${container.name}-padding-negative`]: `calc(var(--${container.name}-padding) * -1)`,
          },
        });
        _.forEach(container.responsivePadding, function(padding, screen) {
          addBase({
            [`@screen ${screen}`]: {
              'html': {
                [`--${container.name}-padding`]: padding,
              },
            },
          });
        });
        container.varPadding = [container.varPadding, `var(--${container.name}-padding)`];
        container.varPaddingNegative = [container.varPaddingNegative, `var(--${container.name}-padding-negative)`];
      }

      addComponents({
        [`.${e(`${options.componentPrefix}${container.name}`)}`]: {
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: container.maxWidth,
          paddingLeft: container.varPadding,
          paddingRight: container.varPadding,
        },
      });

      if (options.widthUtilities && container.maxWidth !== null) {
        addUtilities({
          [`.${e(`w-${container.name}`)}`]: {
            width: container.maxWidth,
          },
          [`.${e(`min-w-${container.name}`)}`]: {
            minWidth: container.maxWidth,
          },
          [`.${e(`max-w-${container.name}`)}`]: {
            maxWidth: container.maxWidth,
          },
        }, utilityVariants);
      }

      if (options.paddingUtilities) {
        addUtilities({
          [`.${e(`px-${container.name}`)}`]: {
            paddingLeft: container.varPadding,
            paddingRight: container.varPadding,
          },
          [`.${e(`pl-${container.name}`)}`]: {
            paddingLeft: container.varPadding,
          },
          [`.${e(`pr-${container.name}`)}`]: {
            paddingRight: container.varPadding,
          },
        }, utilityVariants);
      }

      if (options.marginUtilities) {
        addUtilities({
          [`.${e(`mx-${container.name}`)}`]: {
            marginLeft: container.varPadding,
            marginRight: container.varPadding,
          },
          [`.${e(`ml-${container.name}`)}`]: {
            marginLeft: container.varPadding,
          },
          [`.${e(`mr-${container.name}`)}`]: {
            marginRight: container.varPadding,
          },
        }, utilityVariants);
      }

      if (options.negativeMarginUtilities) {
        addUtilities({
          [`.${e(`-mx-${container.name}`)}`]: {
            marginLeft: container.varPaddingNegative,
            marginRight: container.varPaddingNegative,
          },
          [`.${e(`-ml-${container.name}`)}`]: {
            marginLeft: container.varPaddingNegative,
          },
          [`.${e(`-mr-${container.name}`)}`]: {
            marginRight: container.varPaddingNegative,
          },
        }, utilityVariants);
      }
    });
  };
};
