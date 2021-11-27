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

```ts
export default class RenderingRootViewControllerTest extends AbstractSpruceFixtureTest {

    @test()
    protected static gettingFixtures() {

        const organizationFixture = this.Fixture('organization')

        assert.isTruthy(organizationFixture.)
    }
}
```

## Authentication
```ts
export default class MySkillViewControllerTest extends AbstractSpruceFixtureTest {

    @test()
    protected static async beforeEach() {
        await super.beforeEach()

        const { client } = await this.Fixture('mercury').loginAsDemoPerson(DEMO_NUMBER_ROOT)

        //all fixtures use the mercury fixture to connect home, now they all share this client
        MercurcyFixture.setDefaultClient(client)

    }
}
```
## Seeding data
Seeders for core data (people, locations, roles, etc.) are provided through some killer decorators.

You can also `@seed` from any of your local stores.

```ts
//@login sets the default client for all fixtures and seeders going forward
@login(DEMO_NUMBER)
export default class RenderingRootViewControllerTest extends AbstractSpruceFixtureTest {

    @test()
    @seed('organizations', 2)
    protected static async beforeEach() {
        await super.beforeEach()

        const totalOrgs = await this.Fixture('organization').listOrganizations()
        assert.isLength(totalOrgs, 2)
    }
}
```

