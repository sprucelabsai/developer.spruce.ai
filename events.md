# Events

Listening for, reacting to, and emitting events are an extremely powerful part of how the Experience Platform works.

Before getting started, lets take a look at a hypothenical situation where a `Skill 1` wants to prevent the default message from being sent to the guest and instead sends its own.

// TODO with event contracts, not every skill is listening
![Event Architecture](_images/did-enter.gif?raw=true "Event Architecture")

# Types of events

There are a 2 types of events in the platform and each are unique in how they are used and named.

1. `Real World Events` - You want to provide other skills the chance to react to physical and digital events (like a tripping a motion sensor or rendering a form).
    - Always start with `will` or `did`
    - `will` events are designed to let skills stop or modify an experience and before it starts and always honor `preventDefault` (more on that below)
    - `did` events are triggered after an event has occurred
2. `CRUD Events` - You are exposing some CRUD (create, read, update, delete) functionality
    - Start with `create`, `get`, `update`, `delete`
    - Think of them as a 1 for 1 with traditional REST endpoints

# Listening to events

There are 2 steps to listening to an event from your skill.

## Step 1: Event contracts

The first thing you have to do is tell the Experience Platform the events you intend to listen to. Navigate to your skills `config/default.js` file and scroll down to the `eventContract` block.

### Example

```js
// config/default.js
eventContract: {
  events: {
    'did-message': { // the name of the event
        subscribe: true // you are subscribing
    },
    'did-enter': {
        subscribe: true
    }
    'did-update-user': {
        subscribe: true
    },
    'was-installed': {
        subscribe: true
    },
    'vip-alerts:will-send-vip-alerts': { // the word before the colon : is another skills' slug
        subscribe: true
    },
    'booking:did-book-appointment': { // everytime someone books an appointment from the booking skill
        subscribe: true
    }
  }
}
```

## Step 2: Event listeners

Creating an event listener is as simple as dropping a `.js` file into `server/events` that matches the event's name.

Here are some examples of listeners

-   `did-signup` -> `server/events/did-signup.js`
-   `did-enter` -> `server/events/did-enter.js`
-   `did-leave` -> `server/events/did-leave.js`
-   `did-message` -> `server/events/did-message.js`
-   `did-add-device` -> `server/events/did-add-device.js`
-   `vip-alerts:will-send-vip-alerts` -> `server/events/vip-alerts/will-send-vip-alerts.js`
-   `booking:did-book-appointment` -> `server/events/booking/did-book-appointment.js`

Once you have your `eventContract` configured and your `Event Listener` created, you can start to have some fun!

### Example

```js
// server/events/did-enter.js
module.exports = async (ctx, next) => {
    console.log("a did-enter was just fired, eff yeah!");

    const { event, auth } = ctx;
    const { Location, User } = auth;

    // Some async logic here
    ctx.sb.message(Location.id, User.id, `Welcome to ${Location.name}!`);

    await next();
};
```

## Event Object

The `event` object on the `ctx` has the following properties:

-   `deliveryTry`: `number` - The number of times this event has been attempted. If your skill is unreachable or errors out, the event may be attempted again.
-   `eventId`: `UUID4` - Every event is given a randomly generated id to help with debugging and tracking. For instance, if you emit an event based on another skill's event, passing through the `eventId` can make debugging easier.
-   `name`: `string` - The name of the event, e.g. `did-enter`.
-   `locationId`: `UUID4` (optional) - If this event is tied to a location, it will be populated. It is better to use the `Location` on `ctx.auth` because it is verified against core.
-   `organizationId`: `UUID4` - ID of the organization tied to the event. It is better to use the `Organization` on `ctx.auth` because it is verified against core.
-   `userId` : `UUID4` (optional) - The user tied to this event. Use the `User` object on `ctx.auth` because it is verified against core.
-   `payload` : `object` - An arbitrary object send by the emitter of the event (skill or core).

## Auth Object

The `auth` object on the `ctx` has the following properties by default. You can customize the GQL that is used to verify the data in `config/auth.js`:

-   `User`: `User` - (optional) The User model tied to this event. Check `server/models/User.js` for available properties.
-   `Location`: `Location` - (optional) The Location model tied to this event. Check `server/models/Location.js` for available properties.
-   `Organization`: `Organization` - The Organization model tied to this event. Check `server/models/Organization.js` for available properties.

# Core Events

The following events exist without any skills installed.

TODO: add additional core events (location-schedule, teammate-location-schedule, etc)

-   `did-signup` - When a guest "opts into" a location. Check `ctx.status === 'online'` to know if they signed up by joining the wifi.
-   `did-enter` - When a guest returns and their phone hits the wifi.
-   `did-leave` - Triggered an hour after a guest leaves the wifi.
-   `did-message` - A guest has sent a text to Sprucebot.
-   `did-add-device` - When a guest adds a new device to a location (.e.g. laptop or tablet).
-   `did-update-profile` - When any user updates their first or last name.
-   `did-opt-out` - When any guest opts out of a location. By now you have already lost access to their meta data.
-   `did-rejoin` - They had, at one time, opted out. But, now they have remotely opted back in.
-   `will-send-training` - Sprucebot has made the decision that now is the perfect time to send training material.
-   `was-installed` - When the skill is first installed to a location.

# Emitting events

My favorite part of the event system is that installing new skills introduces new events into the platform. This allows you to build your motion sensor skill, connect it to a RaspberryPi, emit a `motion-sensor:did-detect-motion` event, and give other skills the ability to build entire Experiences triggered by motion.

But, that's not the only reason you want to emit an event in your skill. You may actually want to utilize another skill's CRUD event to save or update a setting.

There are actually 4 ways you can emit an event:

1. To all skills enabled at a location
    1. Great for real world events that take place at a location that has local effects, like a motion sensor
    2. The event name will start with your skill's slug
2. To a specific skill enabled at a location
    1. Used for CRUD events, e.g. `booking:book-appointment`
    2. The event name starts with the target skill's slug
3. To all skills installed at an organization
    1. For real world events that have organization wide impacts, e.g. `booking:did-delete-service`
    2. The event name will start with your skill's slug
4. To a specific skill installed at an organization
    1. Used for CRUD events that apply to an entire org, e.g. `booking:create-service`
    2. The event name starts with the target skill's slug

## Step 1: Event contracts

Just like you did for events you want to subscribe to, you have to define the skills you will be emitting.

### Example

```js
// config/default.js
eventContract: {
  events: {
    'my-awesome-skill:did-trigger-motion-sensor': { // the slug of your skill and then the name of your event
        publish: true // you are publishing this event
    },
    'my-awesome-skill:set-motion-sensor-sensitivity': {
        publish: true
    }
  }
}
```

## Step 2: Emit your event

### Example

```js
// emit your custom will- event to all skills enabled at a location
const willResponses = await ctx.sb.emit(
    locationId,
    "my-awesome-skill:will-do-something",
    {
        foo: "bar"
    }
);

// example on how to emit to all skills installed at an org (with no location)
/*
const willResponses = await ctx.sb.emitOrganization(
    organizationId,
    "my-awesome-skill:will-do-something",
    {
        foo: "bar"
    }
);
*/

// did anyone prevent default?
const preventDefault = willResponses.reduce((preventDefault, response) => {
    return preventDefault || !!response.payload.preventDefault;
}, false);

// if someone prevented default, bail
if (preventDefault) {
    return false;
}

// we were not canceled, lets look at the first response and see if the skill passed anything back
const first = willResponses[0];
let results = [];

if (first && first.payload.someRandomOption) {
    log.debug(
        `the first skill responded with someRandomOption = ${someRandomOption}`
    );

    // Emit to a CRUD event in another skill and wait for the results
    results = await ctx.sb.emit(
        locationId,
        "another-skill:create-new-records",
        {
            someRandomOption: true
        }
    );
}

// now that we're done, lets let everyone know
await ctx.sb.emit(locationId, "my-awesome-skill:did-do-something", {
    hello: "again",
    results: results
});
```

## Emit API

-   `ctx.sb.emit(locationId, eventName, payload = {}, options, eventId)`
-   `ctx.sb.emitOrganization(organizationId, eventName, payload = {}, options, eventId)`

Attributes:

-   `locationId`: `UUID4` - The id of the location you want to emit to
-   `eventName`: `string` - The name of the event you are emitting. If the name starts with your skill`s slug, the event will go to every skill installed at the location. If the name starts with another skill's slug, it'll only go to that skill
-   `payload`: `object` (optional) - Anything you can `JSON.stringify` that is passed along with the event
-   `options` : `object` (optional) - Additional config for this event
    -   `timeout`: `number` (optional, _Default: 5000_) - How long we should wait around for skills to respond
    -   `retry`: `boolean` (optional, _Default: true_) - Should core retry emitting this event on the chance an error ocurress
-   `eventId`: `UUID4` (optional) - Pass a custom UUID that is sent through to all skills listening to the event. If one is not passed, one is autogenerated by core

## EventResponse object

These are the properties you'll get on the response object from both `emit` and `emitOrganization`.

-   `Skill`: `object`
    -   `name`: `string` - The human readable name of a skill
    -   `slug`: `string` - The skills machine readable name
-   `payload` : `object` (optional) - An arbitrary, optional object returned from the skill listening to the event you emitted

# Cancelling an event's default behavior

Events, such as `did-signup`, have an expected behaviors that can be cancelled. In this case, core sends a `message` to the `user` with a link to their profile. If you wanted to stop that message and send your own, you could do this.

```js
// server/events/did-signup.js
module.exports = async (ctx, next) => {
    try {
        // send some rewards and do some error handling
        await ctx.services.rewards.send(ctx.event);
        // stop the default "Thanks for joining" since we just sent them a reward
        ctx.body = { preventDefault: true };
    } catch (err) {
        console.error("failed to send rewards in did-signup");
        console.error(err.stack || err);
    }

    await next();
};
```
