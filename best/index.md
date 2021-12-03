# Best Practices
Build Better
****

It will take every to make implement these standards across the platform. Anytime we see something that needs to be refactored to follow best practices, we do it. We do this because we are proud of what we create and have lived thourgh the pain of not doing it.

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