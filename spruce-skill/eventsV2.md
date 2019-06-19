# Event Version 2

The latest event version which supports Skill Views.

## Event Object

The incoming event is automatically processed and _might_ contain any (or none) of:

* `userId` - The id of the User associated with this event

* `locationId` - The id of the Location associated with this event

* `organizationId` - The id of the Organization associated with this event

If these ids are detected, a call is made to the Core API to get the data which are then attached to `ctx.auth`

The data that is fetched and attached to `ctx.auth` is based on [your skill's config/auth.js file](https://github.com/sprucelabsai/workspace.sprucebot-skills-kit/blob/dev/packages/spruce-skill/config/auth.js).

In practice your incoming event will look like:

```js
const { event, auth } = ctx
// "payload" is the data emitted with the event
// "eventId" is a unique id associated with this event
// "retryId" is only defined if this event is being retried
// "name" is the event name: 'did-enter' for example
const { payload, eventId, retryId, name } = event

let User
let Location
let Organization
if (auth) { // auth may not be defined
	User = auth.User // might not be defined
	Location = auth.Location // might not be defined
	Organization = auth.Organization // might not be defined
}

// Handle the event...
```