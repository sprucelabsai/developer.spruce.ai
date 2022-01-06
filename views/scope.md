## What does scope even mean?

In the context of Heartwood "scope" specifically refers to an organization or a location that all operations, permissions, and data filter by for a particular session.

While a person is viewing one of your Skill Views, they may chose to only show information relevant for a specific location and later decide to change to another location.

It is up to you, the mightly skills developer, to honor any scope set (if it makes sense for your skill).

### Scoping your skill view's behaviors
You can let Heartwood take care of requiring a location or an organization to be selected by implementing `getScopedBy()` in your skill view.

```ts
export default class RootSkillViewController extends AbstractSkillViewController<Args> {
    public getScopedBy() {
        return 'organization' // 'location' 'none'
    }
}

```

### Loading scope
A Scope instance is passed to your Skill View Controller's `load` hook when invoked after first render.

```ts
export default class RootSkillViewController extends AbstractSkillViewController<Args> {
    public async load(options: SkillViewControllerLoadOptions<Args>) {

        const { scope } = options

        //getting scope
		const organization = await scope.getCurrentOrganization()
		const location = await scope.getCurrentLocation()

        //setting scope
        scope.setCurrentOrganizationId(organization.id)
        scope.setCurrentLocationId(organization.id)


    }
}

```

### Test scope
Test scope is accessible through the View Fixture. Make sure you have [seeded some organizations and locations](tests/index?id=seeding-data) before starting!

```ts
export default class RenderingRootViewControllerTest extends AbstractLocationsViewsTest {


    @test()
    protected static isScopedByOrganization() {
        vcAssertUtil.assertSkillViewScopedBy(this.vc, 'organization')
    }

    @test()
	protected static async loadingSetsStartingLocation() {
        const scope = this.views.getScope()

        //getting scope
		const organization = await scope.getCurrentLocation()
		const location = await scope.getCurrentLocation()

        //setting scope
        scope.setCurrentOrganization(organization.id)
        scope.setCurrentLocation(organization.id)

	}

    
}
```