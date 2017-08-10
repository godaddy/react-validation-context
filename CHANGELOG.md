# CHANGELOG

### 3.0.1

- [#4] Improve documentation

### 3.0.0

- [#3] Upgrade dependencies and fix state-tracking bug
  - Added new validity state `undefined` (no validation defined); this is the default
  - Fixed lifecycle issues
    - `onValidChange` handlers now called with `isValid=undefined` if component no longer has validation
      - (e.g. unmount, `name` prop changed, etc.)
    - `Validate` now properly tracks when child components unmount/are renamed
  - Upgraded various testing dependencies
  - Use `prop-types` package

[#3]: https://github.com/godaddy/react-validation-context/pull/3
[#4]: https://github.com/godaddy/react-validation-context/pull/4

