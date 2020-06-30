# Builders

Build rich digital experiences for every device.

```bash
# Build a skill view
spruce heartwood.view

Options: 

	-v, --skillViewSlug <string>	           The slug for this view, like `location-dashboard` or `user-profile`

	-s, --isCentered				           Is this whole view centered?

	-h, --header <json>			            JSON of the header

	--isSidebarCollapsed 		              Is the sidebar collapsed? 

	--isHeaderCollapsed			            Is the header collapsed?

	--contentLayout <json>		             JSON of layout builder in the content section

	--sidebarLayout <json>		             JSON of layout builder in the sidebar


# Build a card
spruce heartwood.card

Options:

	-v, --skillViewSlug <string>	           The skill view slug you want to drop this card onto 

	-i, --id <string> 			             The id of this card

	-h, --header <json>		  	          JSON representing the header

	--headerImage <json>		 	          JSON representing the header image

	--onboarding <json>		  	          JSON of an onboarding card

	--b, --body <json>		   	          JSON of the body

	-f, --footer <json>		  	          JSON of the footer


# Build a form to collect input
spruce heartwood.form

Options:

	-v, --initialValues <json>				 JSON of the initial values

	-r, --renderAs <page|default|dialog>	   Let this form know how it is rendered

	-d, --isDirty							  Signifies something has changed

	--isValid								  Should the primary button be enabled?

	-b, --isBusy							   Shows loading over buttons

	-d, --dialogButtons <json>				 JSON of buttons that show in the dialog if renderAs=dialog

	-s, --schema <json>						JSON of schema definition used by this form

	--sections <json>						  JSON of the sections


# Build a list of items
spruce heartwood.list

Options:

	-i, --id <string>			              Id of this list

	-h, --header <json>			            JSON of the list header

	--items <json>				             JSON of the list items

	--isSmall					              Should the list use a more compact mode?

	--areSeparatorsVisible		             Should I render the separator between each item?

	--isLoading					            Will render in a loading state where every list item is turned into a loader

	-s, --selectable <json>		            JSON of the checkbox or radio that'll be used in each list item

# Build a layout
spruce heartwood.layout

	-i, --items <json>			             JSON of the items that compose this layout

# Emit changes to definitions to the world
spruce heartwood.sync
```

## Building your first component
Lets create a [card](/builders/index?id=cards) that allows a person to see their schedule for the day.

```bash
spruce heartwood.card upcomingAppointments
```

<!-- panels:start -->
<!--div:title-panel-->
## Generated files
<!-- div:left-panel -->
After running `spruce heartwood.card` up to 2 files were created for you.

1. **Handler:** `.src/events/{{version}}/get-cards/get-cards.handler.ts`
	* Only applies to cards & views 
	* Will ensure your new component renders where it should
2. **Builder:** `.src/builders/{{version}}/cards/upcomingAppointments.definition.ts`
	* After making changes, run `spruce builder:sync` if not already running `spruce watch`

<!-- div:right-panel -->
<!-- tabs:start -->
#### ** 1. Handler **
```typescript
// .src/events/2020-10-01/get-dashboard-cards/upcomingAppointments/handler.ts

import upcomingAppointments from '../../builders/2020-10-01/cards/upcomingAppointments'

export default async (ctx: ISpruce, e: SpruceEvents.Core.IGetDashboardCards) => {
	// load upcoming appointments
	const card = await upcomingAppointments({ ctx  })

	return [card]
}
```
#### ** 2. Builder **
```typescript
// .src/builders/1.0/cards/upcomingAppointments.ts
import { buildCard } from '@sprucelabs/heartwood-skill'

export default buildCard({
	buildState: async function(ctx: ISpruce, options) {
		const upcomingAppointments = await ctx.mercury.emit(SpruceEvents.Booking.GetUpcomingAppointments)
		return {
			...options,
			upcomingAppointments
		}
	},
	header: {
		textHook: (ctx) => {
			return `Hey ${ctx.state.user.friendlyName}! You have ${ctx.state.upcomingAppointments.length} upcoming appointments!`
		},
		footer: {
			primaryButton: {
				titleCallback: (ctx) => {

				},
				onClick: (ctx) => {
					alert
				}
			}
		}
	}
})

```

<!-- tabs:end -->
<!-- panels:end -->






## Views

[Screenshot of views]

## Cards

[Screenshot of cards]

## Forms

[Screenshot of forms]

## Lists

[Screenshot of lists]

## Feeds

[Screenshot of feeds]

## Layouts

[Screenshot of layouts]
