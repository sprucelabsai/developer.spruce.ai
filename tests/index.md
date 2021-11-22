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

## Seeding data
Seeders for core data (people, locations, roles, etc.) are provided through their cooresponding fixture.

```ts
export default class RenderingRootViewControllerTest extends AbstractSpruceFixtureTest {

    @test()
    protected static async beforeEach() {
        await super.beforeEach()

        //check each fixture for all methods starting with `seed`
        this.organization = this.Fixture('organization').seedDemoOrganization()

        //seed a location can take an optional organization, otherwise it'll create an organization
        const locationFixture = this.Fixture('locatino')

        const locationWithNewOrg = await locationFixture.seedDemoLocation()
        const locationAtSameOrg = await locationFixture.seedDemoOrganization({
            organizationId: locationWithNewOrg.organizationId
        })
    }
}
```