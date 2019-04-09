# Events

Events are a wicked powerful part of Sprucebot. They make your Skill relevant. Example; messaging "Welcome to `` ${`user.Location.name`} ``, `` ${`user.User.casualName`} ``!" is way more powerful when it's sent on `did-enter`!

The following diagram follows the `did-enter` event as it flows through the system. In this example, `Skill 1` is muting the default "Welcome Back" message and sending it's own.

<p align="center">
<img src="images/did-enter.gif?raw=true" />
</p>

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

## Core Events

These events are built in. They all come with `event.User`.

- `did-signup` - When a guest signs up at a location. Check ctx.status === 'online' to know if they are on the wifi
- `did-enter` - When a guest returns and their phone hits the wifi
- `did-leave` - Triggered an hour after a guest leaves
- `did-message` - A guest has sent a text to Sprucebot
- `did-add-device` - When a guest adds a new device to a location. Like adding their laptop
- `did-update-profile` - When any user updates their first or last name
- `did-opt-out` - When any guest opts out of a location. By now you have already lost access to their meta data.
- `did-rejoin` - They had, at one time, opted out. But, now they have remotely opted back in
- `will-send-training` - Sprucebot has made the decision that now is the perfect time to send training material
- `was-installed` - When the skill is first installed to a location. This event can be used to set up any necessary seed data. Only `event.Location` is set.

## Listening to events

Creating an `event` listener is as simple as dropping a `.js` file into `server/events` that matches the `event`'s name. Note, you only have 5 seconds to respond to an event, so the order you do things matters.

- `did-signup` -> `server/events/did-signup.js`
- `did-enter` -> `server/events/did-enter.js`
- `did-leave` -> `server/events/did-leave.js`
- `did-message` -> `server/events/did-message.js`
- `did-add-device` -> `server/events/did-add-device.js`

```js
// server/events/did-enter.js
module.exports = async (ctx, next) => {
  console.log('a did enter was just fired, eff yeah!')
  next() // respond, but no need to await

  const { event } = ctx

  console.log(event) // Event
  // Some async logic here
}
```

## Listening to custom events

A custom `event` is broken into 2 segments, the `slug` of the skill emitting it and the `event-name`. For example, the `Vip Alert` skill will emit `vip-alerts:will-send` just before an alert is sent to the team. You can hook into this event and cancel it, modify the messages sent, or send your own alerts. If you replace the `:` with a `/`, you'll have your file path.

- `vip-alerts:will-send` -> `server/events/vip-alerts/will-send.js`
- `scratch-win:will-manually-send` -> `server/events/scratch-win/will-manually-send.js`

## CRUD Events

For events you listen to that perform an action in your skill, follow a <verb>-<noun> naming convention. For example, I might emit `booking:create-appointment` or `booking:get-location-services`

- Create (POST): `create`

- Read (GET): `get`

- Update (PATCH): `update`

- Set (PUT): `set`

- Delete (DELETE): `delete`

## Emitting custom events

Skills communicate with each other using the `event` system. Custom events are in the form of: <tense>-<verb>-<noun>, `will-send-vip-alert`.

```js
const config = require('config')
const responses = await ctx.sb.emit(ctx.auth.Location.id, 'scratch-and-win:will-manually-send', {
    userId: ctx.user.User.id, // the id of the guest (ctx.user set in middleware)
    message: ctx.utilities.lang('manualSendMessage', {
        to: ctx.user.User.id,
        from: ctx.auth.User.id
    }),
    teammateId: ctx.auth.User.id,
    sendToSelf: config.DEV_MODE // this event will emit back to you (for testing)
}, { // OPTIONAL Custom options
  timeout: 10000 // Custom timeout for this event. In milliseconds
  retry: false // Whether this event should be retried if it fails to be delivered
})

console.log(responses) // [EventResponse, EventResponse]
```

## Event Contracts

In order to receive events you'll need to subscribe to them. Likewise, in order to emit events you should publish them along with information about required parameters. You'll set these up in `config/default.js`

```
eventContract: {
  events: {
    ///////// CUSTOM EVENTS /////////
    'booking:get-service': {
      description: 'Gets a single service',
      publish: true,
      subscribe: false,
      schema: {
        request: {
          serviceId: {
            required: true,
            type: 'string'
          },
          includeServiceBlocks: {
            required: false,
            type: 'boolean'
          }
        },
        response: {
          type: object,
          schema: {
            status: {
              type: 'string',
              description: 'This will be either "success" or "failure"'
            },
            service: {
              type: 'object',
              description: 'The whole Service object'
            }
          }
        }
      }
    },
    ///////// CORE EVENTS /////////
    'did-message': {
      subscribe: true
    },
    'did-enter': {
      name: 'did-enter',
      description: 'When a guest returns and their phone hits the wifi'
    }
    'did-update-user': {
      description: 'When a user role is updated',
      subscribe: true
    },
    'was-installed': {
      description: 'When the skill is installed to a location',
      subscribe: true
    },

  }
}
```

## EventResponse object

```js
{
    skill: {
        name: String, // fancy name of the skill (Vip Alert or Scratch & Win)
        slug: String // slug of the skill, used in it emits custom events
    },
    payload: Object // anything JSON.stringify'able
}
```

## Cancelling an event's default behavior

Events, such as `did-signup`, have an expected behavior. In this case, core sends a `message` to the `user` with a link to their profile. If you wanted to stop that message and send your own, you could do this.

```js
// server/events/did-signup.js
module.exports = async (ctx, next) => {
  // stop the default "Thanks for joining" and push them a reward.
  ctx.body = { preventDefault: true }

  // since we have 5 seconds to respond, we'll invoke next()
  // but, we don't need to await around 😂
  next()

  try {
    // send some rewards and do some error handling
    await ctx.services.rewards.send(ctx.event)
  } catch (err) {
    console.error('failed to send rewards in did-signup')
    console.error(err.stack || err)
  }
}
```

## Naming events that are triggered by actions in your skill

We follow a `will`/`did` convention for our events. When creating your own event, start it with `will-` or `did-`.

`Will` events happen before an operation and should always honor `preventDefault`.

`Did` events happen after any operation.

```js
// emit your custom event
const responses = await this.sb.emit(
  guest.Location.id,
  'myskill:will-do-something',
  {
    foo: 'bar'
  }
)

// did anyone prevent default?
const preventDefault = responses.reduce((preventDefault, response) => {
  return preventDefault || !!response.payload.preventDefault
}, false)

// bail
if (preventDefault) {
  return false
}
```

## Gotchya's

- Event listeners need to respond in 5 seconds or they will be ignored. That means you may need to respond to Sprucebot right away and run your logic after.
- Custom events will not `emit` back to your skill unless you set `sendToSelf=true`. This makes testing way easier, but should def be off in production (why we tie it to `DEV_MODE=true`).
- Your skill's `slug` can't be arbitrary. It is assigned to you by Spruce Labs when you begin creating your skill.

## Examples

### Modifying the Vip Alert 💥 message to something we like better

**Difficulty level**: Easy

**Description:** The Vip Alert 💥 skill allows teammates and owners to configure who triggers an arrival alert. We don't wanna have to rebuild all that functionality, we just want to change the message that is sent when a guest arrives.

<p align="center">
<img src="images/vip.will-send.gif?raw=true" />
</p>

**Required reading:**

- [Meta](meta.md)
- [Lang](lang.md)
- [Vip Alerts](https://github.com/sprucelabsai/sprucebot-skill-vip-alerts)

#### Hook into the event

We'll simply create the listener by creating our `.js` file.

```js
// server/listeners/vip-alerts/will-send.js
module.exports = async (ctx, next) => {
  // pull out a few things
  const {
    event,
    event: { payload }
  } = ctx

  // this is an array of messages [{teammateId: String, body: String}, {...}]
  // we want to preserve the teammateId because that is who is receiving the alert
  // but we want to make the message better.
  const messages = payload.messages.map(message => {
    return {
      teammateId: message.teammateId,
      body: ctx.utilities.lang.getText('betterVip', { guest: event })
    }

    // note: an `event` object has the same schema as the `user` object
  })

  // vip alert skill will take it from here
  ctx.body = {
    messages
  }

  next()
}
```

#### Define the terms

Please don't ever make a message like this. It'll land you in hot water. ;)

```js
// interface/lang/default.js
module.exports = {
  didEnterMessage: ({ guest }) =>
    `Oh no! ${guest.User.name} is here. Better get the f*** out!`
}
```

# What's next?

Sweet! Since we've been doing a lot with `lang`, lets learn some more about it in the [`lang` docs](lang.md).
