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