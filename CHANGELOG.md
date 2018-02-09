# CHANGELOG

### 3.1.0

- Added `package-lock.json`
- Allow for `react@16.x.x` in `peerDependencies`
- Move babel dependencies to `devDependencies`
- Updated dependencies
  - Bump to `eslint@4.17.0`
  - Bump to `eslint-config-godaddy-react@2.2.0`
  - Bump to `eslint-plugin-react@^7.6.1`
  - Bump to `mocha@^5.0.0`
  - Bump to `sinon@4.2.2`
    - `spy.reset()` -> `spy.resetHistory()` as `reset` is depricated

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
