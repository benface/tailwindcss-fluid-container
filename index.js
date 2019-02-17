const _ = require('lodash');

module.exports = ({
  maxWidth = null,
  padding = '15px',
  responsivePadding = [],
  componentPrefix = 'c-',
  variants = [],
  containers = {
    container: {},
  },
} = {}) => ({ e, addComponents, addUtilities }) => {
  _.forEach(containers, function(container, containerName) {
    let containerMaxWidth = container.maxWidth !== undefined ? container.maxWidth : maxWidth;
    let containerBasePadding = container.padding !== undefined ? container.padding : padding;
    let containerResponsivePadding = container.responsivePadding !== undefined ? container.responsivePadding : responsivePadding;
    let containerPadding = containerBasePadding;
    let containerPaddingNegative = '-' + containerBasePadding;
    let containerComponentPrefix = container.componentPrefix !== undefined ? container.componentPrefix : componentPrefix;
    let containerVariants = container.variants !== undefined ? container.variants : variants;
    if (!_.isEmpty(containerResponsivePadding)) {
      addComponents({
        'html': {
          [`--${containerName}-padding`]: containerBasePadding,
          [`--${containerName}-padding-negative`]: `calc(var(--${containerName}-padding) * -1)`,
        },
      });
      _.forEach(containerResponsivePadding, function(padding, screen) {
        addComponents({
          [`@screen ${screen}`]: {
            'html': {
              [`--${containerName}-padding`]: padding,
            },
          },
        });
      });
      containerPadding = [containerBasePadding, `var(--${containerName}-padding)`];
      containerPaddingNegative = ['-' + containerBasePadding, `var(--${containerName}-padding-negative)`];
    }
    addComponents({
      [`.${e(`${containerComponentPrefix}${containerName}`)}`]: {
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: containerMaxWidth,
        paddingLeft: containerPadding,
        paddingRight: containerPadding,
      },
    });
    if (containerMaxWidth !== null) {
      addUtilities({
        [`.${e(`w-${containerName}`)}`]: { width: containerMaxWidth, },
        [`.${e(`min-w-${containerName}`)}`]: { minWidth: containerMaxWidth, },
        [`.${e(`max-w-${containerName}`)}`]: { maxWidth: containerMaxWidth, },
      }, containerVariants);
    }
    addUtilities({
      [`.${e(`px-${containerName}`)}`]: { paddingLeft: containerPadding, paddingRight: containerPadding, },
      [`.${e(`pl-${containerName}`)}`]: { paddingLeft: containerPadding, },
      [`.${e(`pr-${containerName}`)}`]: { paddingRight: containerPadding, },
      [`.${e(`mx-${containerName}`)}`]: { marginLeft: containerPadding, marginRight: containerPadding, },
      [`.${e(`ml-${containerName}`)}`]: { marginLeft: containerPadding, },
      [`.${e(`mr-${containerName}`)}`]: { marginRight: containerPadding, },
      [`.${e(`-mx-${containerName}`)}`]: { marginLeft: containerPaddingNegative, marginRight: containerPaddingNegative, },
      [`.${e(`-ml-${containerName}`)}`]: { marginLeft: containerPaddingNegative, },
      [`.${e(`-mr-${containerName}`)}`]: { marginRight: containerPaddingNegative, },
    }, containerVariants);
  });
};
