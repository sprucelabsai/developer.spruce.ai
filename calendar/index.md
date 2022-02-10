# Calendar

All calendar related functionality is provided by the Calendar skill. While you can use all the components that the Calendar skill uses to build your calendaring experience from scratch, it's much faster and more reliable to use the tools Calendar provides.

---

## 1. Add calendar dependencies

You'll need 2 dependencies to continue. 1 development (for testing) and 1 production (for code compiled and sent to Heartwood.)

```bash
yarn add -D @sprucelabs/spruce-calendar-test-utils
yarn add @sprucelabs/spruce-calendar-skill-support
```

## 2. Register your event types
The calendar will render events with an `eventTypeSlug` property set. That will prompt a lookup for a `CalendarEventType` object that will tell the calendar how to load the event.

You will want to create your `CalendarEventType` during boot of your skill. But, lets start with your first assertions. Remember, write one test at a time and only extract when needed.

```ts
@login(DEMO_NUMBER_CALENDAR_TYPES_ON_BOOT)
export default class SettingUpCalendarEventTypesOnBootTest extends AbstractAppointmentTest {
	private static client: MercuryClient

	protected static async beforeEach() {
		await super.beforeEach()

        //your default client must be a skill client since that's what it will be on boot
		const { client } = await this.skills.loginAsCurrentSkill()
		this.client = client
	}

	@test()
	protected static async canCreateSettingUpCalendarEventTypesOnBoot() {
		await calendarSkillAssert.createsEventTypesOnBoot(
			[{typeSlug: 'appointment', vcId: 'appointments.calendar-event'}],
			this.client,
			() => this.bootSkill()
		)
	}

	@test()
	protected static async createsFromMultipleBoots() {
		await calendarSkillAssert.createsEventTypesWithMultipleBoots(
			[{typeSlug: 'appointment', vcId: 'appointments.calendar-event'}],
			this.client,
			() => this.bootSkill()
		)
	}
}
```

## 3. Register your calendar

Calendars are simple filters on the events to render based on a person's preferences. When you create an event, you can specify it's calendar id. A calendar can also filter the types of events that are allowed to be added to it. 

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
			'appointments',
			login.getClient(),
			['appointment']
		)
	}

	@test()
	protected static async canBeInstalledMultipleTimes() {
		await calendarSkillAssert.createsCalendarsWithMultipleInstalls(
			'appointments',
			login.getClient()
		)
	}
}
```

## 4. Build your CalendarEventViewController

This is one of the shortest, yet most critical pieces of this exercise. One assertion and you'll be walked through the rest. Note, a `CalendarEventViewController` will need to provide a `ToolBeltState` that conforms to the `CalendarTool` interface.

It will help to be familar with the [Tool Belt](/toolBelt/index.md) before continuing!

```ts
export default class CalendarEventViewControllerTest extends AbstractShiftsTest {
	@test()
	protected static async canCreateCalendarEventViewController() {
		calendarSkillAssert.isValidEventViewController({
			views: this.views,
			CalendarEventClass: CalendarEventViewController,
			ToolBeltStateClass: CalendarEventToolBeltState,
		})
	}
}
```

## 5. Optional: Extend AbstractCalendarToolBeltState

You can provide any tool belt state you want from your calendar event, but if you want to get up and moving fast, you'll want to have your state extend `AbstractCalendarToolBeltState`.