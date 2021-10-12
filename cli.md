# CLI
****

Configuring the CLI is done through your skill or module's `package.json`.


## Ignoring node modules on upgrade

These modules will be ignored everytime you run `spruce upgrade` or `spruce update.dependencies`. All other modules will be upgraded to the latest version (including jumping majors). Also, any new dependencies the platform depends on will be added.

```json
"skill": {
    "upgradeIgnoreList": [
        "module-1",
        "module-2"
    ]
}
```

## Overriding command options

You can override the options passed to any `spruce` command by setting `commandOverrides`. The key is the command, the value are the option flags you want passed (will mixin with any you pass via command line).

```json
"skill": {
    "commandOverrides": {
        "sync.schemas": "--shouldFetchCoreSchemas false",
    }
}
```
