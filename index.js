const _ = require('lodash');

module.exports = function(options = {}) {
  return ({ config, e, addBase, addComponents, addUtilities }) => {
    const defaultOptions = {
      componentPrefix: 'c-',
      widthUtilities: true,
      paddingUtilities: true,
      marginUtilities: true,
      negativeMarginUtilities: true,
    };
    const defaultTheme = {
      'default': {
        maxWidth: null,
        padding: '15px',
        responsivePadding: {},
      },
    };
    const containers = config('theme.fluidContainer', defaultTheme);
    const variants = config('variants.fluidContainer', ['responsive']);

    options = _.merge({}, defaultOptions, options);

    _.forEach(containers, function(value, modifier) {
      const containerName = `container${modifier === 'default' ? '' : `-${modifier}`}`;
      const container = _.defaults({}, value, defaultTheme.default);
      let containerPadding = container.padding;
      let containerPaddingNegative = '-' + container.padding;

      if (!_.isEmpty(container.responsivePadding)) {
        addBase({
          'html': {
            [`--${containerName}-padding`]: container.padding,
            [`--${containerName}-padding-negative`]: `calc(var(--${containerName}-padding) * -1)`,
          },
        });
        _.forEach(container.responsivePadding, function(padding, screen) {
          addBase({
            [`@screen ${screen}`]: {
              'html': {
                [`--${containerName}-padding`]: padding,
              },
            },
          });
        });
        containerPadding = [containerPadding, `var(--${containerName}-padding)`];
        containerPaddingNegative = [containerPaddingNegative, `var(--${containerName}-padding-negative)`];
      }

      addComponents({
        [`.${e(`${options.componentPrefix}${containerName}`)}`]: {
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: container.maxWidth,
          paddingLeft: containerPadding,
          paddingRight: containerPadding,
        },
      });

      if (options.widthUtilities && container.maxWidth !== null) {
        addUtilities({
          [`.${e(`w-${containerName}`)}`]: {
            width: container.maxWidth,
          },
          [`.${e(`min-w-${containerName}`)}`]: {
            minWidth: container.maxWidth,
          },
          [`.${e(`max-w-${containerName}`)}`]: {
            maxWidth: container.maxWidth,
          },
        }, variants);
      }

      if (options.paddingUtilities) {
        addUtilities({
          [`.${e(`px-${containerName}`)}`]: {
            paddingLeft: containerPadding,
            paddingRight: containerPadding,
          },
          [`.${e(`pl-${containerName}`)}`]: {
            paddingLeft: containerPadding,
          },
          [`.${e(`pr-${containerName}`)}`]: {
            paddingRight: containerPadding,
          },
        }, variants);
      }

      if (options.marginUtilities) {
        addUtilities({
          [`.${e(`mx-${containerName}`)}`]: {
            marginLeft: containerPadding,
            marginRight: containerPadding,
          },
          [`.${e(`ml-${containerName}`)}`]: {
            marginLeft: containerPadding,
          },
          [`.${e(`mr-${containerName}`)}`]: {
            marginRight: containerPadding,
          },
        }, variants);
      }

      if (options.negativeMarginUtilities) {
        addUtilities({
          [`.${e(`-mx-${containerName}`)}`]: {
            marginLeft: containerPaddingNegative,
            marginRight: containerPaddingNegative,
          },
          [`.${e(`-ml-${containerName}`)}`]: {
            marginLeft: containerPaddingNegative,
          },
          [`.${e(`-mr-${containerName}`)}`]: {
            marginRight: containerPaddingNegative,
          },
        }, variants);
      }
    });
  };
};
