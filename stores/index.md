# Stores
A place to store your data, agnostic to any database (ok, only mongodb support for now, but more coming based on needs).
****
```bash
# Creating your new store
spruce create.store

# Sync stores (after you rename a class or file)
spruce sync.stores

```


## Stores in listeners
Make sure you are loading only the fields you need (with `includeFields`) so your store doesn't return too many fields and cause your response payload to fail validation. 

```ts
export default async (
	event: SpruceEvent<SkillEventContract, EmitPayload>
): SpruceEventResponse<ResponsePayload> => {

    const store = await event.storeFactory.Store('profiles')
    const profile = await store.findOne({
        target: {
            personId: event.source.personId
        }
    }, {
        includeFields: getFields(getProfileSchema),
    })

    return {
        profile
    }

}


```

## Stores in tests
You can access all the stores you need from test in 2 ways.

1. If your test extends `AbstractStoreTest` -> `const store = await this.Store('invites')`
2. If your test extends `AbstractSpruceFixtureTest` -> `const store = await Fixture('store').Store('invites')`

```ts
export default class AcceptingAnInviteTest extends AbstractStoreTest {
	private static vc: AcceptSkillViewController
    private static invites: InvitesStore

	protected static async beforeEach() {
		await super.beforeEach()
        this.invites = await this.Store('invites')
	}

	@test()
	@seed('invites', 1)
	protected static async youCanSeedDataIntoYourStore() {
        const invite = await this.getNewestInvite()
		assert.isTruthy(invite)
	}

   @test()
   @seed('invites', 20)
    proctected static async helpersLikeGetNewestAndListAreSoNice() {
        const invites = this.listInvites()
		assert.isLength(invites, 20)
    }

	private static async getNewestInvite() {
		const invite = await this.invites.findOne({})
		assert.isTruthy(invite, `Don't forget to @seed('invites', 1) to get started!`)
		return invite
	}
	
	private static async listInvites() {
		const invites = await this.invites.find({})
		assert.isAbove(invite.length, 0, `Don't forget to @seed('invites', 1) to get started!`)
		return invites
	}

	
}

```


