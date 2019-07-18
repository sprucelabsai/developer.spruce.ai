# Sprucebot API

This kit uses [`spruce-node`](https://github.com/sprucelabsai/workspace.sprucebot-skills-kit/tree/canary/packages/spruce-node) to communicate with Experience Platform. The `sb` object is available through `gql` via `ctx.sb` and `this.sb` on [services and utilities](services-utilities.md) and is where these methods live.

Heads up; Querying for data is done via the [ORM](orm.md). But, since the ORM is read-only for core models (Users, Locations, Jobs, etc.), you will need to use the methods below.

## Users

A user is a human that is signed up on the platform. This can be a guest, teammate, manager, group manager, or owner (check [these](roles-jobs-perms.md) docs for more deets). sIf you need to update or create a user, you can use the following.

Note: Adding users is only available to Enterprise Skills. All other skills can invite a user through a [view](view.md).

-   `sb.createUser(values)` - Creates a new user (enterprise only)
    -   `values`: `object` - The properties to set for this user
        -   `firstName`: `string` (optional) - The user's first name
        -   `lastName`: `string` (optional) - The user`s last name
        -   `phoneNumber`: `string` - The user's phone and the only required field
        -   `locationId`: `UUID4` - The location they are signing up to
        -   `role`: `enum(guest|teammate|manager|groupManager|owner)` (optional) - The default role is guest. You can find more details [here](roles-jobs-perms.md).
-   `sb.updateUser(id, values)` - Updates a user
    -   `id`: `UUID4` - The ID of the user you want to update
    -   `values`: `object` - The new properties you want to set for this user
        -   `firstName`: `string` (optional) - The user's new first name
        -   `lastName`: `string` (optional) - The user`s new last name

## Locations

```js
// Fetch a single location
const location = await ctx.sb.location(locationId: UUID4)

console.log(location) // {} or null

// All locations where this skill is installed
const locations = await ctx.sb.locations({
    page:, // optional (defaults to 0)
    limit: Number // optional (defaults to 10, max 200)
})

console.log(locations) // [{},{}] or []
```

## Messaging

Good stuff about messaging [here](messages.md).

```js
// Send a message
const message = await ctx.sb.message(locationId: UUID4, userId: UUID4, message:
 String, {
    linksToWebView: Bool, // optional (true|false)
    webViewQueryData: Object, // optional (query string sent to skill when user taps it)
    payload: Object // optional, anything else you want to pass through to the messaging layer
});
```

## Mutex

Any operations that are prone to race conditions, such as "check if a record exists, if not, create it", need a way to block to ensure 2 simultaneous requests don't create duplicate records.

```js
const waitKey = `long-operation-by-location-${locationId}`;

try {
    // stop many requests from causing a race condition
    await ctx.sb.wait(waitKey)

    ...


} catch (err) {
    console.error(err)
    throw err
} finally {
    // no matter what, don't forget to stop waiting
    ctx.sb.go(waitKey)
}
```
