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
}1

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

The [`vcAssertUtil`](https://github.com/sprucelabsai/heartwood-view-controllers/blob/master/src/tests/utilities/vcAssert.utility.ts) is the primary mechanism for building failing tests. For example, you may want to ensure your `RootViewController` renders 2 `Cards`.

### 1. Failing test

This will involve moving the instantiation of your vc to the `beforeEach` and then using `vcAssertUtil` to assert that your vc renders 2 cards. 

```ts
import { vcAssertUtil } from '@sprucelabs/heartwood-view-controllers'
import { AbstractViewControllerTest } from '@sprucelabs/spruce-view-plugin'
import RootSkillViewController from '../../skillViewControllers/Root.svc'

export default class RootViewControllerTest extends AbstractViewControllerTest {

    private static vc: RootSkillViewController

    protected static async beforeEach() {
		await super.beforeEach()
		this.vc = this.Controller('adventure.root', {})
	}

    @test()
    protected static async canRenderRootSkillView() {
        const model = this.vc.render()
        assert.isTruthy(model)
    }

	@test()
	protected static async renders2Cards() {
		vcAssertUtil.assertSkillViewRendersCards(this.vc, 2)
	}
}

```

### 1. Passing the test

Instantiate 2 `Cards` in the constructor of your vc and render them in your vc's `render`.

```ts
import {
	AbstractSkillViewController,
	CardViewController,
	ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'

export default class RootSkillViewController extends AbstractSkillViewController {
    public static id = 'root'
    private card1Vc: CardViewController
    private card2Vc: CardViewController

    public constructor(options: ViewControllerOptions) {
		super(options)

		this.card1Vc = this.vcFactory.Controller('card', {
			header: {
				title: 'My great card!',
			},
			body: {
				isLoading: true
			},
		})
		
        this.card2Vc = this.vcFactory.Controller('card', {
			header: {
				title: 'My great card 2!',
			},
			body: {
				isLoading: true
			},
		})
	}

    public render(): SpruceSchemas.HeartwoodViewControllers.v2021_02_11.SkillView {
		return {
			layouts: [
				{
					cards: [this.formsCardVc.render()],
				},
				{
					cards: [this.completedCardVc.render()],
				},
			],
		}
	}
}
```