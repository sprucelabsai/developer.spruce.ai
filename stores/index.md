# Stores

A place to store your data, agnostic to any database.
****

```bash
# Creating your new store
spruce create.store

# Sync stores (after you rename a class or file)
spruce sync.stores

```

## Schemas in stores

At the bottom of your Store implementation file are the schemas used to validate data based on specific actions. 

```ts
const fullSchema = ... // what is returned from the store when calling .find(...) or .findOne(...)
const createSchema = ... // validates values passed to .create(...) or .createOne(...)
const updateSchema = ... // validates values passed to .update(...), .updateOne(...), or .upsert(...)
const databaseSchema = ... // the actual values stored in the database
```

It is considered a best practice to create a fully typed schema using `spruce create.schema` and setting it to the fullSchema.

```bash
spruce create.schema 
```

```ts
import userSchema from '#spruce/schemas/namespace/v2023_03_03/user.schema'

...

const fullSchema = userSchema
```

## Hooks

There are cases when you need to mutate values before they are saved or retrieved from the database. You can implement any of the following methods in your Store implementation to do the work you want before/after saving, updating, or retrieving data!

```ts
protected willCreate?(
	values: CreateRecord
): Promise<Omit<DatabaseRecord, 'id'>>

protected didCreate?(values: CreateRecord): Promise<void>

protected willUpdate?(
	updates: UpdateRecord,
	values: DatabaseRecord
): Promise<Partial<DatabaseRecord>>

protected didUpdate?(
	old: DatabaseRecord,
	updated: DatabaseRecord
): Promise<void>

protected willScramble?(
	values: Partial<DatabaseRecord> & { _isScrambled: true }
): Promise<Partial<DatabaseRecord>>
```

## Stores in listeners

Make sure you are loading only the fields you need (with `includeFields` ) so your store doesn't return too many fields and cause your response payload to fail validation. 

```ts
export default async (
	event: SpruceEvent<SkillEventContract, EmitPayload>
): SpruceEventResponse<ResponsePayload> => {

	const { stores, source } = event

    const store = await stores.getStore('profiles')
    const profile = await store.findOne({
        target: {
            personId: source.personId
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
export default class AcceptingAnInviteTest extends AbstractSpruceFixtureTest {
	private static vc: AcceptSkillViewController
    private static invites: InvitesStore

	protected static async beforeEach() {
		await super.beforeEach()
        this.invites = await this.stores.getStore('invites')
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

## Postgres

By default, when you are using `#sprucelabs/data-stores` you will get a Mongodb and in memory adapters. If you want to add Postgres support, you must import the dependency.

```bash
yarn add @sprucelabs/postgres-data-store
```

Then you can configure your databes in your env.

```env
DATABASE_CONNECTION_STRING="postgres://postgres:password@localhost:5432/database_name"
```

## Chroma Data Store

Give your skill the ability to store and retrieve data from a Chroma database for vector based searching. This gives your Data Store the ability to handle semantic and nearest neighbor searches.

### Running Chroma

1. Clone this rep
2. Run `yarn start.chroma.docker`

### Setting an embedding model

By default , the ChromaDabatase class will use llama3.2 hosted through Ollama to generate embeddings

#### Installing Ollama

1. Visit https://ollama.com
2. Click "Download"
3. Select your OS

#### Installing Llama3.2

Llama 3.2 is the newest version of Llama (as of this writing) that supports embeddings.

1. Inside of terminal, run `ollama run llama3.2`
2. You should be able to visit http://localhost:11434/api/embeddings and get a 404 response (this is because the route only accepts POST requests)

### Improving embeddings with `nomic-embed-text`

We have seen significantly better search performance when using `nomic-embed-text` to generate embeddings.

### Connecting to Chroma

Use the connection string: `chromadb://localhost:8000` is your skill.

Coming sooon..
