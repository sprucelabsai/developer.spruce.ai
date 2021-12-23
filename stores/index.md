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

```ts
export default class AcceptingAnInviteTest extends AbstractInviteTest {
	private static vc: AcceptSkillViewController
    private static invites: InvitesStore

	protected static async beforeEach() {
		await super.beforeEach()
		this.vc = this.Controller('invite.accept', {})
        this.invites = this.Fixture('store').Store('invites')
	}

	@test()
	protected static async alertsAndRedirectsIfLoadedWithBadInviteId() {
		await this.bootSkill()

		await vcAssertUtil.assertRendersAlertThenRedirects({
			router: this.viewFixture.getRouter(),
			vc: this.vc,
			action: () => this.load(this.vc, { inviteId: 'aoeu' }),
			destination: {
				id: 'heartwood.root',
			},
		})
	}

	@test()
	@seed('invites', 1)
	protected static async loadsAPendingInvite() {
        const invite = await this.getNewestInvite()

		await vcAssertUtil.assertActionDoesNotRedirect({
			router: this.viewFixture.getRouter(),
			action: () => this.bootAndLoadWithInvite(),
		})
	}

    private static async bootAndLoadWithInvite() {
        await this.bootSkill()
        const invite = await this.getNewestInvite()
        await this.load(this.vc, {
            inviteId: invite.id
        })
    }

    private static async getNewestInvite() {
        return this.invites.findOne({})
    }
}

```

