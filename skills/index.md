# Skills
****
```bash
# Creating your new skill
spruce create.skill [directory]

# Register your skill
spruce register

# Login as a developer
spruce login

# Setting which Mercury to use
spruce set.remote

# Boot your skill
spruce boot

```

## Booting your skill!

You can't just boot your skill, you are going to need to register it in an environment first!

1. Log in as a developer using: `spruce login`
2. Set remote to *Development* using: `spruce set.remote`
3. Register your skill with: `spruce register`
    * Your skill's namespace will be how you access your skill.
3. Now boot your skill using: `spruce boot`

During your skill's boot it will compile your skill views and register them with Heartwood. This may take a moment, so wait until you see the "Skill Booted" message at the end!

From this point forward you can use `spruce boot` every time you make View changes.