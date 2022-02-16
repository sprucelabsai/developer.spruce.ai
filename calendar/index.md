# Calendar

All calendar related functionality is provided by the Calendar skill. While you can use all the components that the Calendar skill uses to build your calendaring experience from scratch, it's much faster and more reliable to use the tools Calendar provides.

---

## 1. Add calendar dependencies

You'll need 2 dependencies to continue. 1 development (for testing) and 1 production (for code compiled and sent to Heartwood.)

```bash
yarn add -D @sprucelabs/spruce-calendar-test-utils
yarn add @sprucelabs/spruce-calendar-components
```

## 2. Register your event types
Events have a type. These types help me understand where and how to render your events. The calendar will render events with a matching `eventTypeSlug`. Event types have a `slug` for easy lookup and a `vcId` to know which view controller to use to render your event.

You will want to create your `CalendarEventType` during boot of your skill since they are [global](/views/scope.md?id=what-does-scope-even-mean). But, lets start with your first assertions. Remember, write one test at a time and only extract when needed.

```ts
@login(DEMO_NUMBER_CALENDAR_TYPES_ON_BOOT)
export default class SettingUpCalendarEventTypesOnBootTest extends AbstractAppointmentTest {
	private static client: MercuryClient

	protected static async beforeEach() {
		await super.beforeEach()

        // your default client must be a skill client since that's what it will be on boot
		const { client } = await this.skills.loginAsCurrentSkill()
		this.client = client
	}

	@test()
	protected static async canCreateSettingUpCalendarEventTypesOnBoot() {
		await calendarSkillAssert.createsEventTypesOnBoot(
			[
				// using the same vcId for both types for this example
				{typeSlug: 'break', vcId: 'shifts.calendar-event'},
				{typeSlug: 'block', vcId: 'shifts.calendar-event'},
				{typeSlug: 'shift', vcId: 'shifts.calendar-event'},
			],
			this.client,
			() => this.bootSkill()
		)
	}

	@test()
	protected static async createsFromMultipleBoots() {
		await calendarSkillAssert.createsEventTypesWithMultipleBoots(
			[
				{typeSlug: 'break', vcId: 'shifts.calendar-event'},
				{typeSlug: 'block', vcId: 'shifts.calendar-event'},
				{typeSlug: 'shift', vcId: 'shifts.calendar-event'},
			],
			this.client,
			() => this.bootSkill()
		)
	}
}
```

## 3. Register your calendar

Calendars are simple filters on the events to render based on a person's preferences. When you create an event, you can specify it's calendar id. Any calendar can support many event types (or none), but I highly recommend you assigne the event types you've previously created above to your calendar for the best experience.

```ts
@login(DEMO_NUMBER_INSTALL_SKILL)
export default class SettingUpCalendarsOnInstallTest extends AbstractAppointmentTest {
	@seed('organizations', 1)
	@install.skills('appointments')
	protected static async beforeEach() {
		await super.beforeEach()
		await this.bootSkill()
	}

	@test()
	protected static async canCreateSettingUpCalendarsOnInstall() {
		await calendarSkillAssert.createsCalendarOnInstall(
			'breaks-blocks',
			login.getClient(),
			['break','block']
		)
		
		await calendarSkillAssert.createsCalendarOnInstall(
			'shifts',
			login.getClient(),
			['shift']
		)
	}

	@test()
	protected static async canBeInstalledMultipleTimes() {
		await calendarSkillAssert.createsCalendarsWithMultipleInstalls(
			'breaks-blocks',
			login.getClient()
		)
		
		await calendarSkillAssert.createsCalendarsWithMultipleInstalls(
			'shifts',
			login.getClient()
		)
	}
}
```

## 4. Build your CalendarEventViewController

Since you've already specified an `vcId` in step 2, it's time to create a valid `CalendarEventViewController`.

This is one of the shortest, yet most critical pieces of this exercise. One assertion and you'll be walked through the rest. Note, a `CalendarEventViewController` will need to provide a `ToolBeltState` that conforms to the `CalendarTool` interface.

It will help to be familar with the [Tool Belt](/toolBelt/index.md) before continuing!

First, create your view and select the `CalendarEvent` view model.

```bash
spruce create.view --viewModel CalendarEvent
```

Then, do your assertion and follow the instructions:

```ts
export default class CalendarEventViewControllerTest extends AbstractShiftsTest {
	@test()
	protected static async canCreateCalendarEventViewController() {
		calendarSkillAssert.isValidEventViewController({
			views: this.views,
			CalendarEventClass: ShiftsEventViewController,
			ToolBeltStateClass: ShiftsEventToolBeltState,
		})
	}
}
```

## 5. Optional: Extend AbstractCalendarEventToolBeltState

You can provide any tool belt state you want from your calendar event, but if you want to get up and moving fast, you'll want to have your state extend `AbstractCalendarEventToolBeltState`.

```ts
export default class CalendarToolBeltStateTest extends AbstractShiftsTest {
	protected static sm: CalendarToolBeltStateMachine
	protected static state: ShiftsEventToolBeltState

	protected static async beforeEach() {
		await super.beforeEach()
		await this.bootSkill()

		const { stateMachine, toolBeltVc } =
			CalendarToolBeltStateMachineTestFactory.StateMachine(this.views)

		this.sm = stateMachine
		this.state = new ShiftsEventToolBeltState()
	}


	@test()
	protected static async stateInheritsCalendarToolBeltState() {
		await calendarSkillAssert.toolBeltStateProperlyInheritsAbstractToolBeltState(
			this.sm,
			this.state
		)
	}

	@test()
	protected static async stateAddsTitleTool() {
		await calendarSkillAssert.toolBeltStateAddsTool({
			state: this.state,
			toolId: 'title',
			views: this.views,
		})
	}
	
	@test()
	protected static async titleToolIsCorrectType() {
		await calendarSkillAssert.toolBeltStateAddsTool({
			state: this.state,
			toolId: 'shift',
			views: this.views,
			Class: EventTitleToolViewController,
		})
	}
}
```

Production code for your state:

```ts
class ShiftsEventToolBeltState extends AbstractCalendarEventToolBeltState {
	public id = 'shift'

	public async load(options: any) {
		await super.load(options)

		await this.addTool({
			cardVcId: 'calendar.event-title-card',
			id: 'title',
			lineIcon: 'add-circle',
		})
	}
}

```

## 6. Creating your own calendar tool

A `Tool` is just a `Card` that renders in the [Tool Belt](../toolBelt/index.md). The difference is that your tool will implement the `CalendarTool` interface.

This interface is built to handle State Machine context changes on the calendar. 

***Here's how you should approach writing your tool tests:***

1. Write your tests as if you're not a tool to get all the functionality in.
1. Make sure your tool populates as expected based on context returned from `getContext()` sent to the constructor.
2. Make sure your tool updates as expected when `handleUpdateContext(context)` is invoked on your vc.
3. Make sure your tool invokes `updateContext` whenever changes need to be propagated to the calendar and other tools (honoring any changes passed to `handleUpdateContext(context)`)
4. You use `getPersonFromEvent()` passed to the constructor to get the person off the event (not event.target.personId, may return null).

This is pretty close to how your test will end up:

```ts
export default class EventTitleToolTest extends AbstractSpruceFixtureTest {
	private static vc: EventTitleToolViewController
	private static context: CalendarToolBeltContext

	private static get formVc() {
		return this.vc.getFormVc()
	}

	protected static async beforeEach() {
		await super.beforeEach()
		await this.bootSkill()

		const { stateMachine, toolBeltVc } =
			CalendarToolBeltStateMachineTestFactory.StateMachine(this.views)

		this.sm = stateMachine
		this.context = this.sm.getContext()
		this.vc = this.Vc()
	}

	@test()
	protected static rendersForm() {
		const formVc = vcAssert.assertCardRendersForm(this.vc)
		assert.isEqual(formVc, this.formVc)
	}

	@test()
	protected static formRendersExpectedFields() {
		vcAssert.assertFormRendersFields(this.formVc, ['title', 'subtitle'])
	}

	@test()
	protected static doesNotRenderSubmitButtons() {
		assert.isFalse(this.formVc.shouldShowSubmitControls())
	}

	@test('starts with event context 1', {
		title: 'hey',
		subtitle: 'there',
	})
	@test('starts with event context 2', {
		title: 'go',
		subtitle: 'team',
	})
	protected static isPopulatedWithEventFromContext(expected: any) {
		this.context.event.timeBlocks[0].title = expected.title
		this.context.event.timeBlocks[0].subtitle = expected.subtitle

		this.vc = this.Vc({
			context: this.context,
		})

		const values = this.formVc.getValues()
		assert.isEqualDeep(values, expected)
	}

	@test()
	protected static doesNotThrowIfBadContextSent() {
		this.Vc()
	}

	@test('editing form calls update context 1', {
		title: 'taco',
		subtitle: 'bravo',
	})
	@test('editing form calls update context 2', {
		title: 'little',
		subtitle: 'burrito',
	})
	protected static async editingFormCallsUpdateContext(updates: any) {
		let wasHit = false
		let passedUpdates: any

		this.vc = this.Vc({
			updateContext: async (context) => {
				wasHit = true
				passedUpdates = context
			},
		})

		assert.isFalse(wasHit)
		await this.formVc.setValues(updates)
		assert.isTrue(wasHit)

		const { event } = this.context

		event.timeBlocks[0].title = updates.title
		event.timeBlocks[0].subtitle = updates.subtitle

		assert.isEqualDeep(passedUpdates, {
			event,
		})
	}

	@test()
	protected static async callingHandleContextUpdateUpdatesTheForm() {
		const { event } =
			await calendarToolBeltInteractor.simulateRandomContextUpdate(
				this.sm,
				this.vc
			)

		const values = this.formVc.getValues()
		assert.isEqualDeep(values, {
			title: event.timeBlocks[0].title,
			subtitle: event.timeBlocks[0].subtitle,
		})
	}


	private static Vc(options?: Partial<CalendarToolOptions>) {
		return CalendarToolFactory.Tool(this.sm, 'calendar.event-title-card', {
			updateContext: async () => {},
			...options,
		}) as EventTitleToolViewController
	}

}
```

Production code:

```ts
export default class EventTitleToolViewController
	extends AbstractViewController<Card>
	implements CalendarTool
{
	public static id = 'event-title-card'
	private cardVc: CardViewController
	private formVc: FormVc
	private getContext: GetCalendarToolBeltContextHandler
	private updateContextHandler: UpdateCalendarToolBeltContextHandler

	public constructor(options: ViewControllerOptions & CalendarToolOptions) {
		super(options)

		const { getContext, updateContext } = options

		this.getContext = getContext
		this.updateContextHandler = updateContext

		this.formVc = this.FormVc()
		this.cardVc = this.CardVc()
	}

	private CardVc(): CardViewController {
		return this.Controller('card', {
			body: {
				sections: [
					{
						form: this.formVc.render(),
					},
				],
			},
		})
	}

	private FormVc(): FormVc {
		return this.Controller(
			'form',
			buildForm({
				schema: formSchema,
				shouldShowSubmitControls: false,
				onChange: () => this.handleChangeForm(),
				sections: [
					{
						fields: ['title', 'subtitle'],
					},
				],
				values: {
					title: this.getContext().event?.timeBlocks?.[0]?.title,
					subtitle: this.getContext().event?.timeBlocks?.[0]?.subtitle,
				},
			})
		)
	}

	private async handleChangeForm() {
		const { event } = this.getContext()

		event.timeBlocks[0] = {
			...event.timeBlocks[0],
			...this.formVc.getValues(),
		}

		return this.updateContextHandler({
			event: {
				...event,
			},
		})
	}

	public async handleUpdateContext(
		context: CalendarToolBeltContext
	): Promise<void> {
		await this.formVc.setValues({
			title: context.event.timeBlocks[0].title,
			subtitle: context.event.timeBlocks[0].subtitle,
		})
	}

	public getFormVc(): FormVc {
		return this.formVc
	}

	public render() {
		return this.cardVc.render()
	}
}

```


## 7. Providing remote tools

If you want to drop a tool inter the Tool Belt for an event type a different skill provides, you can do the following:

1. Listen to `calendar.register-event-tools`
2. Array of view controller id's for all the tools you want
3. Create your tool (just an AbstractViewController<Card>)
4. Implement `RemoteCalendarTool` interface how you see fit


```bash
spruce add.listener --namespace calendar
```


## Notes:

1. If you are trying to get the person off an event, use `getPersonFromEvent()` that is passed to the constructor of your tool. Don't use `event.target.personId` as the person tied ot an event might be different than the person the event is targeting.

`getPersonFromEvent()` is implemented by the skill creator and may do other lookups, like finding a client vs a teammate.