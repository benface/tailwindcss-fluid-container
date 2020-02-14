# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project mostly adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0] - 2020-02-13

### Added
- Added vertical margin and padding utilities matching the container’s padding

## [3.0.0] - 2020-02-05

### Added
- Arbitrary screen sizes that don’t exist in the theme (e.g. `400px`) are now allowed in `responsiveMaxWidth` and `responsivePadding`

### Changed
- Changed to use Tailwind 1.2’s new plugin definition syntax

## [2.1.0] - 2019-09-01

### Added
- Added a `responsiveMaxWidth` container setting, which works similarly to `responsivePadding`

## [2.0.0] - 2019-05-13

### Changed since 2.0.0-beta.1
- Added support for global variants thanks to Tailwind’s `variants()` helper function

### Added since 1.x
- Tailwind 1.0.0 compatibility
- Added options to enable/disable the utilities

### Changed since 1.x
- Most of the config options have been moved to the `theme` and `variants` objects in your Tailwind config (see `README` for more info)
- Container class names now always include the word `container`; you can however customize the suffix (the keys in the `theme.fluidContainer` object, where `default` means no suffix) and the component prefix (which still defaults to `c-`)

## [2.0.0-beta.1] - 2019-04-07

### Added
- Tailwind 1.0.0 compatibility
- Added options to enable/disable the utilities

### Changed
- Most of the config options have been moved to the `theme` and `variants` objects in your Tailwind config (see `README` for more info)
- Container class names now always include the word `container`; you can however customize the suffix (the keys in the `theme.fluidContainer` object, where `default` means no suffix) and the component prefix (which still defaults to `c-`)

## [1.0.0] - 2019-02-17

Initial release

[Unreleased]: https://github.com/benface/tailwindcss-fluid-container/compare/v3.1.0...HEAD
[3.1.0]: https://github.com/benface/tailwindcss-fluid-container/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/benface/tailwindcss-fluid-container/compare/v2.1.0...v3.0.0
[2.1.0]: https://github.com/benface/tailwindcss-fluid-container/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/benface/tailwindcss-fluid-container/compare/v2.0.0-beta.1...v2.0.0
[2.0.0-beta.1]: https://github.com/benface/tailwindcss-fluid-container/compare/v1.0.0...v2.0.0-beta.1
[1.0.0]: https://github.com/benface/tailwindcss-fluid-container/releases/tag/v1.0.0
