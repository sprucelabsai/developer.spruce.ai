# Skill Views

Skill Views are top level views, comprised of Views, and controlled by `SkillViewControllers`. Every skill gets a `RootSkillViewController` that is loaded by the Skill's namespace. A Skill can have as many Skill Views (and Views) as desired.

---

```bash
# Create a new Skill View or View
spruce create.view

# Preview your views with live reload
spruce watch.views

```

Note: You must [register](/skills/index) your skill before being able to publish your Skill Views.

## Root View Controller

This is your primary view accessible by your Skill's namespace. For example, the `Adventure` skill is accessible via [https://adventure.spruce.bot](https://adventure.spruce.bot). You should start each skill by creating your RootViewController.

## Testing View Controllers

### 1. Create your test file

- Run `spruce create.test`
- Select `AbstractViewControllerTest`
  - Or select your Skill's primary AbstractTest if this is your third test

### 2. Write your first failing test

- Clear out the existing tests
- Add your first failing test
  - Make sure your namespace is correct
  - Change `adventure` to whatever your namespace is.

```ts
@test()
protected static async canRenderRootSkillView() {
    const vc = this.Controller('adventure.root', {})
}

```

### 3. Create your root view controller

- Run `spruce create.view`
- Create your `RootViewController`

Your first test should be passing minus a type issue. Lets bring it home!

### 4. Finish your first test

```ts
@test()
protected static async canRenderRootSkillView() {
    const vc = this.Controller('adventure.root', {})
    this.render(vc)
}
```

Your RootViewController should always successfully render. If this test ever fails, you have problems.

## View Controller Assertions

The [`vcAssert`](https://github.com/sprucelabsai/heartwood-view-controllers/blob/master/src/tests/utilities/vcAssert.utility.ts) is the primary mechanism for building failing tests. For example, you may want to ensure your `RootViewController` renders 2 `Cards`.

### 1. Failing test

This will involve moving the instantiation of your vc to the `beforeEach` and then using `vcAssert` to assert that your vc renders 2 cards.

```ts
import { vcAssert } from "@sprucelabs/heartwood-view-controllers";
import { AbstractViewControllerTest } from "@sprucelabs/spruce-view-plugin";
import RootSkillViewController from "../../skillViewControllers/Root.svc";

export default class RootSkillViewControllerTest extends AbstractViewControllerTest {
  private static vc: RootSkillViewController;

  protected static async beforeEach() {
    await super.beforeEach();
    this.vc = this.Controller("adventure.root", {});
  }

  @test()
  protected static canRenderRootSkillView() {
    const model = this.vc.render();
    assert.isTruthy(model);
  }

  @test()
  protected static renders2Cards() {
    vcAssert.assertSkillViewRendersCards(this.vc, ["profile", "equip"]);
  }

  @test()
  protected static async requiresLogin() {
    await vcAssert.assertLoginIsRequired(this.vc);
  }

  @test()
  protected static canGetPofileCard() {
    const cardVc = vcAssert.assertSkillViewRendersCard(this.vc, "profile");
    assert.isEqual(cardVc, this.vc.getProfileCardVc());
  }

  @test()
  protected static canGetEquipCard() {
    const cardVc = vcAssert.assertSkillViewRendersCard(this.vc, "equip");
    assert.isEqual(cardVc, this.vc.getEquipCardVc());
  }

  @test()
  protected static async redirectsToAddOrganizationOnLoadIfNoCurrentOrganization() {
    let wasHit = false;

    await this.Fixture("view")
      .getRouter()
      .on("did-redirect", () => {
        wasHit = true;
      });

    await this.load(this.vc);

    assert.isTrue(wasHit);
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
} from "@sprucelabs/heartwood-view-controllers";

export default class RootSkillViewController extends AbstractSkillViewController {
  public static id = "root";
  private profileCardVc: CardViewController;
  private equipCardVc: CardViewController;

  public constructor(options: ViewControllerOptions) {
    super(options);

    this.profileCardVc = this.ProfileCardVc();
    this.equipCardVc = this.EquipCardVc();
  }

  private EquipCardVc() {
    return this.Controller("card", {
      id: "equip",
      header: {
        title: "My great card 2!",
      },
      body: {
        isBusy: true,
      },
    });
  }

  private ProfileCardVc() {
    return this.Controller("card", {
      id: "profile",
      header: {
        title: "My great card!",
      },
      body: {
        isBusy: true,
      },
    });
  }

  public getProfileCardVc() {
    return this.profileCardVc;
  }

  public getEquipCardVc() {
    return this.equipCardVc;
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
    };
  }
}
```

## Authentication

Using `@login()` you can set a client all fixtures will share that make api request. This will also be the client returned from `this.connectToApi()` in your views.

```ts
//test
@login(DEMO_NUMBER_ROOT_SVC)
export default class RootSkillViewControllerTest extends AbstractViewControllerTest {
  
  @seed('organizations', 1)
  protected static async beforeEach() {
    await super.beforeEach();

    /**
     * Is the exact same as @login decorator, don't bother doing this manually
     * const { client } = await this.Fixture('view').loginAsDemoPerson(DEMO_NUMBER_ROOT_SVC)
     * MercuryFixture.setDefaultClient(client)
     **/

    this.client = login.getClient();
    this.vc = this.Controller("adventure.root");
  }

  @test()
  protected static async trySomethingAsPrimaryPerson() {
    await this.bootAndLoad()
    ...
  }

  @test()
  protected static async tryAsSomeoneNotPartOfOrg() {
      await this.Fixture('view').loginAsDemoPerson(DEMO_NUMBER_OUTSIDER)

      // skill will now boot and load with DEMO_NUMBER_OUTSIDER for this test
      await this.bootAndLoad()
      ...
  }

  protected static async bootAndLoad() {
      await this.bootSkill()
      await this.load(this.vc)
  }
}

//production
class RootSkillviewController extends AbstractSkillViewController {
  public async load(options: SkillViewControllerLoadOptions) {
    const client = await this.connectToApi();

    const results = await client.emit("whoami::v2020_01_10");
    const { person } = eventResponseUtil.getFirstResponseOrThrow(results);

    testLog.info(person.phone) 
    //first test logs DEMO_NUMBER_ROOT_SVC
    //second test logs DEMO_NUMBER_OUTSIDER

  }
}
```

## Testing lists

```ts

//test
export default class RootSkillViewControllerTest extends AbstractViewControllerTest {
	@test()
	protected static async rendersList() {
		const listVc = vcAssert.assertCardRendersList(this.vc.getEquipCardVc())

		vcAssert.assertListRendersRow(vc, 'no-entries')


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
    const formVc = this.vc.getFormVc();

    formVc.setValue("name", "Haircut");

    const confirmVc = await vcAssert.assertRendersConfirm(this.vc, () =>
      interactionUtil.submitForm(formVc)
    );

    await confirmVc.accept();

    const match = await this.Store("services").findOne({});

    assert.isEqual(match.name, "Haircut");
  }

  @test()
  protected static async rejectingConfirmDoesNotSave() {
    const formVc = this.vc.getFormVc();

    formVc.setValue("name", "Haircut");

    const confirmVc = await vcAssert.assertRendersConfirm(this.vc, () =>
      interactionUtil.submitForm(formVc)
    );

    await confirmVc.reject();

    const match = await this.Store("services").findOne({});

    assert.isNotEqual(match.name, "Haircut");
  }
}

//production
class RootSkillviewController extends AbstractSkillViewController {
  public constructor(options: ViewControllerOptions) {
    super(options);

    this.formVc = this.FormVc();
    this.formCardVc = this.FormCardVc();
  }

  private FormVc() {
    return this.Controller(
      "form",
      buildForm({
        id: "service",
        schema: serviceSchema,
        onSubmit: this.handleSubmit.bind(this),
        sections: [
          {
            fields: [
              {
                name: "name",
                hint: "Give it something good!",
              },
              "duration",
            ],
          },
        ],
      })
    );
  }

  private FormCardVc() {
    return this.Controller("card", {
      id: "service",
      header: {
        title: "Create your service!",
      },
      body: {
        sections: [
          {
            form: this.formVc.render(),
          },
        ],
      },
    });
  }

  private async handleSubmit({ values }: SubmitHandler<ServiceSchema>) {
    const confirm = await this.confirm({ message: "You ready to do this?" });
    if (confirm) {
      await this.createService(values);
    }
  }

  public getFormVc() {
    return this.formVc;
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
    const vc = this.Controller("my-skill.root", {});
    const activeVc = vcAssert.assertSkillViewRendersActiveRecordCard(vc);
    assert.isEqual(vc.getActiveRecordCard(), activeVc);

    await this.load(vc);

    assert.isTrue(activeVc.getIsLoaded());
  }
}

//production

export default class RootSkillViewController extends AbstractViewController<Card> {
  public constructor(options: ViewControllerOptions) {
    super(options);
    this.activeRecrodCardVc = this.ActiveRecordVc();
  }

  private ActiveRecordVc() {
    return this.Controller(
      "activeRecordCard",
      buildActiveRecordCard({
        header: {
          title: "Your locations",
        },
        eventName: "list-locations::v2020_12_25",
        payload: {
          includePrivateLocations: true,
        },
        responseKey: "locations",
        rowTransformer: (location) => ({ id: location.id, cells: [] }),
      })
    );
  }

  public load(options: SkillViewControllerLoadOptions) {
    const organization = await options.scope.getCurrentOrganization();
    this.activeRecordCardVc.setTarget({ organizationId: organization.id });
  }

  public getActiveRecordCardVc() {
    return this.activeRecordCardVc;
  }
}
```

## Testing scope

Scoping experience to a specific organization or location.

By default, you will be scoped to your latest organization and location.

Learn more [here](views/scope.md).

```ts
//test
@login(DEMO_NUMBER_ROOT_SVC)
export default class RootSkillViewControllerTest extends AbstractViewControllerTest {
  protected static async beforeEach() {
    await super.beforeEach();
    this.views = this.Fixture("view");
    this.orgs = this.Fixture("organization");
  }

  @test()
  protected static async redirectsWhenNoCurrentOrg() {
    let wasHit = false;

    await vcAssert.assertActionRedirects({
      router: this.views.getRouter(),
      action: () => this.load(this.vc),
      destination: {
        id: "organization.add",
      },
    });
  }

  @test()
  @seed("organization", 1)
  protected static async doesNotRedirectWhenCurrentOrg() {
    const organization = await this.orgs.getNewestOrganization();

    //this is optional, the current org defaults to the newest added
    //this.views.getScope().setCurrentOrganization(organization.id)

    await vcAssert.assertActionDidNotRedirect({
      router: this.views.getRouter(),
      action: () => this.load(this.vc),
    });

    assert.isEqualDeep(this.vc.currentOrg, organization);
  }

  @test()
  @seed("organizations", 3)
  protected static async usesOrgFromScope() {
    // since scope loads the newest org by default, we can set
    // it back to the first org to test our productions code
    const [organizations] = await this.orgs.listOrganizations();

    this.views.getScope().setCurrentOrganization(organization.id);

    let wasHit = false;

    await this.load(this.vc);

    assert.isEqualDeep(this.vc.currentOrg, organization);
  }
}

//production
class RootSkillviewController extends AbstractSkillViewController {
  public async load(options: SkillViewControllerLoadOptions) {
    const organization = await options.scope.getCurrentOrganization();

    if (!organization) {
      await options.router.redirect("organization.add" as any);
      return;
    }

    this.currentOrganization = organization;
    this.profileCardVc.setRouter(options.router);
    this.profileCardVc.setIsBusy(false);
  }
}
```

## Testing Stats

```ts
//test
@login(DEMO_NUMBER_ROOT_SVC)
export default class RootSkillViewControllerTest extends AbstractViewControllerTest {
  @test()
  protected static rendersStats() {
    vcAssert.assertRendersStats(this.vc.getCardVc());
  }

  @test()
  @seed("organization", 1)
  protected static async rendersExpectedStatsAfterLoad() {
    await this.bootAndLoad();
  }

  private static async bootAndLoad() {
    await this.bootSkill();
    await this.load(this.vc);
  }
}

//production
class RootSkillviewController extends AbstractSkillViewController {
  public constructor(options: ViewControllerOptions) {
    super(options);

    this.cardVc = this.CardVc();
  }

  public async load(options: SkillViewControllerLoadOptions) {}
}
```

## Testing forms

It is important that you test the graceful handling of failed requests on save. Use the `eventMocker` to make events throw so you can gracefully handle them!

```ts
//test
@login(DEMO_PHONE)
export default class RootSkillViewControllerTest extends AbstractViewControllerTest {

	@test()
	protected static async showsErrorWhenSavingFails() {

		await eventMocker.makeEventThrow('create-organization::v2020_01_01')

		const formVc = this.vc.getFormVc()
		formVc.setValues({...})

		await vcAssert.assertRenderAlert(this.vc, () => interactionUtil.submitForm(formVc))
	}


	@test()
	protected static async savesOrgWhenSubmittingForm() {
		const formVc = this.vc.getFormVc()

		formVc.setValues({...})

		await vcAssert.assertRendersSuccessAlert(this.vc, () => interactionUtil.subimForm(formVc))

		...
	}
}

//production
class RootSkillviewController extends AbstractSkillViewController {
    public constructor(options: SkillViewControllerOptions) {
        super(options)

        this.formVc = this.FormVc()
    }

    private FormVc() {
        return this.Controller('form', buildForm({
            ...,
            onSubmit: this.handleSubmit.bind(this)
        }))
    }

    private async handleSubmit() {
        const values = this.formVc.getValues()

        try {
            const client = await this.connectToApi()
            await client.emitAndFlattenResponses('create-organization::v2020_01_01', {
                payload: values
            })

            await this.alert({ message: 'You did it!!', style: 'success' })

        } catch (err: any) {
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
		vcAssert.assertDoesNotRenderToolBelt(this.vc)

		await this.load(this.vc)

		const toolBeltVc = vcAssert.assertRendersToolBelt(this.vc)
		const toolVc = vcAssert.assertToolBeltRendersTool(this.vc, 'edit')

		assert.isTruthy(toolVc, 'Your ToolBelt does not render a tool with a properly rendered CardVc.')
   
    vcAssert.assertToolInstanceOf(this.vc, 'edit', PeopleSelectViewController)
	}
}

//production
class RootSkillviewController extends AbstractSkillViewController {
	public constructor(options: SkillViewControllerOptions) {
		super(options)

		this.toolBeltVc = this.ToolBelt()
	}

	private ToolBelt() {
		return this.Controller('toolBelt', {
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

## Testing redirects

```ts
//test
export default class RootSkillViewControllerTest extends AbstractViewControllerTest {
	@test()
	protected static redirectsOnSelectLocation() {
		const locationsCardVc = this.vc.getLocationsCardVc()
		const location = await this.views.getScope().getCurrentLocation()

		await vcAssert.assertActionRedirects({
			router: this.views.getRouter(),
			action: () =>
				interactionUtil.clickButtonInRow(
					locationsCardVc.getListVc(),
					location.id,
					'edit'
				),
			destination: {
				id: 'locations.root',
				args: {
					locationId: location.id,
				},
			},
		})
	}
}

//production
class RootSkillviewController extends AbstractSkillViewController {
	public constructor(options: SkillViewControllerOptions) {
		super(options)
		this.locationsCardVc = this.ActiveRecordCardVc()
	}

	public async load(options: SkillViewControllerLoadOptions) {
		this.router = options.router
		await this.locationsCardVc.load()
	}

	private activeRecordCardVc() {
		return this.Controller('activeRecordCard', buildActiveRecordCard({
			...,
			rowTransformer: (location) => ({
				id: location.id
				cells: [
					{
						text: {
							content: location.name
						},
					},
					{
						button: {
							id: 'edit',
							onClick: async () => {
								await this.router?.redirect('locations.root', {
									locationId: location.id
								})
							}
						}
					}
				]
			})
		}))
	}

	public getLocationsCardVc() {
		return this.locationsCardVc
	}
}
```

## Optimizing source

You can inspect your bundled view controller source by setting this in your skill's env:

```bash
VIEW_PROFILER_STATS_DESTINATION_DIR=/path/to/a/dir/that/exists
```

This will write a file called `stats.json` at that destination. You can upload it to [https://webpack.github.io/analyse/#modules](https://webpack.github.io/analyse/#modules) to see what is being included.

## Test hints

1. Look at locations skill
1. Look at forms skill
1. Use `spruce watch.views` and then visit the `https://developer.spruce.bot/#views/heartwood.watch`
1. Checkout the `vcAssert.test.ts` in `heartwood-view-controllers`
1. Give your buttons, list rows, and cards ids and assert against them
   - vcAssert.assertListRendersRow(rowVc, service.id)
   - interactionUtil.clickButtonInFooter(cardVc, 'edit')
