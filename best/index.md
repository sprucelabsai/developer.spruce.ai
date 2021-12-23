# Best Practices
Build Better
****

It will take everyone to hold the line on these standards across the platform. Anytime we see something that needs to be refactored to follow best practices, we do it. We do this because we are proud of what we build and have lived through the pain of not doing it.

## CRUD Events

When creating an event to manipulate data, our generic verbs are as follows:

1. **Create**
    * fqen: `appointments.create-service::v2020_01_01`
    * Respond with the newly created record
    * Response is an object keyed with the id of the schema of the data, e.g. `{ service }`
2. **Update**
    * fqen: `appointments.update-service::v2020_01_01`
    * Response is same as above, returning the updated record, e.g. `{ service }`
3. **Get**
    * fqen: `appointments.get-service::v2020_01_01`
    * Target should be the id of the schema and an organizationId/locationId, e.g. `{ serviceId: string, organizationId: string}`
4. **List**
    * fqen: `appointments.list-services::v2020_01_01`
    * Target should be used to filter results and include an organizationId or locationId, e.g. `{ categorieIds?: string[], organizationId: string }`

## View Controllers

### Constructors
Your constructors should be this clean. Each card being constructed through a private factory method. A clean constructor makes your entire view controller easier to digest.

```ts
export default class AddServiceSkillViewController extends AbstractSkillViewController {
	public static id = 'add-service'
	private formCardVc: CardViewController
	private categorySelectCardVc: CategorySelectCardViewController
	private formVc: FormViewController<SpruceSchemas.Appointments.v2021_06_23.ServiceSchema>
	private controlsCardVc: CardViewController

	protected constructor(options: ViewControllerOptions) {
		super(options)

		this.controlsCardVc = this.ControlsCardVc()
		this.formVc = this.FormVc()
		this.formCardVc = this.FormCardVc()
		this.categorySelectCardVc = this.CategorySelectCardVc()
	}
    
}
```

## Schemas

1. Your builders should not import anything from `#spruce`. 

## Tests

Testing is so important to us, there is a [section](../tests/index.md?id=best-practices) dedicated to it.

## Stores

1. Whenever you are querying a data store, only ask for the fields you need. 
	* In an event, use the fields from the [reponsePayload or emitPayload](../stores/index.md?id=stores-in-tests).


## Events 
Setting up your event can be very easy. Managing events can be just as easy if you setup everything correctly. In this scenario, let's say we are managing `Invites`. Here is how you should approach designing your event.

### Naming events


### With schemas

1. Create the invite schema
	* `spruce create.schema`
	* Configure your schema as desired
	* Use `isHidden: true` on fields you do not want to be exposed outside your skill
2. Create the event
	* `spruce create.event`
3. Configure target
	* You probably need an `organizationId` or `locationId`
	* If the event were `invite.update::v2020_01_10` you would want `inviteId` in the target.
4. Configure payload
	* Make sure hidden fields are dropped using `dropPrivateFields()`
	* Use `dropFields()` to remove anything else you don't need.
	* See the [event docs](../events/index?id=payloads).

