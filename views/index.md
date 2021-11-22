# Skill Views
Skill Views are top level views, comprised of Views, and controlled by `SkillViewControllers`. Every skill gets a `RootSkillViewController` that is loaded by the Skill's slug. A Skill can have as many Skill Views (and Views) as desired.
***





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
    const vc = this.Controller('adventure.root', {}).render()
    assert.isTruthy(vc)
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

export default class RootSkillViewControllerTest extends AbstractViewControllerTest {

    private static vc: RootSkillViewController

    protected static async beforeEach() {
		await super.beforeEach()
		this.vc = this.Controller('adventure.root', {})
	}

    @test()
    protected static canRenderRootSkillView() {
        const model = this.vc.render()
        assert.isTruthy(model)
    }

	@test()
	protected static renders2Cards() {
		vcAssertUtil.assertSkillViewRendersCards(this.vc, ['profile','equip'])
	}

	@test()
	protected static async requiresLogin() {
		await vcAssertUtil.assertLoginIsRequired(this.vc)
	}

	@test()
	protected static canGetPofileCard() {
		const cardVc = vcAssertUtil.assertSkillViewRendersCard(this.vc, 'profile')
		assert.isEqual(cardVc, this.vc.getProfileCardVc())
	}
	
	@test()
	protected static canGetEquipCard() {
		const cardVc = vcAssertUtil.assertSkillViewRendersCard(this.vc, 'equip')
		assert.isEqual(cardVc, this.vc.getEquipCardVc())
	}

	@test()
	protected static async redirectsToAddOrganizationOnLoadIfNoCurrentOrganization() {
		let wasHit = false

		await this.Fixture('view')
				.getRouter()
				.on('did-redirect', () => {

			wasHit = true
		})

		await this.load(this.vc)

		assert.isTrue(wasHit)
	} 
}

```

### 2. Passing the test

Instantiate 2 `Cards` in the constructor of your vc and render them in your vc's `render`.

```ts
import {
	AbstractSkillViewController,
	CardViewController,
	ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'

export default class RootSkillViewController extends AbstractSkillViewController {
    public static id = 'root'
    private profileCardVc: CardViewController
    private equipCardVc: CardViewController

    public constructor(options: ViewControllerOptions) {
		super(options)

		this.profileCardVc = this.Controller('card', {
			id: 'profile',
			header: {
				title: 'My great card!',
			},
			body: {
				isBusy: true
			},
		})
		
        this.equipCardVc = this.Controller('card', {
			id: 'equip',
			header: {
				title: 'My great card 2!',
			},
			body: {
				isBusy: true
			},
		})
	}

	public getProfileCardVc() {
		return this.profileCardVc
	}

	public getEquipCardVc() {
		return this.equipCardVc
	}

    public render(): SpruceSchemas.HeartwoodViewControllers.v2021_02_11.SkillView {
		return {
			layouts: [
				{
					cards: [this.profileCardVc.render()],
				},
				{
					cards: [this.equipCardVc.render()],
				},
			],
		}
	}
}
```

## Authentication
Using `MercuryFixture.setDefaultClient()` you can set a client all fixtures will share that make api request. This will also be the client returned from `this.connectToApi()` in your views.

```ts

//test
export default class RootSkillViewControllerTest extends AbstractViewControllerTest {
	protected static async beforeEach() {
		await super.beforeEach()

		const { client } = await this.Fixture('view').loginAsDemoPerson(DEMO_NUMBER_ROOT_SVC)
		
		MercuryFixture.setDefaultClient(client)

		this.vc = this.Controller('adventure.root')
	}
}

//production
class RootSkillviewController extends AbstractSkillViewController {
	public async load(options: SkillViewControllerLoadOptions) {
		const client = await this.connectToApi()

		const results = await client.emit('whoami::v2020_01_10')
		const { person } = eventResponseUtil.getFirstResponseOrThrow(results)

	}
}


```

## Testing lists
```ts

//test
export default class RootSkillViewControllerTest extends AbstractViewControllerTest {
	@test()
	protected static async rendersList() {
		const listVc = vcAssertUtil.assertCardRendersList(this.vc.getEquipCardVc())

		vcAssertUtil.assertListRendersRow(vc, 'no-entries')


		listVc.addRow({...})
		listVc.addRow({...})
		listVc.addRow({ id: location.id, ...})

		await interactionUtil.clickInRow(vc, 2, 'edit')
		await interactionUtil.clickInRow(vc, location.id, 'edit')
	}
}

//production
class RootSkillviewController extends AbstractSkillViewController {
	public constructor(options: ViewControllerOptions) {
		super(options)

		this.equipmentList = this.Controller('list', {...})

	}
}
```

## Testing confirmation dialogs
```ts

//test
export default class RootSkillViewControllerTest extends AbstractViewControllerTest {

	@test()
	protected static async confirmsBeforeSaving() {
		const formVc = this.vc.getFormVc()

		formVc.setValue('name', 'Haircut')

		const confirmVc = await vcAssertUtil.assertRendersConfirm(this.vc, () =>
			interactionUtil.submitForm(formVc)
		)

		await confirmVc.accept()

		const match = await this.Store('services').findOne({})

		assert.isEqual(match.name, 'Haircut')
	}
	
	@test()
	protected static async rejectingConfirmDoesNotSave() {
		const formVc = this.vc.getFormVc()

		formVc.setValue('name', 'Haircut')

		const confirmVc = await vcAssertUtil.assertRendersConfirm(this.vc, () =>
			interactionUtil.submitForm(formVc)
		)

		await confirmVc.reject()

		const match = await this.Store('services').findOne({})

		assert.isNotEqual(match.name, 'Haircut')
	}
}

//production
class RootSkillviewController extends AbstractSkillViewController {
	public constructor(options: ViewControllerOptions) {
		super(options)

		this.formVc = this.Controller(
			'form',
			buildForm({
				id: 'service',
				schema: serviceSchema,
				onSubmit: this.handleSubmit.bind(this),
				sections: [
					{
						fields: [
							{
								name: 'name',
								hint: 'Give it something good!'
							},
							'duration',
						],
					},
				],
			})
		)

		this.cardVc = this.Controller('card', {
			id: 'service',
			header: {
				title: 'Create your service!',
			},
			body: {
				sections: [
					{
						form: this.formVc.render(),
					},
				],
			},
		})
	}

	private async handleSubmit({ values }: SubmitHandler<ServiceSchema>) {
		const confirm = await this.confirm({ message: 'You ready to do this?' })
		if (confirm) {
			await this.createService(values)
		}
	}

	public getFormVc() {
		return this.formVc
	}
}

```

## Testing active record cards
A card with a list that is wicked easy to use and cuts out a ton of reduntant work!

Make sure you `load` your Active Record Card for it to show any results!

```ts
//test
export default class RootSkillViewControllerTest extends AbstractViewControllerTest {

	@test()
	protected static async rendersActiveRecordCard() {
		const vc = this.Controller('my-skill.root', {})

		await this.load(vc)

		const activeVc = vcAssertUtil.assertSkillViewRendersActiveRecordCard(vc)
	
		assert.isEqual(vc.getActiveRecordCard(), activeVc)
		assert.isTrue(activeVc.getIsLoaded())
	
	}
}

//production

export default class RootSkillViewController extends AbstractViewController<Card> {

	public load(options: SkillViewControllerLoadOptions) {
		const organization = await options.scope.getCurrentOrganization()

		this.activeRecordCardVc = this.Controller(
			'activeRecordCard',
			buildActiveRecordCard({
				header: {
					title: 'Your locations',
				},
				eventName: 'list-locations::v2020_12_25',
				target: {
					organizationId: organization.id,
				},
				payload: {
					includePrivateLocations: true,
				},
				responseKey: 'locations',
				rowTransformer: (location) => ({ id: location.id, cells: [] })
			})
		)


		this.triggerRender()
	}

	public getActiveRecordCardVc() {
		return this.activeRecordCardVc
	}
	
}

```

## Testing scope
Scoping experience to a specific organization or location.

By default, you will be scoped to your latest organization and location. 

Learn more [here](views/scope.md).

```ts
//test
export default class RootSkillViewControllerTest extends AbstractViewControllerTest {

	protected static async beforeEach() {
		await super.beforeEach() 

		this.viewFixture = this.Fixture('view')
		
		const { client } = this.viewFixture.loginAsDemoPerson(DEMO_NUMBER_ROOT_SVC)

		MercuryFixture.setDefaultClient(client)
	}


	@test()
	protected static async redirectsWhenNoCurrentOrg() {
		let wasHit = false
		
		await vcAssertUtil.assertActionRedirects({
			router: this.viewFixture.getRouter(),
			action: () => this.load(this.vc),
			destination: {
				id: 'organization.add',
			},
		})
	}


	@test()
	protected static async doesNotRedirectWhenCurrentOrg() {
		const organization = await this.Organization()
	
		//this is optional, the current org defaults to the newest added
		//this.viewFixture.getScope().setCurrentOrganization(organization.id)

		await vcAssertUtil.assertActionDidNotRedirect({
			router: this.viewFixture.getRouter(),
			action: () => this.load(this.vc),
		})

		assert.isEqualDeep(this.vc.currentOrg, organization)
	}

	@test()
	protected static async usesOrgFromScope() {
		// since scope loads the last org by default, we can set 
		// it back to the first org to test our productions code
		const organization = await this.Organization()
		await this.Organization()
		await this.Organization()
	
		this.viewFixture.getScope().setCurrentOrganization(organization.id)

		let wasHit = false

		await this.load(this.vc)

		assert.isEqualDeep(this.vc.currentOrg, organization)
	}


	public static async Organization() {
		return this.Fixture(
			'organization'
		).seedDemoOrganization({
			name: 'Root view controller',
			phone: DEMO_NUMBER_ROOT_SVC,
		})
	}
}

//production
class RootSkillviewController extends AbstractSkillViewController {
	public async load(options: SkillViewControllerLoadOptions) {
		const organization = await options.scope.getCurrentOrganization()

		if (!organization) {
			await options.router.redirect('organization.add' as any)
			return
		}

		this.currentOrganization = organization
		this.profileCardVc.setRouter(options.router)
		this.profileCardVc.setIsBusy(false)
	}
}
```

## Testing forms

```ts
//test
export default class RootSkillViewControllerTest extends AbstractViewControllerTest {

	@test()
	protected static async showsErrorWhenSavingFails() {
		const client = this.Fixture('mercury').connectToApi()
		await client.on('create-organization::v2020_01_01', () => {
			throw new SchemaError({
				code: 'NOT_IMPLEMENTED',
				instructions: 'implement error handling'
			})
		})

		const formVc = this.vc.getFormVc()
		formVc.setValues({...})

		await vcAssertUtil.assertDoesRenderAlert(this.vc, () => interactionUtil.submitForm(formVc))
	}


	@test()
	protected static async savesOrgWhenSubmittingForm() {
		const formVc = this.vc.getFormVc()

		formVc.setValues({...})

		await interactionUtil.submitForm(formVc)
	}
}

//production
class RootSkillviewController extends AbstractSkillViewController {
	public constructor(options: SkillViewControllerOptions) {
		super(options)

		this.formVc = this.Controller('form', buildForm({
			...,
			onSubmit: this.handleSubmit.bind(this)
		}))
	}

	private async handleSubmit() {
		const values = this.formVc.getValues()

		try {
			const client = await this.connectToApi() 
			const results = await client.emit('create-organization::v2020_01_01', {
				payload: values
			})
		} catch (err:any) {
			await this.alert({ message: err.message })
		}
	}
}
```

## Testing toolbelt
```ts
//test
export default class RootSkillViewControllerTest extends AbstractViewControllerTest {
	@test()
	protected static rendersToolBelt() {
		vcAssertUtil.assertDoesNotRenderToolBelt(this.vc)
		
		await this.load(this.vc)

		const toolBeltVc = vcAssertUtil.assertRendersToolBelt(this.vc)
		
		const { tool, toolBeltVc: toolBeltVc2, cardVc} = vcAssertUtil.assertToolBeltRendersTool(this.vc, 'edit')

		assert.isTruthy(cardVc, 'Your ToolBelt does not render a tool with a properly rendered CardVc.')
		assert.isEqual(toolBeltVc, toolBeltVc2)
		assert.isEqual(tool.lineIcon, 'glob')
	}
}

//production
class RootSkillviewController extends AbstractSkillViewController {
	public constructor(options: SkillViewControllerOptions) {
		super(options)

		this.toolBeltVc = this.Controller('toolBelt', {
			...,
		})
	}

	public async load(options: SkillViewControllerLoadOptions) {
		this.toolBeltVc.addTool({
			id: 'edit',
			lineIcon: 'globe',
			card: this.Controller('card', { ... })
		})
	}

	public renderToolBelt() {
		return this.toolBeltVc.render()
	}
}
```


## Test hints

1. Look at locations skill
1. Look at forms skill
2. Use `spruce watch.views` and then visit the `https://developer.spruce.bot/#views/heartwood.watch`
3. Checkout the `VcAssertUtil.test.ts` in `heartwood-view-controllers`
4. Give your buttons, list rows, and cards ids and assert against them
	* vcAssertUtil.assertListRendersRow(rowVc, service.id)
	* interactionUtil.clickButtonInFooter(cardVc, 'edit')

