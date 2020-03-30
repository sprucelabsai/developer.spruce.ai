# Getting started

Sprucebot here!⚡️️️️️️️️️️️️ 

Starting your skill is really easy.

Follow these steps before you do anything else. 👇

```bash
yarn global add @sprucelabs/spruce-cli
spruce onboard
```

## Pillars of a skill

Back again! Lets review the parts that make up a skill. 

<!-- panels:start -->
<!-- div:title-panel -->
### Events

<!-- div:left-panel -->
All communication in the platform is powered by Mercury. 
<!-- div:right-panel -->
```js
spruce.mercury.on(SpruceEvents.core.DidEnter.name, () => {
    console.log('someone just entered')
})
```
<!-- panels:end -->

### Orm
### Builders
### Definitions
### Services
### Utilities

Ok, if you're doing the onboarding, jump back to the cli now.