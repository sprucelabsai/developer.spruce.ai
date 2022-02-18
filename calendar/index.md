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

