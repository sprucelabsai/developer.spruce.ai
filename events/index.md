# Events
Situational awareness.

```bash
spruce event:create [name]

spruce event:handle [name]

spruce event:sync

# Tell the organization that you provide a valid response to this event
spruce event:provide [namespace] [name]

```

# Mercury Event Engine

Mercury is the engine that drives the digital mapping and signaling of physical events in the Spruce Platform. 

It enables you to orchestrate complex interactions between people and things in such a way as to blend the technology so beautifully into our lives that we don’t event know it’s there.

## Mercury Mindset

![Mercury](../_images/mercury.png?raw=true "Mercury")

A noun can exist in the physical or digital world. It can be a person, a calendar event, or even a physical button. By abstracting all people, places, and things to simply a `noun`, you can interact with anything using a simple, intuitive api.

In addition to core events, skills have the ability to introduce their own events. Then, skills can leverage those new events to create totally unique experiences!! It's super powerful! You can checkout [event docs](events.md) for more deets.

// TODO: Update diagram to show skills introducing new events
![Event Architecture](../_images/Architecture.png?raw=true "Event Architecture")

## Types of events

There are a 2 types of events in the platform and each are unique in how they are used and named.

1. `Real World Events` - You want to provide other skills the chance to react to physical and digital events (like a tripping a motion sensor or rendering a form).
    - Always start with `will` or `did`
    - `will` events are designed to let skills stop or modify an experience and before it starts and always honor `preventDefault` (more on that below)
    - `did` events are triggered after an event has occurred
2. `CRUD Events` - You are exposing some CRUD (create, read, update, delete) functionality
    - Start with `create`, `get`, `update`, `delete`
    - Think of them as a 1 for 1 with traditional REST endpoints

## Versioning

## Getting notified of errors