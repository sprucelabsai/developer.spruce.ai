# Sprucebot Audit Logging

When a user takes an action in your skill we should keep track of it! You just need to add `ctx.sb.audit(...)` calls to any place where a user is changing data, sending messages, etc.

## ctx.sb.audit() parameters

`type` _(required)_ - The type of event that is occurring. This should be a string without spaces. This will let you filter for particular events in the future.

`action` _(required)_ - A short description of the action that was taken. This will be displayed in the audit log as <User> <action>.

`userId` _(required)_ - The currently logged in user or the user who initiated the action.

`description` _(optional)_ - A longer, full description of exactly what was changed.

`locationId` _(optional)_ - If this action applies to a location, set the `locationId`

`organizationId` _(optional)_ - If this action applies to an organization, set the `organizationId`

`meta` _(optional)_ - Any additional data as a JSON object. This information will be passed to your skill as query parameters if a user clicks on this audit log item to learn more. You should include any information you'll need to deep link the user to a place with more information about this action.

### Example Usage

In the below example, the audit log would read (short description is the first line, long description is the second line):

"Ken created an appointment"
"Created an appointment for Corban at Spruce for 2018-10-30 at 14:30"

If an owner reading the audit log clicked on it, your skill would be loaded with:
`/?guestId=<GUEST ID>&appointmentId=<APPOINTMENT ID>`

In your skill index page you'd want to read these query parameters and deep link to the guest profile where appointments are listed.

```js
// This is async and will not return anything. If the call fails, log.warn(e) will be called with the error
ctx.sb.audit({
	type: 'createAppointment',
	action: 'created an appointment',
	description: `Created an appointment for ${ctx.auth.User.casualName} at ${
		location.name
	} for ${day} at ${startTime}`,
	userId: ctx.auth.User.id,
	locationId: location.id,
	organizationId: location.OrganizationId,
	meta: {
		guestId,
		appointmentId: appointment.id
	}
})
```
