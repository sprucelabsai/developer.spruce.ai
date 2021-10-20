# Event emitter
***

A strictly typed, payload validating event emitter for use in any project.

## Step 1: Dependencies

```bash
yarn add @sprucelabs/mercury-event-emitter
```

## Step 2: Create your emitter class

For Heartwood, we created `SkillViewEmitter.ts` starting with:

```ts
import { AbstractEventEmitter } from '@sprucelabs/mercury-event-emitter'
import { buildEventContract } from '@sprucelabs/mercury-types'

// The contract I'll use to validate event payloads when being emitted
const contract = buildEventContract({
	eventSignatures: {},
})

// Will give us typing based off the contract
export type SkillViewEventContract = typeof contract

export default class SkillViewEmitter extends AbstractEventEmitter<SkillViewEventContract> {

    // Optionally use the singleton approach so you can share your instance across your skill
    private static instance: SkillViewEmitter | undefined

    // Making this private will require people to use the Emitter factory method
	private constructor(contract: Contract) {
		super(contract)
	}

    // We will set the contract for the person using the emitter
    // and leave room for addition work to be done
	public static Emitter() {
		return new this(contract)
	}

    // In our case, we want everyone using 1 instance for the entire skill
    public static getInstance() {
        if (!this.instance) {
			this.instance = this.Emitter()
		}

		return this.instance
    }
}
```

## Step 3: Build your contract

```ts
const contract = buildEventContract({
	eventSignatures: {
		'did-scroll': {
			emitPayloadSchema: buildSchema({
				id: 'didScrollEmitPayload',
				fields: {
					scrollTop: {
						type: 'number',
						isRequired: true,
					},
				},
			}),
		},
	},
})
```

## Step 4: Use your emitter

```ts
// Get your instance or instantiate a new one
const emitter = SkillViewEmitter.getInstance()

// Attach your listener, fully typed
await instance.on('did-scroll', (payload) => {
    console.log(payload.scrollTop)
})

// Use a function defined elsewhere
function callback(payload: EventContractEmitPayloads<SkillViewEventContract>['did-scroll']) {
    console.log(payload.scrollTop)
}

await instance.on('did-scroll', callback)

// Emit your event
await emitter.emit('did-scroll', {
    scrollTop: 0
})
```