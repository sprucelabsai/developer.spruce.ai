# Skill Views

Skill Views are top level views, comprised of Views, and controlled by `SkillViewControllers`. Every skill gets a `RootSkillViewController` that is loaded by the Skill's slug. A Skill can have as many Skill Views (and Views) as desired.




```bash
# Create a new Skill View or View
spruce create.view

# Preview your views with live reload
spruce watch.views

```
Note: You must [register](/skills/index) your skill before being able to publish your Skill Views.

## Root View Controller

This is your primary view accessible by your Skill's slug. For example, the `Adventure` skill is accessible via [https://adventure.spruce.bot](https://adventure.spruce.bot). You should start each skill by creating your RootViewController.

## Testing View Controllers

### 1. Create your test file

* Run `spruce create.test`
* Select `AbstractViewControllerTest`

### 2. Write your first failing test

* Clear out the existing tests
* Add your first failing test
    * Make sure your slug is correct
    * Change `adventure` to whatever your slug is.

```ts
@test()
protected static async canRenderRootSkillView() {
    const vc = this.Controller('adventure.root', {})
}

```

### 3. Create your root view controller

* Run `spruce create.view`
* Create your `RootViewController`

Your first test should be passing minus a type issue. Lets bring it home!

### 4. Finish your first test

```ts
@test()
protected static async canRenderRootSkillView() {
    const model = this.Controller('adventure.root', {}).render()
    assert.isTruthy(model)
}
```

Your RootViewController should always successfully render. If this test ever fails, you have problems.

## View Controller Assertions