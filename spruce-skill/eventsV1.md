# Event Version 1

## Event object

The `event` object is really a [`user`](user.md) object, with one exception; `event.User` and associated fields are optional. Whether or not an `event.User` exists in the `event` is up to the Skill that emits it. For core and 99% of skills, you can expect `event.User` and it's associated fields to exist. Each skill _should_ document the events they `emit`, so you won't be guessing. In fact, at the time of this writing, there is not a single case where a `event.User` is not provided.

```js
{
    Location: Location, // required
    User: User, // optional
    createdAt: Date, // date the guest joined the location (optional)
    updatedAt: Date, // date the guest changed their subscription to the location (optional)
    role: String, // owner|teammate|guest (optional)
    status: String, // offline|online (optional)
    visits: Number, // how many visits to this location (optional)
    lastRecordedVisit: Date, // when they last visited the shop (optional)
    payload: Object // data the skill or core is passing on (optional)
}
```