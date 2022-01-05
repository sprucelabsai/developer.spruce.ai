# Tests
TDD by the 3 laws!
****
```bash
# Creating a new test
spruce create.test

# Runing tests 
spruce test

```

## Fixtures
Fixtures are utility classes to help you setup your environment for testing.

1. View Fixture
2. Store Fixture
3. Mercury Fixture
4. Person Fixture
5. Location Fixture
6. Organization Fixture
7. Role Fixture
8. Seed Fixture

## Testing
Fixtures are available when extending `AbstractSpruceFixtureTest` and anything that extends it (all abstract tests that come with the sdk extend this class).

Note that all built in fixtures are available via protected fields on the `AbstractSpruceFixtureTest`.

1. `this.views` => `ViewFixture`
1. `this.roles` => `RoleFixture`
1. `this.locations` => `LocationFixture`
1. `this.organizations` => `OrganizationFixture`
1. `this.people` => `PersonFixture`
1. `this.seeder` => `SeedFixture`
1. `this.skills` => `SkillFixture`


```ts
export default class RenderingRootViewControllerTest extends AbstractSpruceFixtureTest {

    @test()
    protected static gettingFixtures() {

        const organizationFixture = this.Fixture('organization')

        assert.isTruthy(organizationFixture)

        //Save time by accessing the fixture via protected pro
        assert.isTruthy(this.organizations)
        assert.isTruthy(this.locations)
    }
}
```

## Authentication
```ts
@login(DEMO_NUMBER_ROOT)
export default class MySkillViewControllerTest extends AbstractSpruceFixtureTest {

    @test()
    protected static async beforeEach() {
        await super.beforeEach()

        /**
		* Is the exact same as @login decorator, don't bother doing this manually
		* const { client } = await this.Fixture('view').loginAsDemoPerson(DEMO_NUMBER_ROOT_SVC)
		* MercuryFixture.setDefaultClient(client)
		**/

        const client = login.getClient()
        const { client: client2 } = await this.Fixture('view').loginAsDemoPerson()

        assert.isEqual(client, client2) //once default client is set, unless you pass a new number, the client is reused

        const { client: client3 } = await this.Fixture('view').loginAsDemoPerson(DEMO_NUMBER_ROOT_2)
        assert.isNotEqual(client,client3)

    }
}
```
## Seeding data
Seeders for core data (people, locations, roles, etc.) are provided through some killer decorators.

You can also `@seed` from any of your local [stores](/stores.md/index?id=stores).

```ts
//@login sets the default client for all fixtures and seeders going forward
@login(DEMO_NUMBER)
export default class RenderingRootViewControllerTest extends AbstractSpruceFixtureTest {

    @seed('organizations', 2)
    protected static async beforeEach() {
        await super.beforeEach()

        const totalOrgs = await this.Fixture('organization').listOrganizations()
        assert.isLength(totalOrgs, 2)

        //since this is in the beforeEach(), every test will come with 2 organizations
    }

    @test()
    @seed('locations',10)
    protected static async locationsShouldSeed() {
        const currentOrg = await this.Fixture('organization').getNewestOrganization()
        const locations = await this.Fixture('locations').listLocations({ organizationId: currentOrg?.id })
        assert.isLength(locations, 10)
    }
}
```

## Installing your skill
```ts
@login(DEMO_NUMBER)
export default class RenderingRootViewControllerTest extends AbstractSpruceFixtureTest {

    @test()
    @seed('organization',1)
    @install.skills('skill-namespace-1', 'skill-namespace-2')
    protected static async skillsArInstalled() {
        //the skill is only installed at the newest organizatios
        //now your skill can emit events to skills that are installed at the newest org
    }
}
```


## Skill Views
Everything you need to know is under the [Views](/views/index.md?id=testing-view-controllers) section!

## Best Practices

1. Create an abstract test for your skill on the first test where you need something twice.
    * E.g. `AbstractProfileTest`
    * All your future tests should extend this test.
    * Creating helpers like `getNewestInvite` and `listOrgs` is extremely helpful.
    * Set fixtures you need often to local props in `beforeEach()`:
        * Name the prop the plural name of the fixturce
        * `this.views = this.Fixture('views')`
        * `this.orgs = this.Fixture('organizations')`
    * Set stores to local props in `beforeEach`.
        * Name the prop the name of the store: 
        * `this.invites = await this.Store('invites')`
        * `this.profiles = await this.Store('profiles')`
2. Don't create fixtures over and over, save them as protected properties on your Abstract Test.
3. Create helpful getters for things you fetch over and over, e.g. `this.getNewestOrganization()`.
    * Use assertions and helpful error messages to guide future you through proper test setup.

### Example Abstract Skill Test
This is an example of what your skill's test file may look like after a few tests.

```ts
export default class AbstractProfileTest extends AbstractViewControllerTest {
	protected static views: ViewFixture
	protected static profileStore: ProfilesStore
	protected static router: Router

	protected static async beforeEach() {
		await super.beforeEach()

		this.views = this.Fixture('view')
		this.profileStore = await this.Fixture('store').Store('profiles')
		this.router = this.Fixture('view').getRouter()
	}

	protected static async getNewestProfile() {
		const profile = await this.profileStore.findOne({})

		assert.isTruthy(profile, `You gotta @seed('profiles',1) to continue.`)
		return profile
	}

	protected static async getNewestOrg() {
		const org = await this.Fixture('organization').getNewestOrganization()
		assert.isTruthy(org, `You gotta @seed('organizations',1) to continue.`)
		return org
	}

    protected static async listProfiles () {
        const profiles = await this.profileStore.findOne({})
        assert.isAbove(profiles.length, 0, `You gotta @seed('profiles',1) to continue.`)
        return profiles
    }
}

```