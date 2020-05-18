# Tests

```bash
# Create a new test
spruce test:create [targetFile]
```

## Building your first test

```bash
spruce test:create
```


<!-- panels:start -->
<!--div:title-panel-->
## Generated files
<!-- div:left-panel -->
Only 1 file created for you and your `package.json` has been updated to support testing.

1. **Test:** `./{{pathToTargetFile}}/{{pascalName}}.test.ts`
    * Where the actual tests lives
    * Uses `@test` decorator to hook up tests
2. **Package.json**
    * Added 3 dev dependencies
      * [@sprucelabs/test](https://github.com/sprucelabsai/spruce-test)
      * [ts-node](https://github.com/TypeStrong/ts-node)
    * Added 2 scripts
      * `y test` - Runs all your tests
      * `y test:watch` - Watches all files and run tests on change
<!-- div:right-panel -->

<!-- panel:end -->
