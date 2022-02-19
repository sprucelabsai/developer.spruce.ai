# Calendar

All calendar related functionality is provided by the Calendar skill. While you can use all the components that the Calendar skill uses to build your calendaring experience from scratch, it's much faster and more reliable to use the tools Calendar provides.

---

## Overview

This is an overview on how the [calendar.spruce.bot](https://calendar.spruce.bot) is built to support robust customization.

1. A `CalendarSkillViewController` renders the `CalendarViewController` from ['heartwood-view-controllers'](https://github.com/sprucelabsai/heartwood-view-controllers)
2. A `CalendarViewController` renders `CalendarEventViewController`'s
	* You can override the view controller an event uses through 'Event Types'
	* I cover this in detail below!
3. A `CalendarEventViewController` can implement `getToolBeltState()` to take over control of the 'Tool Belt'
	* You can provide your own tools (cards rendered in the tool belt)
	* You can also provide "remote" tools to populate events defined by other skills


## Definition

1. **Calendar Event** - An object represented in the Calendar Skill and defined in `@sprucelabs/calendar-utils` that is represented in the calendar. In context, sometimes just called "Event".
	* *"Don't forget to click the Calendar Event"*
	* *"There are way too many events in this calendar"*
2. **Repeating Event** - Any event with `repeats` set.
	* *"Is that a repeating event?"*
	* *"Configure your repeating event for weekly on Mon, Wed, and Fri"*
3. **Source Event** - The "Repeating Event" future events are generated from (never actually returned from api)
	* *"When updating a repeating event, if they chose 'Update All Events', we actually update the source event"*
	* *"The source event is actually never rendered in the calendar."*
4. **Generated Event** - The event generated from the "Source Event". Will have the same `id` as the source event, but with a different `startDateTimeMs`.
	* *"If we're talking a repeating event, then only generated events are rendered on the calendar."*
5. **Series** - All generated events.
	* *"How many events are in the series?"*
	* *"Technically you'd ask, 'How many generated events are in the series?', but everyone here knows what you mean, so don't sweat it."*


I'm gonna take you through everything right now! But first, lets make sure we have the dependencies we need!

## Add calendar dependencies

We're gonna need 2 dependencies to continue. 1 development (for testing) and 1 production (for code compiled and sent to Heartwood.)

```bash
yarn add -D @sprucelabs/spruce-calendar-test-utils
yarn add @sprucelabs/spruce-calendar-components

```


Ok, that was easy, now the question is:

## What do you want to do?
1. [Create your own `CalendarEventViewController`](/calendar/events.md)
2. [Customize the Tool Belt for your event](/calendar/events.md)
3. [Create your own tool](/calendar/tools.md)
4. [Create your own remote tool](/calendar/tools.md)

