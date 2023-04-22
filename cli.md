# CLI
****

## Documentation

```bash
# The latest documentation is available by running
spruce --help
spruce [command] --help
```

## Configuration

Configuring the CLI is done through your skill or module's `package.json`.

* [Ignoring node modules on upgrade](cli.md?id=ignoring-node-modules-on-upgrade)
* [Overriding command options](cli.md?id=overriding-command-options)


### Ignoring node modules on upgrade

These modules will be ignored everytime you run `spruce upgrade` or `spruce update.dependencies`. All other modules will be upgraded to the latest version (including jumping majors). Also, any new dependencies the platform depends on will be added.

```json
//package.json
"skill": {
    "upgradeIgnoreList": [
        "module-1",
        "module-2"
    ]
}
```

### Overriding command options

You can override the options passed to any `spruce` command by setting `skill.commandOverrides`. The key is the command, the value is a string of all the args you want passed.

```json
//package.json
"skill": {
    "commandOverrides": {
        "sync.schemas": "--shouldFetchCoreSchemas false",
    }
}
```

### Blocking commands

Sometimes your skill or module is not compatible with a command and you wanna ensure someone doesn't accidently run it.

```json
//package.json
"skill": {
    "blockedCommands": {
        "schema.create": "Creating schemas is blocked for very good reasons, I promise!",
    }
}
```

## What's next?

Let's get building your first [Skill View](/views/index)!
