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
If your skill is responsible for one data type or the work an event is getting done can be said to be 'done to your skill', your skill's namespace becomes the subject and you  use shortened event names that are only the action:

1. `appointments.book::v2020_02_02`
2. `invites.send::v2020_02_02`
2. `profiles.create::v2020_02_02`

As the types of data and actions you perform broaden, you'll need to include the subject along with the action.

1. `appointments.create-category::v2020_02_02`
2. `invites.update-notification-preferences::v2020_02_02`
2. `profiles.set-photo::v2020_02_02`

### With schemas

1. Create the invite schema
	* `spruce create.schema`
	* Configure your schema as desired
	* Use `isPrivate: true` on fields you do not want to be exposed outside your skill
2. Create the event
	* `spruce create.event`
3. Configure target
	* You probably need an `organizationId` or `locationId`
	* If the event were `invite.update::v2020_01_10` you would want `inviteId` in the target.
4. Configure payload
	* Make sure hidden fields are dropped using `dropPrivateFields()`
	* Use `dropFields()` to remove anything else you don't need.
	* See the [event docs](../events/index?id=payloads).

