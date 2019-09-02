const _ = require('lodash');

module.exports = function(options = {}) {
  return ({ theme, variants, e, addBase, addComponents, addUtilities }) => {
    const defaultOptions = {
      componentPrefix: 'c-',
      widthUtilities: true,
      paddingUtilities: true,
      marginUtilities: true,
      negativeMarginUtilities: true,
    };
    options = _.defaults({}, options, defaultOptions);

    const defaultContainerTheme = {
      'default': {
        maxWidth: null,
        responsiveMaxWidth: {},
        padding: '15px',
        responsivePadding: {},
      },
    };
    const defaultContainerVariants = ['responsive'];

    const containerTheme = theme('fluidContainer', defaultContainerTheme);
    const containerVariants = variants('fluidContainer', defaultContainerVariants);

    _.forEach(containerTheme, function(value, modifier) {
      const container = _.defaults({}, value, defaultContainerTheme.default);
      container.name = `container${modifier === 'default' ? '' : `-${modifier}`}`;
      container.varMaxWidth = container.maxWidth;
      container.varPadding = container.padding;
      container.varPaddingNegative = '-' + container.padding;

      if (!_.isEmpty(container.responsiveMaxWidth) || !_.isEmpty(container.responsivePadding)) {
        addBase({
          'html': {
            [`--${container.name}-max-width`]: _.isEmpty(container.responsiveMaxWidth) ? null : container.maxWidth,
            [`--${container.name}-padding`]: _.isEmpty(container.responsivePadding) ? null : container.padding,
            [`--${container.name}-padding-negative`]: _.isEmpty(container.responsivePadding) ? null : `calc(var(--${container.name}-padding) * -1)`,
          },
        });
      }

      if (!_.isEmpty(container.responsiveMaxWidth)) {
        container.varMaxWidth = [container.varMaxWidth, `var(--${container.name}-max-width)`];
        _.forEach(container.responsiveMaxWidth, function(maxWidth, screen) {
          addBase({
            [`@screen ${screen}`]: {
              'html': {
                [`--${container.name}-max-width`]: maxWidth,
              },
            },
          });
        });
      }
      
      if (!_.isEmpty(container.responsivePadding)) {
        container.varPadding = [container.varPadding, `var(--${container.name}-padding)`];
        container.varPaddingNegative = [container.varPaddingNegative, `var(--${container.name}-padding-negative)`];
        _.forEach(container.responsivePadding, function(padding, screen) {
          addBase({
            [`@screen ${screen}`]: {
              'html': {
                [`--${container.name}-padding`]: padding,
              },
            },
          });
        });
      }

      addComponents({
        [`.${e(`${options.componentPrefix}${container.name}`)}`]: {
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: container.varMaxWidth,
          paddingLeft: container.varPadding,
          paddingRight: container.varPadding,
        },
      });

      if (options.widthUtilities && container.varMaxWidth !== null) {
        addUtilities({
          [`.${e(`w-${container.name}`)}`]: {
            width: container.varMaxWidth,
          },
          [`.${e(`min-w-${container.name}`)}`]: {
            minWidth: container.varMaxWidth,
          },
          [`.${e(`max-w-${container.name}`)}`]: {
            maxWidth: container.varMaxWidth,
          },
        }, containerVariants);
      }

      if (container.varPadding !== null) {
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
          }, containerVariants);
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
          }, containerVariants);
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
          }, containerVariants);
        }
      }
    });
  };
};
