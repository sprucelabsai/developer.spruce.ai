# Custom events and tool belts

You can customize how the calendar renders your events and how the tool belt renders using most the tools you already know. Follow the steps below if you want to customize how an event renders OR you want to customize the tool belt for your event! 👇

---

## 1. Register your event types
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

## 2. Register your calendar

Calendars are simple filters on the events to render based on a person's preferences. When you create an event, you can specify it's calendar id. Any calendar can support many event types (or none), but I highly recommend you assign the event types you've previously created above to your calendar for the best experience.

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

## 3. Build your CalendarEventViewController

Since you've already specified an `vcId` in step 2, it's time to create a valid `CalendarEventViewController`.

This is one of the shortest, yet most critical pieces of this exercise. One assertion and you'll be walked through the rest. Note, a `CalendarEventViewController` will need to provide a `ToolBeltState` that conforms to the `CalendarTool` interface.

It will help to be familiar with the [Tool Belt](/toolBelt/index.md) before continuing!

First, do your assertion like below. In fact, just copy and past this test and work to make it pass.

### Step 1: Make failing test

Even types will fail on this one. As you work to make types pass, the `calendarSkillAssert` library will walk you through implementation details.

```ts
export default class CalendarEventViewControllerTest extends AbstractShiftsTest {
	@test()
	protected static async canCreateCalendarEventViewController() {
		calendarSkillAssert.isValidEventViewController({
			views: this.views,
			CalendarEventClass: ShiftsEventViewController,
			ToolBeltStateClass: ShiftsToolBeltState,
		})
	}
}
```

### Step 2: Create your view controller

```bash
spruce create.view --viewModel CalendarEvent
```

Once your View Controller is created, you'll be able to import to first the first type issue.

### Step 3: Create your Tool Belt State

There is nothing special about a state other than it conforming to the `ToolBeltState` interface. 

1. Create a state file
	* `/src/toolBelt/ShiftsToolBeltState.ts`
2. Make sure it implements the `ToolBeltState` interface.
3. Fix the import in your test to make it fail on the next step.

If you don't want to start your tool belt from scratch (which I don't recommend), you can extend `AbstractCalendarEventToolBeltState`. 

Keep on reading!

## 4. Optional: Extend AbstractCalendarEventToolBeltState

You can provide any tool belt state you want from your calendar event, but if you want to get up and moving fast, you'll want to have your state extend `AbstractCalendarEventToolBeltState`.

```ts
export default class CalendarToolBeltStateTest extends AbstractShiftsTest {
	protected static sm: CalendarToolBeltStateMachine
	protected static state: ShiftsToolBeltState

	protected static async beforeEach() {
		await super.beforeEach()
		await this.bootSkill()

		const { stateMachine, toolBeltVc } =
			CalendarToolBeltStateMachineTestFactory.StateMachine(this.views)

		this.sm = stateMachine
		this.state = new ShiftsToolBeltState()

		await calendarSkillAssert.beforeEach(this.views, login.getClient())
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

	@test()
	protected static async loadsRemoteTools() {
		await calendarSkillAssert.stateFetchesAndRendersRemoteTools({
			state: this.state,
			views: this.views,
		})
	}
}
```

Production code for your state:

```ts
class ShiftsToolBeltState extends AbstractCalendarEventToolBeltState {
	public id = 'shift'

	public async load(sm: CalendarToolBeltStateMachine): Promise<void> {

		await super.load(sm)

		await this.addTool({
			cardVcId: 'calendar.event-title-card',
			id: 'title',
			lineIcon: 'add-circle',
		})


		const tools = new CalendarToolRegistrar(sm)
		await tools.fetchAndAddCards()
	}
}

```
