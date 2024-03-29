# Mercury
The event engine that facilitates the communication between Skills.
****

```bash
# Introducing new events to Mercury
spruce create.event

# Listening to events
spruce listen.event

# Pull latest and generate types and schemas
spruce sync.events

```

## Anatomy of an event

### Structure

1. Fully qualified event name (fqen)
2. Target
3. Payload
4. Source

### Naming

Core Events

* action-subject::version
* `create-organization::v2020_01_01`
* `update-role::v2020_01_01`

Skill Events

1. namespace.action-subject::version
	* `appointments.create-category::v2020_01_10`
	* `shifts.create-shift-type::v2020_01_10`
2. namespace.subject::version
	* `invite.send::v2020_01_01`
	* `appointments.book::v2020_01_01`

## Global events
Events that are global do not need a target with `organizationId` or `locationId`. Your skill will need special permissions to be able to emit global events. 

## Targets
Unless your event is global, your target may look something like this.

```ts
const acceptEmitTargetBuilder = buildSchema({
	id: 'acceptEmitTarget',
	fields: {
		organizationId: {
			type: 'id',
			isRequired: true,
		},
	},
})

export default acceptEmitTargetBuilder

```


## Payloads
The approach you take to defining your payload is up to your requirements. One way you could do it would be to start by creating a schema with `spruce create.schema` and then using that schema in your payload. This approach keeps your events in sync with your schemas, which can make managing your events effortless (because updating the schema can update the event signature).

```ts
import inviteBuilder from '../../../schemas/v2021_12_16/invite.builder'

const sendEmitPayloadBuilder = buildSchema({
	id: 'sendEmitPayload',
	fields: {
		...dropPrivateFields(
			dropFields(inviteBuilder.fields, [
				'id',
				'dateCreated',
				'status',
				'target',
			])
		),
	},
})

export default sendEmitPayloadBuilder

```

**Notes**: You should never include one of your own generated files in your builder. Include builders in builders is the rule.


## Emitting events


```ts

// will throw an error if any response fails
const [{ auth }] = await client.emitAndFlattenResponses('whoami::v2020_12_25')

//functionally equivalent to
const results = await client.emit('whoami::v2020_12_25')
const { auth } = eventResponseUtil.getFirstResponseOrThrow(results)


const payloads = []

//listening to each skill that response
const results = await client.emit('test-skill::register-dashboard-cards', {}, ({ payload }) => {
	payloads.push(payload)
})

//getting all payloads from responses
const { payloads: all, errors } = eventResponseUtil.getAllPayloadsAndErrors(results, SpruceError)

assert.isFalsy(errors)
assert.isEqualDeep(all, payloads)

```


